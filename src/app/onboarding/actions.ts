'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateTargetMacros } from '@/utils/nutrition'

export async function saveOnboardingProfile(answers: Record<string, string>) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Usuário não autenticado.')
  }

  // Conversões e Sanatização
  const waterGoal = parseInt(answers.daily_water_goal_ml || '2500', 10)
  const height = answers.height ? parseFloat(answers.height) : null
  const weight = answers.weight ? parseFloat(answers.weight) : null
  const age = answers.age ? parseInt(answers.age, 10) : null
  
  // Tratando restrições formatadas em array para o profile expandido
  const restrictions = answers.main_struggle && answers.main_struggle !== 'Nenhuma Restrição' 
    ? [answers.main_struggle] 
    : []

  const { error: updateError, data: updatedProfile } = await supabase
    .from('profiles')
    .update({
      gender: answers.gender,
      age: age,
      height: height,
      weight: weight,
      activity_level: answers.activity_level,
      primary_goal: answers.primary_goal,
      workout_frequency: answers.workout_frequency,
      hardest_time: answers.hardest_time,
      main_struggle: answers.main_struggle, // mantendo string legado se necessário
      dietary_restrictions: restrictions, // novo array jsonb/text[]
      daily_water_goal_ml: waterGoal,
      coaching_preference: answers.coaching_preference,
      onboarding_completed: true
    })
    .eq('id', user.id)
    .select()

  if (updateError) {
    console.error('Falha ao salvar onboarding:', updateError)
    throw new Error('Houve um erro salvando suas preferências.')
  }

  // 2. Calcula as metas calóricas baseadas nos dados atualizados
  const profileRecord = updatedProfile?.[0]
  if (profileRecord) {
    const macros = calculateTargetMacros(profileRecord)
    if (macros) {
       await supabase.from('profiles').update({
         target_calories: macros.calories,
         target_macros: { carbs_g: macros.carbs, protein_g: macros.protein, fat_g: macros.fat }
       }).eq('id', user.id)
       // Aqui viria a chamada /api/food/generate-plan para criar a Tabela de Diet Plans real
    }
  }

  revalidatePath('/', 'layout')
}
