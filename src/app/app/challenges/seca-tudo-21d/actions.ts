'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinChallenge(challengeSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check Challenge
  const { data: challenge } = await supabase.from('challenges').select('id').eq('slug', challengeSlug).single()
  if (!challenge) throw new Error('Challenge not found')

  // Check Subscription
  const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
  if (profile?.subscription_status !== 'active') throw new Error('Premium required')

  // Join
  const { error } = await supabase.from('challenge_participants').upsert({
    challenge_id: challenge.id,
    user_id: user.id
  })

  if (error) throw error
  revalidatePath(`/app/challenges/${challengeSlug}`)
}

export async function addActivity(challengeSlug: string, type: 'photo' | 'meal' | 'checkin', imageUrl?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get Participant
  const { data: challenge } = await supabase.from('challenges').select('id').eq('slug', challengeSlug).single()
  if (!challenge) throw new Error('Challenge not found')

  const { data: participant } = await supabase
    .from('challenge_participants')
    .select('id')
    .eq('challenge_id', challenge.id)
    .eq('user_id', user.id)
    .single()

  if (!participant) throw new Error('Not a participant')

  // Points mapping
  const points = { photo: 50, meal: 20, checkin: 30 }[type]

  // Add Activity
  const { error: actErr } = await supabase.from('challenge_activities').insert({
    participant_id: participant.id,
    activity_type: type,
    points_earned: points,
    image_url: imageUrl
  })

  if (actErr) throw actErr

  // Update Total Points
  await supabase.rpc('update_participant_points', { p_participant_id: participant.id })

  revalidatePath(`/app/challenges/${challengeSlug}`)
}

export async function getChallengeData(challengeSlug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: challenge } = await supabase.from('challenges').select('*').eq('slug', challengeSlug).single()
  if (!challenge) return null

  const { data: participant } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challenge.id)
    .eq('user_id', user.id)
    .single()

  // Ranking
  const { data: ranking } = await supabase
    .from('challenge_participants')
    .select(`
      total_points,
      profiles (full_name, avatar_url)
    `)
    .eq('challenge_id', challenge.id)
    .order('total_points', { ascending: false })
    .limit(10)

  // Feed (Photos)
  const { data: feed } = await supabase
    .from('challenge_activities')
    .select(`
      image_url,
      created_at,
      challenge_participants (
        profiles (full_name, avatar_url)
      )
    `)
    .eq('activity_type', 'photo')
    .order('created_at', { ascending: false })
    .limit(20)

  return { challenge, participant, ranking, feed }
}
