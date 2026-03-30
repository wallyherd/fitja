import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProgressRing, StreakBadge } from '@/components/ui/design-system'
import { WaterLogClient } from './components/WaterLogClient'

export default async function WaterDashboardPage() {
  const supabase = await createClient()

  // 1. Core Data
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, daily_logs(water_ml)')
    .eq('id', user.id)
    .single()

  const { data: waterLogs } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .order('time', { ascending: false })

  // 2. Logic (Dashboard Sync e Goal)
  const goal = profile?.daily_water_goal_ml || 2500
  // Para exibir na UI, lemos o acumulado "real-time" do banco ou sumário na página
  const consumed = waterLogs?.reduce((ac, cu) => ac + (cu.amount_ml||0), 0) || 0
  const missing = Math.max(0, goal - consumed)
  const percent = Math.min(100, Math.round((consumed / goal) * 100))
  const streak = profile?.current_streak || 1

  return (
    <div className="max-w-md mx-auto pt-10 font-body min-h-screen">
       <WaterLogClient logs={waterLogs || []} profile={profile} />
    </div>
  )
}
