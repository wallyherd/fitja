'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signupUser(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const whatsapp = formData.get('whatsapp') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || name.length < 3) {
    redirect('/signup?error=Seu+nome+deve+ter+3+ou+mais+caracteres')
  }

  // Validar WhatsApp (mínimo 10 digitos)
  const whatsappDigits = whatsapp.replace(/\D/g, '')
  if (!whatsapp || whatsappDigits.length < 10) {
    redirect('/signup?error=Informe+seu+WhatsApp+com+DDD+e+número+completo')
  }

  if (password.length < 6) {
    redirect('/signup?error=Sua+senha+deve+ter+no+m%C3%ADnimo+6+caracteres')
  }

  if (password !== confirmPassword) {
    redirect('/signup?error=As+senhas+informadas+n%C3%A3o+batem')
  }

  const referralCode = formData.get('referralCode') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: name,
        full_name: name,
        whatsapp: whatsappDigits,
      }
    }
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // 1. Vincular Referral se existir
  let referrerId = null
  if (referralCode) {
    const { data: refUser } = await supabase.from('profiles').select('id').eq('referral_code', referralCode).single()
    if (refUser) referrerId = refUser.id
  }

  // 2. Salvar whatsapp e referral no perfil
  if (data.user) {
    await supabase
      .from('profiles')
      .update({ 
        first_name: name,
        full_name: name,
        referred_by_id: referrerId
      })
      .eq('id', data.user.id)
  }

  // Autenticação foi confirmada! Limpa o cache e encaminha pro onboarding.
  revalidatePath('/', 'layout')
  redirect('/onboarding')
}
