'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveMealManual(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const date = new Date().toISOString().split('T')[0]
  const name = (formData.get('name') as string) || 'Refeição'
  const time = (formData.get('time') as string) || new Date().toTimeString().slice(0, 5)
  const observation = (formData.get('observation') as string) || null
  const rawCalories = formData.get('totalCalories') as string
  const totalCalories = isNaN(parseInt(rawCalories)) ? 0 : parseInt(rawCalories)

  // 1. Cria a Refeição Mestra
  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .insert({
      user_id: user.id,
      date,
      name,
      time: `${time}:00`, // garantir formato HH:MM:SS
      observation,
      total_calories: totalCalories
    })
    .select()
    .single()

  if (mealError) {
    console.error('[MEAL INSERT ERROR]', mealError)
    return { error: `Erro ao criar refeição: ${mealError.message}` }
  }

  if (!meal) {
    console.error('[MEAL INSERT EMPTY]')
    return { error: 'Erro crítico: Refeição não retornada pelo banco.' }
  }

  // 2. Cria os Itens
  const itemsJson = formData.get('itemsMap') as string
  if (itemsJson) {
    try {
      const items = JSON.parse(itemsJson)
      if (items.length > 0) {
        const mappedItems = items.map((i: any) => ({
          meal_id: meal.id,
          name: i.name || 'Item',
          amount: isNaN(Number(i.amount)) ? 0 : Number(i.amount),
          unit: i.unit || 'g',
          calories: isNaN(Number(i.calories)) ? 0 : Math.floor(Number(i.calories))
        }))
        const { error: itemsError } = await supabase.from('meal_items').insert(mappedItems)
        if (itemsError) console.error('[MEAL ITEMS ERROR]', JSON.stringify(itemsError))
      }
    } catch(e) {
      console.error('Falha ao parsear items JSON', e)
    }
  }


  // 3. Garante daily_log para o dia (upsert simples em vez de RPC)
  await supabase
    .from('daily_logs')
    .upsert({ user_id: user.id, date }, { onConflict: 'user_id,date', ignoreDuplicates: true })

  revalidatePath('/app/food')
  revalidatePath('/app/dashboard')
}

export async function deleteMeal(mealId: string) {
  const supabase = await createClient()
  await supabase.from('meals').delete().eq('id', mealId)
  revalidatePath('/app/food')
  revalidatePath('/app/dashboard')
}
