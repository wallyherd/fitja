import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// O Heartbeat do Billing: Escuta os eventos da Stripe e sincroniza o Banco.
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) return NextResponse.json({ error: 'Webhook Secret required' }, { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Pagamento Realizado com Sucesso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    if (userId) {
       // Buscar a data de expiração da assinatura
       const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;
       const endDate = new Date(subscription.current_period_end * 1000).toISOString()

       await supabase
         .from('profiles')
         .update({
           subscription_status: 'active',
           stripe_customer_id: customerId,
           stripe_subscription_id: subscriptionId,
           subscription_end_date: endDate
         })
         .eq('id', userId)
    }
  }

  // 2. Assinatura Deletada ou Vencida
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabase
      .from('profiles')
      .update({ subscription_status: 'none' })
      .eq('stripe_customer_id', customerId)
  }

  // 3. Upgrade ou Modificação (Simples no MVP)
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string
    const endDate = new Date(subscription.current_period_end * 1000).toISOString()

    await supabase
      .from('profiles')
      .update({ 
        subscription_status: subscription.cancel_at_period_end ? 'canceled' : 'active',
        subscription_end_date: endDate 
      })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
