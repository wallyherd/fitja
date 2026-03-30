import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  PremiumLockOverlay,
  ProgressRing,
  SophiaBlock,
  StreakBadge,
  AchievementBadge,
  SectionHeader,
} from '@/components/ui/design-system'
import {
  Dumbbell,
  Utensils,
  Droplet,
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  ShieldAlert,
  ChevronRight,
  BarChart3,
  Salad,
  BookOpen,
  CalendarDays,
  Trophy,
  Flame,
  Sparkles
} from 'lucide-react'
import { syncUserStats } from './actions'
import { getSophiaAdvice } from '@/utils/ai'
import { DashboardClient } from './DashboardClient'


function getSophiaDayStatus(
  progress: number,
  hour: number,
  hasWater: boolean,
  hasFood: boolean,
  hasWorkout: boolean
): { msg: string; isAlert: boolean } {
  const missingItems = []
  if (!hasWater) missingItems.push('sua água')
  if (!hasFood) missingItems.push('suas refeições')
  if (!hasWorkout) missingItems.push('seu treino')

  if (progress === 100)
    return {
      msg: "Você é imparável! Fechou o seu 'Dia Saudável' com maestria. Seu streak está garantido. Pode descansar sabendo que evoluiu.",
      isAlert: false,
    }

  if (hour >= 18 && progress < 100) {
    const remaining = missingItems.join(' e ')
    if (progress > 60)
      return {
        msg: `O relógio está correndo, falta pouco! Não deixe a preguiça matar seu streak. Vá registrar ${remaining} antes que o dia vire.`,
        isAlert: true,
      }
    return {
      msg: `Atenção: Faltam poucas horas e você ainda não protegeu seu progresso. Registre ${remaining} urgente!`,
      isAlert: true,
    }
  }

  return { msg: '', isAlert: false }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  await syncUserStats()

  const today = new Date().toISOString().split('T')[0]
  const currentHour = new Date().getHours()
  const greetingParts = ['Bom dia', 'Boa tarde', 'Boa noite']
  const greeting =
    currentHour < 12 ? greetingParts[0] : currentHour < 18 ? greetingParts[1] : greetingParts[2]

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: dailyLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  const { data: todayMeals } = await supabase
    .from('meals')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)

  const { data: trophies } = await supabase
    .from('achievements_log')
    .select('badge_slug')
    .eq('user_id', user.id)

  const hasLoggedFood = (todayMeals?.length || 0) > 0
  const hitWater = (dailyLog?.water_ml || 0) >= (profile?.daily_water_goal_ml || 2500)
  const isWorkoutDone = dailyLog?.workout_done || false

  const sophiaAdvice =
    profile?.subscription_status === 'active' ? await getSophiaAdvice(user.id) : null

  let score = 0
  if (hasLoggedFood) score += 33.33
  if (hitWater) score += 33.33
  if (isWorkoutDone) score += 33.34
  const progressPercent = Math.min(100, Math.round(score))
  const isComplete = progressPercent === 100

  const dayStatus = getSophiaDayStatus(
    progressPercent,
    currentHour,
    hitWater,
    hasLoggedFood,
    isWorkoutDone
  )
  const displayMsg =
    dayStatus.msg ||
    sophiaAdvice ||
    'Lance seus progressos de hoje para manter a constância. Cada pequeno passo conta.'

  const myBadges = trophies?.map((t) => t.badge_slug) || []
  const firstName = profile?.full_name?.split(' ')[0] || 'Atleta'

  const pillars = [
    {
      done: hasLoggedFood,
      icon: Utensils,
      label: 'Alimentação',
      href: '/app/food',
      colorDone: '#16a34a',
      colorPending: '#9ca3af',
    },
    {
      done: hitWater,
      icon: Droplet,
      label: 'Hidratação',
      href: '/app/water',
      colorDone: '#0ea5e9',
      colorPending: '#9ca3af',
    },
    {
      done: isWorkoutDone,
      icon: Dumbbell,
      label: 'Treino',
      href: '/app/workouts',
      colorDone: '#f59e0b',
      colorPending: '#9ca3af',
    },
  ]

  return (
    <DashboardClient 
       streak={profile?.current_streak || 1}
       points={progressPercent}
       userName={profile?.full_name || 'Vencedor'}
       isComplete={isComplete}
    >
        <div className="max-w-md mx-auto px-4 pt-7 pb-2 font-body" style={{ background: '#f8fafb' }}>

        {/* ─── HEADER ─────────────────────────────────── */}
        <header className="flex items-center justify-between mb-6 px-1">
            <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9ca3af' }}>
                {greeting}
            </p>
            <h1 className="text-[24px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>
                {firstName} 👋
            </h1>
            </div>
            <StreakBadge count={profile?.current_streak || 1} />
        </header>

        {/* ─── HERO PROGRESS CARD ─────────────────────── */}
        <div
            className="relative overflow-hidden rounded-[var(--radius-3xl)] p-7 mb-4 flex flex-col items-center"
            style={{
            background: isComplete
                ? 'linear-gradient(145deg, #16a34a 0%, #22c55e 40%, #14b8a6 100%)'
                : 'linear-gradient(145deg, #0d9488 0%, #14b8a6 50%, #0ea5e9 100%)',
            boxShadow: isComplete
                ? '0 20px 60px -10px rgba(22,163,74,0.4), 0 4px 16px rgba(22,163,74,0.15)'
                : '0 20px 60px -10px rgba(14,184,166,0.35), 0 4px 16px rgba(20,184,166,0.12)',
            }}
        >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'rgba(0,0,0,0.06)' }} />

            <div className="relative z-10 mb-5 px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{isComplete ? '🏆 Motor Calibrado!' : 'Seu Motor Metabólico'}</p>
            </div>

            <div className="relative z-10">
            <ProgressRing percentage={progressPercent} size={180} color="rgba(255,255,255,0.95)" trackColor="rgba(255,255,255,0.18)" strokeWidth={12} />
            </div>

            <div className="flex gap-2.5 mt-6 relative z-10 w-full justify-center">
            {pillars.map(({ done, icon: Icon, label, href }) => (
                <Link key={label} href={href} className="flex flex-col items-center gap-1.5 flex-1 py-3 px-2 rounded-[18px] active-press" style={{ background: done ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)', border: done ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: done ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[9px] font-black text-white/80 uppercase tracking-wider">{label}</span>
                {done ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Circle className="w-3 h-3 text-white/30" />}
                </Link>
            ))}
            </div>
        </div>

        {/* ─── FUNCIONALIDADES PREMIUM (REFINADAS) ─── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            {[
            { label: 'Meu Cardápio', icon: Salad, color: '#10b981', bg: '#f0fdf4', href: '/app/food/plan' },
            { label: 'Histórico', icon: BarChart3, color: '#f59e0b', bg: '#fffbeb', href: '/app/workouts/history' },
            { label: 'Treino Smart', icon: Dumbbell, color: '#6366f1', bg: '#eef2ff', href: '/app/workouts/live' },
            ].map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center p-4 rounded-[var(--radius-xl)] bg-white border border-black/5 active-press shadow-sm group hover:border-brand-500/30 transition-all">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110" style={{ background: item.bg }}><item.icon className="w-5 h-5 flex-shrink-0" style={{ color: item.color }} /></div>
                <span className="text-[11px] font-black text-zinc-900 leading-none">{item.label}</span>
            </Link>
            ))}
        </div>

        {/* ─── STATUS / SOPHIA ─────────────────────────── */}
        <div className="mb-6">
            {dayStatus.isAlert ? (
            <div className="p-4 rounded-[var(--radius-xl)] flex gap-3.5 items-start bg-rose-50 border border-rose-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500 shadow-lg shadow-red-500/20"><ShieldAlert className="w-5 h-5 text-white" /></div>
                <div><div className="flex items-center gap-2 mb-1"><p className="text-[11px] font-black uppercase tracking-wider text-red-600">Alerta de Streak</p></div><p className="text-[13px] leading-relaxed font-bold text-red-700">{displayMsg}</p></div>
            </div>
            ) : <SophiaBlock message={displayMsg} />}
        </div>

        {/* ─── QUICK ACTIONS ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
            {pillars.map(({ done, icon: Icon, label, href, colorDone }) => (
            <Link key={label} href={href} className="flex flex-col items-center gap-2 py-4 rounded-[var(--radius-xl)] active-press" style={{ background: '#ffffff', border: done ? `1.5px solid ${colorDone}30` : '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: done ? `${colorDone}14` : '#f8fafb' }}>
                <Icon className="w-5 h-5" style={{ color: done ? colorDone : '#9ca3af' }} />
                </div>
                <p className="text-[10px] font-bold text-center uppercase tracking-wide leading-tight" style={{ color: done ? '#374151' : '#9ca3af' }}>{label}</p>
            </Link>
            ))}
        </div>

        {/* ─── RAKING PREVIEW ───────────────────────── */}
        <div className="mb-6">
            <SectionHeader title="Liga Semanal" action="Ver Ranking" actionHref="/app/dashboard/ranking" />
            <Link href="/app/dashboard/ranking" className="p-4 rounded-[var(--radius-xl)] bg-[#0a0f1e] text-white flex items-center justify-between relative overflow-hidden active-press shadow-lg shadow-black/10">
            <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                <p className="text-[14px] font-black tracking-tight leading-none mb-1">Duelo de Titãs</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sua posição: #12</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
            </Link>
        </div>

        {/* ─── DESAFIOS ──────────────────────────────── */}
        <div className="mb-6">
            <SectionHeader title="Desafios Ativos" />
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <Link href="/app/challenges/seca-tudo-21d" className="min-w-[240px] p-5 rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-white shadow-lg relative overflow-hidden shrink-0 active:scale-[0.98] transition-all">
                <Flame className="absolute -right-2 -bottom-2 w-20 h-20 text-white/10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-white/70">Desafio VIP</p>
                <h4 className="text-[16px] font-sans font-black tracking-tight mb-3">Seca Tudo 21D</h4>
                <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold opacity-80">🔥 Ativo por 4 dias</span>
                <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">PARTICIPAR</div>
                </div>
            </Link>
            </div>
        </div>

        {/* ─── CONQUISTAS ──────────────────────────────── */}
        <div className="mb-6">
            <SectionHeader title="Conquistas Recentes" />
            <div className="grid grid-cols-2 gap-3">
            <AchievementBadge title="Primeiro Passo" isLocked={!myBadges.includes('starter')} />
            <AchievementBadge title="Fogo de 3 Dias" isLocked={!myBadges.includes('3_days')} />
            </div>
        </div>

        {/* ─── PREMIUM AD ─────────────────────────────── */}
        <div className="mb-32">
            <SectionHeader title="Elite Performance" />
            <Link href="/app/premium">
            <div className="p-5 rounded-[var(--radius-xl)] flex items-center justify-between bg-white border border-teal-500/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-teal-500/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 border border-teal-100"><Sparkles className="w-6 h-6 text-teal-600" /></div>
                <div><h4 className="font-sans font-black text-[15px] tracking-tight text-gray-900 leading-none mb-1">SophIA Pro Coach</h4><p className="text-[12px] font-medium text-gray-400">Desbloqueie o potencial máximo.</p></div>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-600" />
            </div>
            </Link>
        </div>

        </div>
    </DashboardClient>
  )
}
