'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Ação de Log Rápido (Mesma engenharia que usamos na Dashboard, pra centralizar em /app/water)
export async function logWater(amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const date = new Date().toISOString().split('T')[0]
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`

  // O DB Trigger 'on_water_changed' cuidará do DailyLogs!
  await supabase.from('water_logs').insert({ user_id: user.id, date, time, amount_ml: amount })

  // Garante que exista log diario (Fallback)
  await supabase.rpc('ensure_daily_log', { user_id_param: user.id, date_param: date })

  revalidatePath('/app/water')
  revalidatePath('/app/dashboard')
}

// Ação de Apagar Log Específico (Histórico de Correção)
export async function deleteWaterLog(id: string) {
  const supabase = await createClient()
  await supabase.from('water_logs').delete().eq('id', id)
  revalidatePath('/app/water')
  revalidatePath('/app/dashboard')
}

// Ação para Editar Meta (Meta fica na Profile)
export async function updateWaterGoal(newGoal: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('profiles').update({ daily_water_goal_ml: newGoal }).eq('id', user.id)
  revalidatePath('/app/water')
  revalidatePath('/app/dashboard')
}
