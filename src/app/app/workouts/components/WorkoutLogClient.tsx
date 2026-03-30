'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Dumbbell, Zap, Timer, Flame, Clock } from 'lucide-react'
import { Button, GlassCard, OverlayWrapper, PremiumLockOverlay } from '@/components/ui/design-system'
import { saveWorkoutManual, deleteWorkout } from '../actions'

const ICONS_MAP: Record<string, any> = {
  'Musculação': Dumbbell,
  'Corrida': Flame,
  'Kettlebell': Dumbbell,
  'Funcional': Zap,
  'Default': Zap
}

const INTENSITY_COLORS: Record<string, string> = {
  'Leve': 'text-emerald-500 bg-emerald-50',
  'Moderado': 'text-brand-500 bg-brand-50',
  'Insano': 'text-rose-500 bg-rose-50'
}

type Props = {
  workouts: any[]
  profile?: any
}

export function WorkoutLogClient({ workouts, profile }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Smart Form States (No select drops, only chips!)
  const [selectedType, setSelectedType] = useState('Musculação')
  const [duration, setDuration] = useState(45)
  const [intensity, setIntensity] = useState('Moderado')
  const [calories, setCalories] = useState(300)

  const TYPES = ['Musculação', 'Corrida', 'Caminhada', 'Bike', 'Funcional', 'Futebol', 'HIIT', 'Outro']
  const INTENSITIES = ['Leve', 'Moderado', 'Insano']

  // Auto-Calculation Logic
  React.useEffect(() => {
    const metMap: Record<string, Record<string, number>> = {
      'Musculação': { 'Leve': 3, 'Moderado': 5, 'Insano': 8 },
      'Corrida': { 'Leve': 6, 'Moderado': 9, 'Insano': 12 },
      'Caminhada': { 'Leve': 2.5, 'Moderado': 4, 'Insano': 5.5 },
      'Bike': { 'Leve': 4, 'Moderado': 7, 'Insano': 11 },
      'Funcional': { 'Leve': 4, 'Moderado': 6.5, 'Insano': 9.5 },
      'Futebol': { 'Leve': 5, 'Moderado': 8, 'Insano': 11 },
      'HIIT': { 'Leve': 6, 'Moderado': 9.5, 'Insano': 13.5 },
      'Outro': { 'Leve': 3, 'Moderado': 5, 'Insano': 7 }
    }
    const met = metMap[selectedType]?.[intensity] || 5
    const weight = profile?.weight || 70
    const calculated = Math.floor(met * weight * (duration / 60))
    setCalories(calculated)
  }, [selectedType, duration, intensity, profile?.weight])

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    // Append smart fields
    formData.append('type', selectedType)
    formData.append('duration', duration.toString())
    formData.append('intensity', intensity)
    formData.append('calories', calories.toString())
    
    try {
      const result = await saveWorkoutManual(formData)
      if (result && 'error' in result) {
        alert(`Erro: ${result.error}`)
      } else {
        setModalOpen(false)
        // refresh para ver o treino na lista
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao registrar treino. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }



  const handleDelete = async (id: string) => {
    if (confirm('Deletar esse registro histórico?')) {
      await deleteWorkout(id)
    }
  }

  return (
    <div className="pb-32 px-4 max-w-md mx-auto">
      {/* BOTÃO DE AÇÃO NO FLUXO (Sem Sobreposição) */}
      <div className="mt-6 mb-6 flex flex-col gap-3">
        <Link 
          href="/app/workouts/live"
          className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white flex items-center justify-center gap-2 h-16 rounded-[1.5rem] shadow-xl shadow-brand-500/30 border border-brand-400 active:scale-95 transition-all font-sans font-black tracking-tight"
        >
          <Zap className="w-5 h-5" />
          <span className="text-base uppercase">Iniciar Treino Smart</span>
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="w-full bg-white text-zinc-600 flex items-center justify-center gap-2 h-14 rounded-[1.5rem] shadow-sm border border-zinc-200 active:bg-zinc-50 transition-all font-sans font-bold tracking-tight"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[13px] uppercase">Registro Manual Rápido</span>
        </motion.button>
      </div>


      {/* Relação de Hoje */}
      <div className="space-y-4">
        {workouts.length === 0 ? (
           <GlassCard className="text-center p-10 border-dashed border-2">
            <h3 className="font-bold text-zinc-900 mb-2">Sem suor hoje...</h3>
            <p className="text-zinc-500 text-sm">O corpo foi feito pra se mover. Grave seu 1º treino e ligue a Dashboard.</p>
          </GlassCard>
        ) : (
          workouts.map((wk) => {
            const Icon = ICONS_MAP[wk.type] || ICONS_MAP['Default']
            const intsColor = INTENSITY_COLORS[wk.intensity] || INTENSITY_COLORS['Moderado']
            return (
              <GlassCard key={wk.id} className="p-5 border-white">
                 <div className="flex gap-4">
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
                       <Icon className="w-7 h-7 text-brand-500" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <h3 className="font-bold text-zinc-900">{wk.type}</h3>
                         <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-semibold">{wk.time.slice(0,5)}</span>
                       </div>
                       <div className="flex gap-2 mt-2">
                         <span className="inline-flex items-center text-xs font-semibold bg-zinc-50 text-zinc-600 px-2 py-1 rounded-md">
                           <Timer className="w-3 h-3 mr-1"/> {wk.duration_minutes}m
                         </span>
                         <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-md ${intsColor}`}>
                           {wk.intensity}
                         </span>
                       </div>
                       {wk.observation && <p className="text-xs text-zinc-400 mt-2 italic">"{wk.observation}"</p>}
                    </div>
                 </div>
                 <div className="flex justify-end pt-3 border-t border-zinc-50 mt-3 -mb-1">
                   <button onClick={() => handleDelete(wk.id)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </GlassCard>
            )
          })
        )}
      </div>

      {/* MODAL DE CADASTRO (Baixa Fricção UX) */}
      <OverlayWrapper isOpen={modalOpen} onClose={() => setModalOpen(false)}>
         <div className="max-h-[85vh] overflow-y-auto pb-4 scrollbar-hide">
            <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Como foi o Treino?</h2>
            
            <form onSubmit={handleManualSubmit} className="space-y-6">
              
              {/* O QUE? Chips Group */}
              <div>
                <label className="text-sm font-bold text-zinc-700 mb-2 ml-1 block">O que você fez?</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(t => (
                    <button type="button" key={t} onClick={() => setSelectedType(t)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${selectedType === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-zinc-100 text-zinc-500 bg-white hover:border-zinc-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* DURAÇÃO (Slider super suave no dedo) */}
              <div className="bg-zinc-50 p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                   <label className="text-sm font-bold text-zinc-700 flex items-center gap-1"><Clock className="w-4 h-4"/> Tempo Ativo</label>
                   <span className="text-xl font-black text-brand-600">{duration} min</span>
                </div>
                <input type="range" min="10" max="180" step="5" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full accent-brand-500 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
              </div>

              {/* INTENSIDADE (Chips Group) */}
              <div>
                <label className="text-sm font-bold text-zinc-700 mb-2 ml-1 block">Esforço (Intensidade)</label>
                <div className="grid grid-cols-3 gap-2">
                  {INTENSITIES.map(i => (
                    <button type="button" key={i} onClick={() => setIntensity(i)} className={`py-3 rounded-2xl text-sm font-bold transition-all ${intensity === i ? 'bg-zinc-800 text-white shadow-md' : 'bg-white text-zinc-500 border border-zinc-200'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* CLÁSSICOS: Hora e Kcal Estimada */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-zinc-700 mb-1 ml-1 block">Kcal Estimada</label>
                    <input 
                      name="calories" 
                      type="number" 
                      value={calories}
                      onChange={e => setCalories(Number(e.target.value))}
                      className="w-full bg-zinc-50 border-0 rounded-2xl p-4 text-center font-bold text-brand-600 focus:ring-0" 
                    />
                  </div>

                 <div>
                   <label className="text-sm font-bold text-zinc-700 mb-1 ml-1 block">Hórario Exato</label>
                   <input name="time" type="time" defaultValue="18:00" required className="w-full bg-zinc-50 border-0 rounded-2xl p-4 text-center font-bold" />
                 </div>
              </div>

              <div>
                <label className="text-sm font-bold text-zinc-700 mb-1 ml-1 block">Anota aí (Opcional)</label>
                <input name="observation" placeholder="Ex: Bati PR no Agachamento" className="w-full bg-white border border-zinc-200 rounded-2xl p-4 focus:ring-4 focus:ring-brand-100 outline-none" />
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="w-1/3">Voltar</Button>
                <Button type="submit" variant="primary" className="w-2/3" isLoading={saving}>Registrar Treino</Button>
              </div>

            </form>
         </div>
      </OverlayWrapper>
    </div>
  )
}
