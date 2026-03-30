'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Função utilitária para pegar a data atual no formato YYYY-MM-DD
 */
function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Busca ou Cria o Log Diário de forma atômica
 */
export async function getOrCreateDailyLog() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const today = getTodayString()

  // 1. Tenta buscar o log de hoje
  let { data: log } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  // 2. Se não existe, cria um zerado
  if (!log) {
    const { data: newLog, error } = await supabase
      .from('daily_logs')
      .insert({ user_id: user.id, date: today })
      .select()
      .single()

    if (!error) log = newLog
  }

  return log
}

// ============================================
// AÇÕES DE REGISTRO RÁPIDO (MUTATIONS)
// ============================================

export async function logWaterAction(currentWater: number, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const todayDate = getTodayString()
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`

  // O Trigger 0004 garante o update no 'daily_logs' por você.
  await supabase
    .from('water_logs')
    .insert({ user_id: user.id, date: todayDate, time: timeString, amount_ml: amount })

  revalidatePath('/app/dashboard')
  revalidatePath('/app/water')
}

export async function toggleWorkoutAction(isDone: boolean) {
  const supabase = await createClient()
  const today = getTodayString()
  
  await supabase
    .from('daily_logs')
    .update({ workout_done: isDone })
    .eq('date', today)

  revalidatePath('/app/dashboard')
}

export async function logMealAction(currentMeals: number) {
  const supabase = await createClient()
  const today = getTodayString()
  
  await supabase
    .from('daily_logs')
    .update({ meals_logged: currentMeals + 1 })
    .eq('date', today)

  revalidatePath('/app/dashboard')
}

// ============================================
// MOTOR DE GAMIFICAÇÃO (Roda no Carregamento)
// ============================================

export async function grantAchievement(badgeSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Insere ignorando se ja possuir (Devido a constraint UNIQUE no banco)
  await supabase.from('achievements_log').insert({ user_id: user.id, badge_slug: badgeSlug })
}

export async function syncUserStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = getTodayString()
  const { data: profile } = await supabase.from('profiles').select('current_streak, last_check_in').eq('id', user.id).single()

  if (!profile) return

  const lastCheckIn = profile.last_check_in
  const currentStreak = profile.current_streak || 0

  if (lastCheckIn === today) return // Já logou hoje, nada a fazer

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  let newStreak = currentStreak

  if (lastCheckIn === yesterdayString) {
    newStreak += 1
  } else if (!lastCheckIn) {
    newStreak = 1 // Primeiro checkin
    await grantAchievement('starter')
  } else {
    newStreak = 0 // Quebrou o streak (mais de 1 dia de gap)
  }

  // Atualiza Streak e Checkin no Perfil
  await supabase.from('profiles').update({ current_streak: newStreak, last_check_in: today }).eq('id', user.id)

  // Checa Milestones de Conquista
  if (newStreak >= 3) await grantAchievement('3_days')
  if (newStreak >= 7) await grantAchievement('7_days')

  // Não usar revalidatePath aqui, pois esta fn é chamada direto no SSR da página e causará erro no next.js.
  // revalidatePath('/app/dashboard')
}

