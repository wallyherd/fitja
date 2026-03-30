'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Flame, Clock, Target, Play, Pause, RotateCcw, ChevronLeft, Flag } from 'lucide-react'
import { Button, Input } from '@/components/ui/design-system'
import { useRouter } from 'next/navigation'

interface SetData {
  id: string
  reps: number
  weight: number
  isCompleted: boolean
}

interface Exercise {
  id: string
  name: string
  targetReps: string
  restSeconds: number
  sets: SetData[]
}

const MOCK_MESA_FLEXORA = {
  id: 'e1',
  name: 'Mesa Flexora (Isometria 2s)',
  targetReps: '10 a 12 (Falha)',
  restSeconds: 60,
  sets: [
    { id: 's1', reps: 12, weight: 35, isCompleted: true },
    { id: 's2', reps: 10, weight: 35, isCompleted: false },
    { id: 's3', reps: 8, weight: 40, isCompleted: false },
  ]
}

export default function WorkoutLiveExecution() {
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise>(MOCK_MESA_FLEXORA)
  const [activeSetIndex, setActiveSetIndex] = useState(1)
  
  // States do Timer Local
  const [isResting, setIsResting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // PSE (RPE) Modal
  const [showPseModal, setShowPseModal] = useState(false)
  const [pseScore, setPseScore] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false)
      // Tocar som de fim de descanso
    }
    return () => clearInterval(interval)
  }, [isResting, timeLeft])

  const startRest = (seconds: number) => {
    setTimeLeft(seconds)
    setIsResting(true)
  }

  const toggleSetComplete = (setId: string, restSecs: number) => {
    const updatedSets = exercise.sets.map(s => {
      if (s.id === setId) {
        const completing = !s.isCompleted
        if (completing) startRest(restSecs)
        return { ...s, isCompleted: completing }
      }
      return s
    })
    
    setExercise({ ...exercise, sets: updatedSets })
    
    const nextUncompleted = updatedSets.findIndex(s => !s.isCompleted)
    if (nextUncompleted !== -1) setActiveSetIndex(nextUncompleted)
  }

  const finishWorkout = () => {
     setShowPseModal(true)
  }

  const savePseAndExit = () => {
     // AQUI: Salvaria PSE no Banco: `UPDATE workout_sessions SET rpe_score = ?`
     console.log("PSE Salvo:", pseScore)
     router.push('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] font-body flex flex-col pt-14 pb-28">
      
      {/* ── HEADER DE EXECUÇÃO ── */}
      <header className="px-5 mb-6 flex items-center justify-between sticky top-0 z-10 bg-[#f8fafb]/80 backdrop-blur-md pb-4 pt-2">
         <button onClick={() => router.back()} className="w-10 h-10 bg-white shadow-sm border border-zinc-100 rounded-full flex items-center justify-center active-press">
            <ChevronLeft className="w-5 h-5 text-zinc-600" />
         </button>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 text-center mb-0.5 mt-2">TREINO EM ANDAMENTO</p>
            <h1 className="text-xl font-sans font-black text-zinc-900 tracking-tight">Leg Day (Foco Posteriores)</h1>
         </div>
         <div className="w-10"></div>{/* Spacer */}
      </header>

      {/* ── TIMER FLUTUANTE GLOBAL SUPERIOR ── */}
      <AnimatePresence>
         {isResting && (
           <motion.div 
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className="mx-5 mb-6 bg-zinc-900 rounded-[2rem] p-4 text-white flex items-center justify-between shadow-2xl shadow-zinc-900/20"
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                 </div>
                 <div>
                    <h3 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider">Descanso Ativo</h3>
                    <p className="text-2xl font-black tabular-nums leading-none mt-0.5">
                       {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setTimeLeft(prev => prev + 30)} className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center font-bold text-sm">+30s</button>
                 <button onClick={() => setIsResting(false)} className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center"><ChevronLeft className="w-5 h-5 rotate-180" /></button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <main className="flex-1 px-5">
         
         {/* CABEÇALHO DO EXERCÍCIO */}
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                 Exercício 1 de 6
               </span>
            </div>
            <h2 className="text-2xl font-sans font-black text-zinc-900 mb-1 leading-tight">{exercise.name}</h2>
            <div className="flex items-center gap-4 text-sm font-semibold text-zinc-500">
               <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-500" /> {exercise.targetReps}</span>
               <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {exercise.restSeconds}s Rest</span>
            </div>
         </div>

         {/* LISTA DE SÉRIES AVANÇADA */}
         <div className="bg-white border border-zinc-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] rounded-[2rem] p-1 mb-8">
            <div className="grid grid-cols-[3rem_1fr_1fr_3.5rem] px-5 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-50">
               <span>Set</span>
               <span className="text-center">Carga (kg)</span>
               <span className="text-center">Reps</span>
               <span className="text-center">Feito</span>
            </div>

            <div className="space-y-1 p-1">
               {exercise.sets.map((set, idx) => {
                  const isActive = idx === activeSetIndex
                  const isCompleted = set.isCompleted

                  return (
                    <motion.div 
                       key={set.id}
                       layout
                       className={`
                         grid grid-cols-[3rem_1fr_1fr_3.5rem] items-center px-4 py-3 rounded-[1.5rem] transition-all duration-300
                         ${isActive ? 'bg-emerald-50/50 shadow-inner border border-emerald-100/50' : ''}
                         ${isCompleted ? 'opacity-50 grayscale pt-2 pb-2' : ''}
                       `}
                    >
                       <div className="flex items-center justify-center">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                             {idx + 1}
                          </span>
                       </div>
                       
                       <div className="px-2">
                          <input 
                            type="number" 
                            defaultValue={set.weight} 
                            disabled={isCompleted}
                            className={`w-full text-center font-black text-xl bg-transparent outline-none ${isCompleted ? 'text-zinc-500' : 'text-zinc-900'}`}
                          />
                       </div>

                       <div className="px-2">
                          <input 
                            type="number" 
                            defaultValue={set.reps} 
                            disabled={isCompleted}
                            className={`w-full text-center font-black text-xl bg-transparent outline-none ${isCompleted ? 'text-zinc-500' : 'text-zinc-900'}`}
                          />
                       </div>

                       <div className="flex items-center justify-end">
                          <button 
                             onClick={() => toggleSetComplete(set.id, exercise.restSeconds)}
                             className={`w-10 h-10 rounded-[14px] flex items-center justify-center shadow-sm active-press transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                          >
                             <Check className="w-5 h-5" strokeWidth={isCompleted ? 3 : 2} />
                          </button>
                       </div>
                    </motion.div>
                  )
               })}
            </div>
         </div>

         {/* BOTÕES DE NAVEGAÇÃO */}
         <div className="flex gap-3">
             <Button variant="brand-outline" className="flex-1 bg-white border-zinc-200">
               <Target className="w-4 h-4 mr-2" /> Dicas da IA
             </Button>
             <Button variant="primary" className="flex-[1.5]" onClick={finishWorkout}>
               Próximo Ex. <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
             </Button>
         </div>

      </main>

      {/* ── MODAL DE PSE (PERCEPÇÃO DE ESFORÇO) AO FINAL DO TREINO ── */}
      <AnimatePresence>
         {showPseModal && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
            >
               <motion.div 
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-12 sm:pb-6 shadow-2xl"
               >
                  <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6 sm:hidden" />
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center mb-5 rotate-3 shadow-[0_8px_24px_-4px_rgba(245,158,11,0.5)]">
                     <Flame className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-sans font-black text-center text-zinc-900 mb-2">Treino Concluído!</h3>
                  <p className="text-center text-zinc-500 font-medium mb-8">
                     Qual foi a sua **Percepção Subjetiva de Esforço** (PSE)? <br/> Sendo 1 muito leve, e 10 exaustivo.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                     {[5,6,7,8,9,10].map(score => (
                        <button 
                           key={score}
                           onClick={() => setPseScore(score)}
                           className={`w-12 h-14 rounded-2xl font-black text-xl transition-all active-press ${pseScore === score ? 'bg-orange-500 text-white shadow-lg' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                        >
                           {score}
                        </button>
                     ))}
                  </div>

                  <Button variant="primary" size="lg" className="w-full" disabled={!pseScore} onClick={savePseAndExit}>
                     <Flag className="w-5 h-5 mr-2" /> Salvar Treino
                  </Button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}
