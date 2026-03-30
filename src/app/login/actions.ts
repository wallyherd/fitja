'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginUser(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Por+favor+informe+email+e+senha')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Log real do erro para diagnóstico no servidor
    console.error('[LOGIN ERROR]', error.message, error.status, error.code)
    
    // Mensagem amigável baseada no tipo de erro
    let msg = 'Email ou senha inválidos.'
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      msg = 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
    } else if (error.message?.toLowerCase().includes('invalid login')) {
      msg = 'Email ou senha incorretos. Verifique seus dados.'
    } else if (error.message) {
      msg = error.message
    }
    
    redirect(`/login?error=${encodeURIComponent(msg)}`)
  }

  console.log('[LOGIN SUCCESS] User:', data.user?.email)
  revalidatePath('/', 'layout')
  redirect('/app/dashboard')
}
