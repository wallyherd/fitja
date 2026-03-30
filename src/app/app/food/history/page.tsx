import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge, EmptyState } from '@/components/ui/design-system'
import { CalendarSearch, Utensils, ChevronLeft, Flame } from 'lucide-react'

export default async function FoodHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: meals } = await supabase
    .from('meals')
    .select(`*, meal_items (*)`)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('time', { ascending: true })
    .limit(50)

  const groupedMeals = (meals || []).reduce((acc: any, meal: any) => {
    if (!acc[meal.date]) acc[meal.date] = []
    acc[meal.date].push(meal)
    return acc
  }, {})

  const dates = Object.keys(groupedMeals)

  return (
    <div className="max-w-md mx-auto pb-32 font-body" style={{ background: '#f8fafb', minHeight: '100vh' }}>

      {/* ─── HEADER ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 flex items-center gap-4 px-5 py-3.5"
        style={{
          background: 'rgba(248,250,251,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Link
          href="/app/food"
          className="w-9 h-9 rounded-full flex items-center justify-center active-press"
          style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#6b7280' }} />
        </Link>
        <div>
          <h1 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>
            Histórico
          </h1>
          <p className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>Seus registros anteriores</p>
        </div>
      </header>

      <div className="px-4 pt-5">
        {/* ─── FILTER CHIPS ────────────────────────────── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['Todos os Dias', 'Essa Semana', 'Com Observação'].map((label, i) => (
            <button
              key={label}
              className="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-bold active-press transition-all"
              style={
                i === 0
                  ? { background: '#0a0f1e', color: '#ffffff' }
                  : {
                      background: '#ffffff',
                      color: '#6b7280',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── CONTENT ─────────────────────────────────── */}
        {dates.length === 0 ? (
          <EmptyState
            title="Nenhum registro ainda"
            description="Registre suas refeições diariamente para ver o histórico."
            icon={CalendarSearch}
          />
        ) : (
          <div className="space-y-8">
            {dates.map((date) => {
              const dayMeals = groupedMeals[date]
              const totalDay = dayMeals.reduce(
                (ac: number, curr: any) => ac + (curr.total_calories || 0),
                0
              )
              const [year, month, day] = date.split('-')
              const displayDate = `${day}/${month}/${year}`
              const today = new Date().toISOString().split('T')[0]
              const isToday = date === today

              return (
                <section key={date}>
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: '#9ca3af' }}>
                        {displayDate}
                      </p>
                      {isToday && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: '#f0fdfb', color: '#0d9488', border: '1px solid rgba(20,184,166,0.2)' }}
                        >
                          Hoje
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                      <span className="text-[13px] font-bold" style={{ color: '#374151' }}>
                        {totalDay.toLocaleString('pt-BR')} kcal
                      </span>
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="space-y-3">
                    {dayMeals.map((meal: any) => (
                      <div
                        key={meal.id}
                        className="p-4 rounded-[var(--radius-xl)]"
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.07)',
                          boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                              style={{ background: '#f0fdfb' }}
                            >
                              <Utensils className="w-4 h-4" style={{ color: '#0d9488' }} />
                            </div>
                            <div>
                              <p className="text-[14px] font-bold" style={{ color: '#111827' }}>
                                {meal.name}
                              </p>
                              <p className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>
                                {meal.meal_items?.length || 0} itens
                              </p>
                            </div>
                          </div>
                          <Badge variant="ghost">{meal.time.slice(0, 5)}</Badge>
                        </div>

                        {meal.total_calories > 0 && (
                          <div
                            className="flex items-center gap-1.5 mt-2 pt-2"
                            style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            <Flame className="w-3 h-3" style={{ color: '#f59e0b' }} />
                            <span className="text-[12px] font-bold" style={{ color: '#6b7280' }}>
                              {meal.total_calories} kcal
                            </span>
                          </div>
                        )}

                        {meal.observation && (
                          <p
                            className="text-[11px] italic mt-2 p-2.5 rounded-[10px]"
                            style={{ background: '#f8fafb', color: '#9ca3af' }}
                          >
                            &ldquo;{meal.observation}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
