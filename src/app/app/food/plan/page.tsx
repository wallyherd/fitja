import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/design-system'
import { Sparkles, Replace, ChevronRight, Apple } from 'lucide-react'

// Mock para simulação da Phase 3 (Diet Plans backend)
const MOCK_MEALS = [
  { id: '1', name: 'Café da Manhã', calories: 450, macros: { p: 30, c: 40, f: 15 }, items: ['Ovos Mexidos (3)', 'Pão Integral (2)', 'Café Preto'] },
  { id: '2', name: 'Almoço', calories: 700, macros: { p: 45, c: 80, f: 20 }, items: ['Peito de Frango (150g)', 'Arroz Branco (100g)', 'Feijão (80g)', 'Salada'] },
  { id: '3', name: 'Pré-Treino', calories: 250, macros: { p: 10, c: 45, f: 5 }, items: ['Banana (1)', 'Whey (15g)', 'Aveia (30g)'] },
  { id: '4', name: 'Jantar', calories: 550, macros: { p: 40, c: 40, f: 15 }, items: ['Patinho Moído (130g)', 'Macarrão (80g)', 'Brócolis'] }
]

export default async function DietPlanPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Se o servidor ainda não processou o plano, mostrar botão "Gerar Planner"
  const hasPlan = !!profile?.target_calories

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-sans font-extrabold text-zinc-900 tracking-tight mb-2">
          Seu Plano,
        </h1>
        <p className="text-zinc-500 font-medium leading-relaxed">
          Estratégia calculada para seu motor metabólico baseado no treino de hoje.
        </p>
      </header>

      {hasPlan && (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-[2rem] shadow-[0_12px_40px_-8px_rgba(79,70,229,0.5)] mb-8 text-white">
          <div className="flex justify-between items-center mb-6">
             <div>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Motor Metabólico</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-sans font-black tracking-tighter">{profile.target_calories}</span>
                   <span className="text-indigo-300 font-medium text-sm">kcal</span>
                </div>
             </div>
             <Apple className="w-10 h-10 text-indigo-400 opacity-50" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
               { label: 'Prot', val: profile.target_macros?.protein_g, color: 'text-blue-300' },
               { label: 'Carb', val: profile.target_macros?.carbs_g, color: 'text-green-300' },
               { label: 'Gord', val: profile.target_macros?.fat_g, color: 'text-yellow-300' },
            ].map(m => (
              <div key={m.label} className="bg-white/10 p-3 rounded-2xl text-center">
                 <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-200 mb-1">{m.label}</p>
                 <p className={`text-lg font-black leading-none ${m.color}`}>{m.val}g</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-800">Refeições Estratégicas</h2>
          <Button variant="ghost" size="sm" className="text-teal-600 font-bold">
            <Sparkles className="w-4 h-4 mr-1" /> Otimizar
          </Button>
        </div>

        <div className="space-y-4">
          {MOCK_MEALS.map(meal => (
             <div key={meal.id} className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-zinc-900">{meal.name}</h3>
                   <span className="bg-zinc-100 text-zinc-600 text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-md">
                     {meal.calories} kcal
                   </span>
                </div>
                
                <ul className="space-y-1 mb-4">
                  {meal.items.map((it, i) => (
                    <li key={i} className="text-[13px] text-zinc-500 font-medium flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full before:mr-2">
                       {it}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 border-t border-zinc-50 pt-3">
                  <div className="flex gap-3 text-[11px] font-bold text-zinc-400">
                     <span>P: {meal.macros.p}g</span>
                     <span>C: {meal.macros.c}g</span>
                     <span>G: {meal.macros.f}g</span>
                  </div>
                </div>

                {/* Swap Button (Smart Suggestion) */}
                <button className="absolute bottom-4 right-4 text-indigo-500 hover:text-indigo-600 font-bold text-[12px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Replace className="w-4 h-4" /> Trocar
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
