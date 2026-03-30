import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MealLogClient } from './components/MealLogClient'
import { ProgressRing, StreakBadge } from '@/components/ui/design-system'
import { getPremiumStatus } from '@/utils/premium'

export default async function FoodDashboardPage() {
  const supabase = await createClient()

  // 1. Auth Server Side
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  // 2. Setup dos Dados: Traz as Refeições do dia interligadas aos Seus Itens
  const { data: meals } = await supabase
    .from('meals')
    .select(`
      *,
      meal_items (*)
    `)
    .eq('user_id', user.id)
    .eq('date', today)
    .order('time', { ascending: true })

  // 3. Calculo do Agregado do dia para Calibragem no Header
  const totalCaloriesToday = meals?.reduce((acc, curr) => acc + (curr.total_calories || 0), 0) || 0
  const dailyGoal = 2200 // Mock: Em prod, viria da tabela 'profiles' após a config da Meta.
  const calPercent = Math.min(100, Math.round((totalCaloriesToday / dailyGoal) * 100))
  
  // 4. Checagem de Premium status
  const { isPremium } = await getPremiumStatus()

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body">
      
      {/* HEADER DE COMBUSTÍVEL DIÁRIO */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-zinc-900 tracking-tight">
            Diário,
          </h1>
          <p className="text-zinc-500 font-medium">{today.split('-').reverse().join('/')}</p>
        </div>
        <StreakBadge count={1} />
      </header>

      {/* PAINEL GLOBAL CARREGA DADOS DO BANCO REAL ESTILIZADO*/}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-6 rounded-[2.5rem] shadow-[0_12px_40px_-8px_rgba(16,185,129,0.5)] flex items-center justify-between mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
        
        <div className="text-white relative z-10 w-1/2 pr-4">
           <h2 className="font-bold text-lg mb-1 leading-tight">Você consumiu</h2>
           <p className="text-4xl font-sans font-black mb-2 tracking-tighter">{totalCaloriesToday}</p>
           <p className="text-emerald-100 font-semibold text-sm">da meta de {dailyGoal} kcal</p>
        </div>

        <div className="relative z-10 scale-90 -mr-6 -my-4">
           <ProgressRing percentage={calPercent} size={150} color="stroke-white" label="Meta" />
        </div>
      </div>

      <div className="flex justify-between items-end mb-4 pr-1">
        <h2 className="text-lg font-bold text-zinc-800">Suas Refeições</h2>
        <span className="text-xs font-bold text-zinc-400">{meals?.length || 0} registradas</span>
      </div>

      <div className="mb-6">
        <a href="/app/food/plan" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-between p-4 rounded-2xl shadow-lg relative overflow-hidden active:scale-[0.98] transition-all group">
           <div className="relative z-10 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-tight flex items-center gap-1">Cardápio Inteligente</h3>
                <p className="text-[11px] font-medium text-emerald-100">Visualize seu plano e IA swap</p>
              </div>
           </div>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right text-white/50 group-hover:text-white transition-colors relative z-10"><path d="m9 18 6-6-6-6"/></svg>
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
        </a>
      </div>

      {/* CLIENT COMPONENT: Lida com Forms, Camera Mockups, e Modais sem gerar peso pro servidor. */}
      <MealLogClient meals={meals || []} isPremium={isPremium} />

    </div>
  )
}
