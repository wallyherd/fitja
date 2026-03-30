'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = {}

  if (formData.has('full_name')) updateData.full_name = formData.get('full_name') as string
  if (formData.has('primary_goal')) updateData.primary_goal = formData.get('primary_goal') as string
  if (formData.has('whatsapp')) updateData.whatsapp = formData.get('whatsapp') as string
  if (formData.has('avatar_url')) updateData.avatar_url = formData.get('avatar_url') as string
  
  if (formData.has('height')) {
    const raw = formData.get('height') as string
    const val = parseFloat(raw)
    updateData.height = isNaN(val) ? 0 : val
  }
  if (formData.has('weight')) {
    const raw = formData.get('weight') as string
    const val = parseFloat(raw)
    updateData.weight = isNaN(val) ? 0 : val
  }
  if (formData.has('age')) {
    const raw = formData.get('age') as string
    const val = parseInt(raw, 10)
    updateData.age = isNaN(val) ? 0 : val
  }
  if (formData.has('activity_level')) updateData.activity_level = formData.get('activity_level') as string
  if (formData.has('gender')) updateData.gender = formData.get('gender') as string


  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    console.error('[PROFILE UPDATE ERROR]', error)
    return { error: 'Falha ao atualizar perfil' }
  }

  revalidatePath('/app/profile')
  revalidatePath('/app/dashboard')
  return { success: true }
}


export async function updateGoalsAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const daily_water_goal_ml = Number(formData.get('daily_water_goal_ml'))
  const workout_frequency = formData.get('workout_frequency') as string

  await supabase
    .from('profiles')
    .update({ 
      daily_water_goal_ml,
      workout_frequency
    })
    .eq('id', user.id)

  revalidatePath('/app/profile')
  revalidatePath('/app/settings')
}
