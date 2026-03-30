import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Você precisa estar logado para virar Premium!' }, { status: 401 })
  }

  // Atualiza o perfil logado para Premium (active)
  const { error } = await supabase
    .from('profiles')
    .update({ subscription_status: 'active' })
    .eq('id', user.id)

  // Avisa que deu tudo certo!
  return NextResponse.json({
    success: true,
    message: "Acesso PREMIUM Ativado com sucesso! Você já é considerado assinante.",
    next_step: "Volte para a aba do Dashboard e pressione F5 para recarregar as funcionalidades."
  })
}
