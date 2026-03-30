'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Camera, Trash2, Copy, Sparkles, X, Utensils } from 'lucide-react'
import { Button, OverlayWrapper, Input, Badge, PremiumLockOverlay } from '@/components/ui/design-system'
import { FoodSearchInput } from '@/components/ui/FoodSearch'
import { type FoodItem, calcNutrition } from '@/data/foods'
import { saveMealManual, deleteMeal } from '../actions'


type SelectedFood = { food: FoodItem; grams: number }

type FoodEntry = {
  id: string
  selected: SelectedFood | null
}

type Props = {
  meals: any[]
  isPremium?: boolean
}

export function MealLogClient({ meals, isPremium = false }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [premiumAiOpen, setPremiumAiOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    { id: crypto.randomUUID(), selected: null }
  ])

  const totalCalories = foodEntries.reduce((acc, entry) => {
    if (!entry.selected) return acc
    return acc + calcNutrition(entry.selected.food, entry.selected.grams).calories
  }, 0)

  const totalProtein = foodEntries.reduce((acc, entry) => {
    if (!entry.selected) return acc
    return acc + calcNutrition(entry.selected.food, entry.selected.grams).protein
  }, 0)

  const totalCarbs = foodEntries.reduce((acc, entry) => {
    if (!entry.selected) return acc
    return acc + calcNutrition(entry.selected.food, entry.selected.grams).carbs
  }, 0)

  const totalFat = foodEntries.reduce((acc, entry) => {
    if (!entry.selected) return acc
    return acc + calcNutrition(entry.selected.food, entry.selected.grams).fat
  }, 0)

  const addFoodEntry = () => {
    setFoodEntries(prev => [...prev, { id: crypto.randomUUID(), selected: null }])
  }

  const removeFoodEntry = (id: string) => {
    setFoodEntries(prev => prev.filter(e => e.id !== id))
  }

  const updateFoodEntry = (id: string, selected: SelectedFood | null) => {
    setFoodEntries(prev => prev.map(e => e.id === id ? { ...e, selected } : e))
  }

  const resetForm = () => {
    setFoodEntries([{ id: crypto.randomUUID(), selected: null }])
  }

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('totalCalories', totalCalories.toString())

      const itemsMap = foodEntries
        .filter(entry => entry.selected && entry.selected.grams > 0)
        .map(entry => {
          const n = calcNutrition(entry.selected!.food, entry.selected!.grams)
          return {
            name: entry.selected!.food.name,
            amount: entry.selected!.grams,
            unit: entry.selected!.food.unit,
            calories: n.calories,
          }
        })

      formData.append('itemsMap', JSON.stringify(itemsMap))
      const result = await saveMealManual(formData)
      if (result && 'error' in result) {
        alert(`Erro: ${result.error}`)
        return
      }
      setModalOpen(false)
      resetForm()
    } catch (err) {
      console.error('[SAVE MEAL ERROR]', err)
      alert('Erro ao salvar refeição. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }


  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer remover essa refeição?')) {
      await deleteMeal(id)
    }
  }

  // REAL WORKFLOW: SophIA Vision AI
  const [analyzing, setAnalyzing] = useState(false)
  
  const handleRealAiAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAnalyzing(true)
    
    // 1. Converter para Base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const base64 = reader.result as string
        
        // 2. Chamar API de Visão
        const res = await fetch('/api/ai/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        })
        
        const data = await res.json()
        
        if (data.error) {
           alert(data.error)
           setAnalyzing(false)
           return
        }

        // 3. Popular o formulário com o que a IA "Viu"
        if (data.meals) {
          const newEntries = data.meals.map((m: any) => ({
            id: crypto.randomUUID(),
            selected: {
              food: {
                id: m.id || 'custom',
                name: m.name,
                category: 'IA',
                unit: 'g',
                per100: { calories: m.calories, protein: m.protein || 0, carbs: m.carbs || 0, fat: m.fat || 0 }
              },
              grams: 100
            }
          }))
          setFoodEntries(newEntries)
          setPremiumAiOpen(false)
          setModalOpen(true)
        }
      } catch (err) {
        console.error(err)
        alert('Erro ao analisar imagem. Tente novamente.')
      } finally {
        setAnalyzing(false)
      }
    }
  }

  return (
    <div className="pb-36 px-4 max-w-md mx-auto">

      {/* ── FAB BUTTONS ── */}
      <div className="fixed bottom-28 right-5 flex flex-col items-end gap-3 z-40">
        <button
          onClick={() => setPremiumAiOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-full active-press"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.12)',
            color: '#0ea5e9',
          }}
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 rounded-full active-press"
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            boxShadow: '0 8px 28px -4px rgba(20,184,166,0.5)',
            color: '#fff',
            height: '3.25rem',
          }}
        >
          <Plus className="w-5 h-5" />
          <span className="font-black text-[13px] tracking-wide">Add Refeição</span>
        </button>
      </div>

      {/* ── MEAL LIST ── */}
      <div className="space-y-3">
        {meals.length === 0 ? (
          <div
            className="flex flex-col items-center py-14 text-center px-6"
            style={{
              background: '#ffffff',
              border: '1.5px dashed rgba(0,0,0,0.09)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-4"
              style={{ background: '#f0fdfb' }}
            >
              <Utensils className="w-7 h-7" style={{ color: '#14b8a6' }} />
            </div>
            <p className="font-sans font-black text-[16px] mb-1" style={{ color: '#111827' }}>Nenhuma refeição hoje</p>
            <p className="text-[13px] font-medium mb-5" style={{ color: '#9ca3af' }}>
              Registre o que você comeu para acompanhar.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-[13px] font-bold px-5 py-2.5 rounded-full active-press"
              style={{ background: '#f0fdfb', color: '#0d9488', border: '1px solid rgba(20,184,166,0.2)' }}
            >
              Registrar refeição
            </button>
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-[var(--radius-xl)]"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: '#f0fdfb' }}
                  >
                    <Utensils className="w-4 h-4" style={{ color: '#0d9488' }} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>{meal.name}</h3>
                    <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>
                      {meal.time.substring(0, 5)}
                    </span>
                  </div>
                </div>
                <Badge variant="success">{meal.total_calories} kcal</Badge>
              </div>

              {meal.observation && (
                <p className="text-[12px] italic mt-1 mb-2" style={{ color: '#9ca3af' }}>"{meal.observation}"</p>
              )}

              {meal.meal_items && meal.meal_items.length > 0 && (
                <div
                  className="rounded-[12px] p-3 space-y-2 mt-2"
                  style={{ background: '#f8fafb', border: '1px solid rgba(0,0,0,0.04)' }}
                >
                  {meal.meal_items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <span className="text-[12px] font-medium" style={{ color: '#374151' }}>
                        {it.amount}{it.unit} {it.name}
                      </span>
                      <span className="text-[12px] font-bold" style={{ color: '#9ca3af' }}>{it.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="flex justify-end gap-2 pt-3 mt-2"
                style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
              >
                <button
                  className="p-2 rounded-full active-press"
                  style={{ background: '#f8fafb', color: '#9ca3af' }}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="p-2 rounded-full active-press"
                  style={{ background: '#fff1f2', color: '#f43f5e' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MEAL MODAL — Custom full-width bottom sheet ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setModalOpen(false); resetForm() }}
              className="fixed inset-0 z-[90]"
              style={{ background: 'rgba(10,15,30,0.5)', backdropFilter: 'blur(12px)' }}
            />
            {/* Sheet — anchored to bottom, full viewport width, independent of parent px padding */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.05, duration: 0.38 }}
              className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col overflow-hidden"
              style={{
                background: '#ffffff',
                borderRadius: '28px 28px 0 0',
                boxShadow: '0 -16px 80px -8px rgba(0,0,0,0.18)',
                maxHeight: '92dvh',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-9 h-[3px] rounded-full" style={{ background: '#e5e7eb' }} />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 pt-1 pb-4 shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                <h2 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>
                  Registrar Refeição
                </h2>
                <button
                  onClick={() => { setModalOpen(false); resetForm() }}
                  className="w-8 h-8 rounded-full flex items-center justify-center active-press"
                  style={{ background: '#f8fafb', border: '1px solid rgba(0,0,0,0.07)' }}
                >
                  <X className="w-4 h-4" style={{ color: '#6b7280' }} />
                </button>
              </div>

              {/* Scrollable form */}
              <div className="overflow-y-auto flex-1 px-5 py-4" style={{ paddingBottom: '2.5rem' }}>
                <form onSubmit={handleManualSubmit} className="space-y-4">

                  {/* Name + Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Nome do prato</label>
                      <Input name="name" placeholder="Almoço" required defaultValue="Almoço" />
                    </div>
                    <div>
                      <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Horário</label>
                      <Input name="time" type="time" required defaultValue={new Date().toTimeString().slice(0, 5)} />
                    </div>
                  </div>

                  {/* Food section */}
                  <div
                    className="rounded-[var(--radius-xl)] p-4 space-y-3"
                    style={{ background: '#f0fdfb', border: '1px solid rgba(20,184,166,0.12)' }}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold" style={{ color: '#0f766e' }}>Alimentos Consumidos</label>
                      <button
                        type="button"
                        onClick={addFoodEntry}
                        className="text-[12px] font-bold px-3.5 py-1.5 rounded-full active-press"
                        style={{ background: '#ffffff', color: '#0d9488', border: '1px solid rgba(20,184,166,0.2)' }}
                      >
                        + Adicionar
                      </button>
                    </div>

                    <div className="space-y-3">
                      {foodEntries.map((entry, idx) => (
                        <div key={entry.id} className="relative">
                          <FoodSearchInput
                            placeholder={`Buscar alimento ${idx + 1}...`}
                            value={entry.selected}
                            onChange={selected => updateFoodEntry(entry.id, selected)}
                          />
                          {foodEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFoodEntry(entry.id)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                              style={{ background: '#f43f5e', color: '#fff' }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Macro totals */}
                    {totalCalories > 0 && (
                      <div
                        className="rounded-[12px] p-3 grid grid-cols-4 gap-2"
                        style={{ background: '#ffffff', border: '1px solid rgba(20,184,166,0.1)' }}
                      >
                        {[
                          { label: 'Kcal', value: String(Math.round(totalCalories)), color: '#ea580c' },
                          { label: 'Prot', value: `${Math.round(totalProtein * 10) / 10}g`, color: '#2563eb' },
                          { label: 'Carb', value: `${Math.round(totalCarbs * 10) / 10}g`, color: '#16a34a' },
                          { label: 'Gord', value: `${Math.round(totalFat * 10) / 10}g`, color: '#ca8a04' },
                        ].map(m => (
                          <div key={m.label} className="text-center">
                            <p className="text-[9px] font-bold uppercase tracking-wide mb-0.5" style={{ color: '#9ca3af' }}>{m.label}</p>
                            <p className="text-[15px] font-black leading-none" style={{ color: m.color }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Observation */}
                  <div>
                    <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Observação (Opcional)</label>
                    <Input name="observation" placeholder="Comi menos do que devia..." />
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => { setModalOpen(false); resetForm() }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={saving}
                      className="flex-[2]"
                    >
                      Registrar Refeição
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── PREMIUM AI DRAWER ── */}
      <OverlayWrapper isOpen={premiumAiOpen} onClose={() => setPremiumAiOpen(false)}>
        <PremiumLockOverlay isUnlocked={isPremium}>
          <div className="p-6 text-center relative overflow-hidden h-[380px] flex flex-col items-center justify-center">
            <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-sky-50 to-white/0 pointer-events-none" />
            {analyzing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center z-10 w-full h-full">
                <Sparkles className="w-12 h-12 text-sky-500 animate-bounce mb-4" />
                <h3 className="font-extrabold text-sky-900 text-xl font-sans tracking-tight mb-2">SophIA está olhando o prato...</h3>
                <p className="text-sky-700 text-sm">Calculando calorias por visão computacional.</p>
                <div className="w-full h-1 bg-sky-200 mt-8 overflow-hidden rounded-full">
                  <motion.div className="h-full bg-sky-500" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.4 }} />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-sky-400 to-cyan-500 text-white rounded-3xl flex items-center justify-center mb-6 rotate-3"
                  style={{ boxShadow: '0 12px 32px -6px rgba(14,165,233,0.5)' }}
                >
                  <Camera className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 font-sans tracking-tight mb-2">Sem tempo pra digitar?</h3>
                <p className="text-zinc-600 font-medium text-sm mb-6 leading-relaxed max-w-[250px]">
                  Tire uma foto do seu prato. A SophIA cria a tabela nutricional completa automaticamente.
                </p>
                <label className="w-full text-white font-black py-4 rounded-[var(--radius-pill)] flex items-center justify-center gap-3 cursor-pointer active-press"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 8px 24px -4px rgba(14,165,233,0.5)' }}
                >
                  <Camera className="w-5 h-5" />
                  Escanear Prato
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleRealAiAnalysis} />
                </label>
              </div>
            )}
          </div>
        </PremiumLockOverlay>
      </OverlayWrapper>

    </div>
  )
}

