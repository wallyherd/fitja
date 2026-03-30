import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, ChevronLeft, Lock } from 'lucide-react'

// O Banco de Medalhas Rígido do FitJá (Evitando DB pesado pra descrição)
const MEDALS = [
  { id: 'starter', title: 'Primeiro Passo', desc: 'Realizou seu primeiro registro oficial.', icon: '🥉' },
  { id: '3_days', title: 'Fogo Inicial: 3 Dias', desc: 'Manteve a chama acesa por 3 dias seguidos.', icon: '🔥' },
  { id: '7_days', title: 'Semana Dourada', desc: 'Lendário! 7 dias sem falhar um sequer.', icon: '🎖️' },
  { id: 'water_5', title: 'Oásis Pessoal', desc: 'Atingiu a meta de água por 5 dias perfeitos.', icon: '💧' },
  { id: 'workout_10', title: 'Máquina Humana', desc: '10 treinos registrados como Mutante.', icon: '🦾' },
  { id: 'meals_20', title: 'Engenheiro Corporal', desc: '20 refeições sob controle tático.', icon: '🥩' },
]

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // Pega as tags destravadas
  const { data: logs } = await supabase.from('achievements_log').select('badge_slug, earned_at').eq('user_id', user.id)
  
  const myBadges = logs?.reduce((acc: Record<string, string>, item) => {
    acc[item.badge_slug] = new Date(item.earned_at).toLocaleDateString('pt-BR')
    return acc
  }, {}) || {}

  const unlockedCount = Object.keys(myBadges).length

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body pb-32">
       
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-zinc-900 tracking-tight">Estante</h1>
          <p className="text-zinc-500 font-medium">Marcas de constância adulta.</p>
        </div>
        <Link href="/app/dashboard" className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-zinc-600"/>
        </Link>
      </header>
      
      <div className="bg-zinc-900 p-6 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-2xl relative overflow-hidden">
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full" />
         <div>
            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-1">Medalhas Ativas</p>
            <p className="text-white font-sans font-black text-4xl">{unlockedCount} <span className="text-zinc-600 text-xl font-medium tracking-tight">/ {MEDALS.length}</span></p>
         </div>
         <Trophy className="w-12 h-12 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
          {MEDALS.map(medal => {
             const isUnlocked = !!myBadges[medal.id]
             const dateStr = myBadges[medal.id]

             return (
               <div key={medal.id} className={`p-5 rounded-[2rem] flex flex-col items-center text-center transition-all ${isUnlocked ? 'bg-amber-50 border-2 border-amber-200 shadow-sm' : 'bg-zinc-50 border border-zinc-100 grayscale opacity-60'}`}>
                  
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${isUnlocked ? 'bg-amber-100' : 'bg-zinc-200'}`}>
                    {medal.icon}
                  </div>
                  
                  <h3 className={`font-bold text-sm leading-tight mb-1 ${isUnlocked ? 'text-amber-900' : 'text-zinc-700'}`}>{medal.title}</h3>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">{isUnlocked ? `Em ${dateStr}` : 'Bloqueado'}</p>
                  
                  <p className="text-zinc-400 text-xs font-medium leading-snug">{medal.desc}</p>
                  
                  {!isUnlocked && <Lock className="w-4 h-4 text-zinc-300 mt-2" />}
               </div>
             )
          })}
      </div>
    </div>
  )
}
