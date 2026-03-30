import Stripe from 'stripe'

// O pacote da Stripe no Node exige um input que não seja string vazia
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_to_pass_build'

if (stripeSecretKey === 'sk_test_dummy_key_to_pass_build' && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables. Build proceeding but checkouts will fail.')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-03-25.dahlia' as any,
  typescript: true,
})
