'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveWorkoutManual(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const date = new Date().toISOString().split('T')[0]
  const time = formData.get('time') as string
  const type = formData.get('type') as string
  const duration = parseInt(formData.get('duration') as string || '0')
  const intensity = formData.get('intensity') as string
  const calories = parseInt(formData.get('calories') as string || '0')
  const observation = formData.get('observation') as string

  const { error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      date,
      time,
      type,
      duration_minutes: duration,
      intensity,
      calories_burned: calories,
      observation
    })

  if (error) {
    console.error('Workouts Erro:', error)
    return { error: 'Erro ao salvar o treino.' }
  }

  // Sync DailyLog in case it doesn't exist yet (Upsert instead of potentially missing RPC)
  await supabase
    .from('daily_logs')
    .upsert({ user_id: user.id, date }, { onConflict: 'user_id,date', ignoreDuplicates: true })

  revalidatePath('/app/workouts')
  revalidatePath('/app/dashboard')
}


export async function deleteWorkout(id: string) {
  const supabase = await createClient()
  await supabase.from('workouts').delete().eq('id', id)
  
  revalidatePath('/app/workouts')
  revalidatePath('/app/dashboard')
}
