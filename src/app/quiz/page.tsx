'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Target, 
  Flame, 
  Zap, 
  Clock, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Crown,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/design-system'

interface Question {
  id: string
  title: string
  sub?: string
  options: {
    id: string
    label: string
    icon: any
    color: string
    desc: string
  }[]
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'Qual seu maior foco hoje?',
    sub: 'Isso define sua estratégia personalizada pela SophIA.',
    options: [
      { id: 'fat_loss', label: 'Queimar Gordura', icon: Flame, color: '#f43f5e', desc: 'Foco em déficit e termogenia.' },
      { id: 'muscle_gain', label: 'Ganhar Massa', icon: TrendingUp, color: '#10b981', desc: 'Hipertrofia e força máxima.' },
      { id: 'health', label: 'Saúde & Vitalidade', icon: Zap, color: '#0ea5e9', desc: 'Mais energia e sono reparador.' },
      { id: 'elite', label: 'Performance Elite', icon: Crown, color: '#f59e0b', desc: 'Alta performance e disciplina.' },
    ]
  },
  {
    id: 'blocker',
    title: 'O que mais te trava?',
    sub: 'Identificamos os pontos de atrito na sua rotina.',
    options: [
      { id: 'time', label: 'Falta de Tempo', icon: Clock, color: '#6366f1', desc: 'Treinos e dieta ultra-rápidos.' },
      { id: 'food', label: 'Não sei o que comer', icon: Utensils, color: '#ec4899', desc: 'Cardápios práticos e nutritivos.' },
      { id: 'drill', label: 'Treinos Chatos', icon: Dumbbell, color: '#14b8a6', desc: 'Variedade e gamificação.' },
      { id: 'focus', label: 'Falta de Foco', icon: Target, color: '#8b5cf6', desc: 'Notificações e lembretes IA.' },
    ]
  },
  {
    id: 'commitment',
    title: 'Nível de Compromisso?',
    sub: 'Seja sincero para que a IA possa se adaptar.',
    options: [
      { id: 'beginner', label: 'Iniciante Curioso', icon: Award, color: '#94a3b8', desc: 'Quero começar devagar.' },
      { id: 'casual', label: 'Tenho uma base', icon: Award, color: '#38bdf8', desc: 'Treino 2 a 3x por semana.' },
      { id: 'dedicated', label: 'Foco Total', icon: Award, color: '#10b981', desc: '4 a 6x por semana sem errar.' },
      { id: 'warrior', label: 'Modo Guerreiro', icon: Crown, color: '#f59e0b', desc: 'Estilo de vida profissional.' },
    ]
  }
]

export default function DiscoveryQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)
  const [results, setResults] = useState<Record<string, string>>({})

  const currentQuestion = QUIZ_QUESTIONS[step]
  const progress = ((step) / QUIZ_QUESTIONS.length) * 100

  const handleSelect = (optionId: string) => {
    setResults(prev => ({ ...prev, [currentQuestion.id]: optionId }))
    
    if (step < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setStep(prev => prev + 1), 300)
    } else {
      setTimeout(() => setIsFinishing(true), 400)
    }
  }

  if (isFinishing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 font-body" style={{ background: '#0a0f1e' }}>
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center max-w-sm"
         >
            <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-8 border border-teal-500/20">
               <Sparkles className="w-12 h-12 text-teal-400 animate-pulse" />
            </div>
            
            <h2 className="text-[32px] font-sans font-black text-white leading-tight mb-4 tracking-tight uppercase italic">
               PERFIL <span className="text-teal-400">DECIFRADO.</span>
            </h2>
            <p className="text-zinc-400 text-[16px] font-medium leading-relaxed mb-10">
               SophIA já montou os trilhos para sua evolução. Estamos prontos para desbloquear seu potencial máximo.
            </p>

            <div className="space-y-4">
               <button 
                 onClick={() => router.push('/signup')}
                 className="w-full bg-white text-[#0a0f1e] font-black text-[16px] uppercase tracking-widest py-6 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
               >
                 Criar Minha Jornada
                 <ArrowRight className="w-5 h-5" />
               </button>
               <p className="text-[11px] font-bold text-zinc-600 tracking-widest uppercase">Grátis por tempo limitado</p>
            </div>
         </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-body relative overflow-hidden" style={{ background: '#0a0f1e' }}>
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[30dvh] bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none" />
      
      {/* ── HEADER ── */}
      <header className="relative z-10 pt-14 px-7 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden mr-6">
             <motion.div 
               className="h-full bg-teal-400 rounded-full"
               animate={{ width: `${progress}%` }}
               transition={{ type: 'spring', stiffness: 50, damping: 15 }}
             />
          </div>
          <span className="text-[12px] font-black text-white italic tracking-tighter w-12 text-right">
             STEP {step + 1}
          </span>
        </div>
      </header>

      {/* ── QUESTION ── */}
      <main className="relative z-10 flex-1 px-7 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col pt-4"
          >
            <h1 className="text-[34px] font-sans font-black text-white leading-tight tracking-tight mb-2">
              {currentQuestion.title}
            </h1>
            <p className="text-zinc-500 text-[15px] font-medium mb-10">
              {currentQuestion.sub}
            </p>

            {/* OPTIONS */}
            <div className="space-y-4 pb-12">
              {currentQuestion.options.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="w-full text-left p-5 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 active:bg-white/10 transition-all group flex items-start gap-5 backdrop-blur-3xl"
                  >
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-2xl"
                      style={{ background: `${opt.color}20`, border: `1px solid ${opt.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: opt.color }} />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-[18px] font-bold text-white tracking-tight mb-0.5">{opt.label}</h3>
                      <p className="text-zinc-500 text-[13px] font-medium leading-tight">{opt.desc}</p>
                    </div>
                    <div className="pt-2">
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/40 transition-colors" />
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── FOOTER BRAND ── */}
      <footer className="relative z-10 pb-8 text-center px-7">
         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">
            FITJÁ DISCOVERY ENGINE
         </p>
      </footer>

    </div>
  )
}
