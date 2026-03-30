import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Flame, Clock, TrendingUp, ChevronLeft } from 'lucide-react'

// Mock Data para Progressão
const HISTORY = [
  { id: '1', date: '2026-03-29', name: 'Leg Day (Foco Posteriores)', duration: 45, rpe: 8, load: 4500 },
  { id: '2', date: '2026-03-27', name: 'Upper Body', duration: 52, rpe: 7, load: 3800 },
  { id: '3', date: '2026-03-25', name: 'Corrida + Core', duration: 40, rpe: 6, load: 1200 },
]

export default async function WorkoutHistoryPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  return (
    <div className="min-h-screen bg-[#f8fafb] font-body flex flex-col pt-14 pb-28">
      
      {/* ── HEADER ── */}
      <header className="px-5 mb-8 flex items-center justify-between">
         <Link href="/app/workouts" className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-full flex items-center justify-center active-press">
            <ChevronLeft className="w-5 h-5 text-zinc-600" />
         </Link>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center mb-0.5 mt-2">DADOS DE PERFORMANCE</p>
            <h1 className="text-xl font-sans font-black text-zinc-900 tracking-tight">Evolução do Fogo</h1>
         </div>
         <div className="w-10"></div>
      </header>

      <main className="px-5 space-y-4">
         
         {/* DASHBOARD CARD (Premium Positioning) */}
         <div className="bg-gradient-to-tr from-rose-500 to-orange-500 p-6 rounded-[2rem] text-white shadow-lg shadow-orange-500/20 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-rose-100 mb-1">Carga Total Deslocada (Mês)</h2>
            <div className="flex items-baseline gap-2">
               <span className="text-5xl font-sans font-black tracking-tighter">18.4</span>
               <span className="text-rose-200 font-bold mb-1">Toneladas</span>
            </div>
            
            <div className="mt-5 flex gap-4">
               <div className="flex-1 bg-white/10 rounded-2xl p-3">
                  <Flame className="w-5 h-5 text-orange-200 mb-2" />
                  <p className="text-[10px] font-bold text-rose-100 uppercase mt-1">PSE Médio</p>
                  <p className="text-xl font-black">7.4</p>
               </div>
               <div className="flex-1 bg-white/10 rounded-2xl p-3">
                  <TrendingUp className="w-5 h-5 text-orange-200 mb-2" />
                  <p className="text-[10px] font-bold text-rose-100 uppercase mt-1">Sessões</p>
                  <p className="text-xl font-black">12</p>
               </div>
            </div>
         </div>

         {/* HISTORICO LIST */}
         <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-800">Sessões Recentes</h2>
         </div>

         <div className="space-y-3">
            {HISTORY.map(session => (
               <div key={session.id} className="bg-white p-4 rounded-[1.5rem] border border-zinc-100 shadow-sm flex flex-col gap-3 group relative overflow-hidden">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{session.date.split('-').reverse().join('/')}</p>
                        <h3 className="font-bold text-zinc-900 text-[15px]">{session.name}</h3>
                     </div>
                     <div className="flex bg-rose-50 text-rose-600 px-3 py-1.5 rounded-[10px] items-center gap-1.5 font-black text-[12px]">
                        <Flame className="w-3.5 h-3.5" /> PSE {session.rpe}
                     </div>
                  </div>

                  <div className="flex gap-4 border-t border-zinc-50 pt-3 text-[12px] font-medium text-zinc-500">
                     <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {session.duration} min</span>
                     <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {session.load} kg Vol.</span>
                  </div>
               </div>
            ))}
         </div>

      </main>
    </div>
  )
}
