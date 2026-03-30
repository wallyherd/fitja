import { createClient } from './supabase/server'

export type PremiumState = 'active' | 'expired' | 'canceled' | 'none' | 'past_due'

/**
 * Verifica o status exato da assinatura no Server-Side
 */
export async function getPremiumStatus(): Promise<{
  isPremium: boolean
  status: PremiumState
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { isPremium: false, status: 'none' }

  // Admin Override (whdv1995@gmail.com tem acesso Premium Vitalício)
  if (user.email === 'whdv1995@gmail.com') {
    return { isPremium: true, status: 'active' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_end_date')
    .eq('id', user.id)
    .single()

  if (!profile) return { isPremium: false, status: 'none' }

  const status = (profile.subscription_status as any) as PremiumState
  const endDate = profile.subscription_end_date ? new Date(profile.subscription_end_date) : null
  const now = new Date()

  // 1. Caso de Expiraço (Data passou)
  if (endDate && endDate < now && (status === 'active' || status === 'canceled')) {
    return { isPremium: false, status: 'expired' }
  }

  // 2. Casos de Prmium Ativo
  if (status === 'active' || (status === 'canceled' && endDate && endDate > now)) {
    return { isPremium: true, status }
  }

  return { isPremium: false, status }
}
