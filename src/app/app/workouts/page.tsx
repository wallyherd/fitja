import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { WorkoutLogClient } from './components/WorkoutLogClient'
import { Badge, StreakBadge, PremiumLockOverlay, GlassCard, SophiaBlock } from '@/components/ui/design-system'
import { CalendarDays, Crown, Sparkles } from 'lucide-react'

export default async function WorkoutsDashboardPage() {
  const supabase = await createClient()

  // 1. Auth & Data
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, daily_logs(workout_done)')
    .eq('id', user.id)
    .single()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .order('time', { ascending: true })

  // 2. Lógica UI
  const isWorkoutDone = profile?.daily_logs?.[0]?.workout_done ?? false
  const totalMinutes = workouts?.reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body">

      {/* HEADER: Acompanhamento Diário Vencedor */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-zinc-900 tracking-tight">Treinos</h1>
          <p className="text-zinc-500 font-medium">{isWorkoutDone ? 'Dever cumprido hoje! ✅' : 'Qual o esporte de hoje?'}</p>
        </div>
        <StreakBadge count={profile?.current_streak || 1} />
      </header>

      {/* RESUMO GLOBAL DIÁRIO COM ACESSO RÁPIDO AO HISTÓRICO */}
      <div className={`p-6 rounded-[2.5rem] flex items-center justify-between mb-8 relative overflow-hidden transition-all duration-500 ${isWorkoutDone ? 'bg-gradient-to-br from-brand-500 to-brand-400 shadow-[0_12px_40px_-8px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]'}`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

        <div className="text-white relative z-10">
          <h2 className="font-bold text-lg mb-1 leading-tight">{isWorkoutDone ? 'Modo Mutante' : 'Músculo Frio'}</h2>
          <p className="text-4xl font-sans font-black mb-1">{totalMinutes}<span className="text-2xl font-medium tracking-tight opacity-70"> min</span></p>
          <p className="text-white/60 font-semibold text-sm">Tempo ativo {isWorkoutDone ? 'pago' : 'zerado'}.</p>
        </div>

        <Link href="/app/workouts/history" className="relative z-10 w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
          <CalendarDays className="w-6 h-6 text-white" />
        </Link>
      </div>

      <div className="flex justify-between items-end mb-4 pr-1">
        <h2 className="text-lg font-bold text-zinc-800">Rotina de Hoje</h2>
        <span className="text-xs font-bold text-zinc-400">{workouts?.length || 0} feitos</span>
      </div>

      {/* COMPONENTE CLIENTE: Renderiza os Atuais e os Modais Híbridos Sem Fricção */}
      <WorkoutLogClient workouts={workouts || []} profile={profile} />


      {/* O UPSELL DA IA: O COACH PERSONALIZADO ("Premium") */}
      <section className="pt-8 pb-32">
        <h2 className="text-lg font-bold text-zinc-800 mb-4 px-1 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" /> Coach SophIA</h2>

        <PremiumLockOverlay>
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-500/20 blur-3xl rounded-full" />

            <div className="relative z-10 flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-brand-400 to-sky-400 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 leading-tight">Sugestão de Treino Gerada</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Com base no seu objetivo de **{profile?.primary_goal || 'Manutenção'}**, você treinou pernas a 3 dias.
                  Sua sugestão algorítmica de hoje é <span className="text-brand-400 font-bold">Treino Superior B</span> focado em resistência.
                </p>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-5 rounded-full text-sm transition-all shadow-sm border border-white/10">Ver Rotina Clicável</button>
              </div>
            </div>
          </div>
        </PremiumLockOverlay>
      </section>

    </div>
  )
}
