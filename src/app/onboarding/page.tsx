'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, ProgressRing, SophiaBlock } from '@/components/ui/design-system'
import { useRouter } from 'next/navigation'
import { saveOnboardingProfile } from './actions'
import { ChevronLeft, Check, Leaf } from 'lucide-react'

type QuestionType = 'select' | 'number'

interface OnboardingStep {
  id: string
  question: string
  sub?: string
  type: QuestionType
  options?: string[]
  unit?: string
  placeholder?: string
  emoji?: string
}

const STEPS: OnboardingStep[] = [
  {
    id: 'gender',
    question: 'Como você se identifica?',
    type: 'select',
    options: ['Masculino', 'Feminino', 'Outro'],
    emoji: '👤',
  },
  {
    id: 'age',
    question: 'Qual a sua idade?',
    type: 'number',
    placeholder: '28',
    unit: 'anos',
    emoji: '🎂',
  },
  {
    id: 'height',
    question: 'Qual a sua altura?',
    type: 'number',
    placeholder: '175',
    unit: 'cm',
    emoji: '📏',
  },
  {
    id: 'weight',
    question: 'Qual seu peso atual?',
    type: 'number',
    placeholder: '75',
    unit: 'kg',
    emoji: '⚖️',
  },
  {
    id: 'activity_level',
    question: 'Seu nível de atividade física?',
    sub: 'Isso ajuda a calcular sua necessidade calórica real.',
    type: 'select',
    options: [
      'Sedentário (Escritório / Sofá)',
      'Levemente Ativo (1-2x semana)',
      'Ativo (3-5x semana)',
      'Muito Ativo (Atleta / Trabalho Pesado)',
    ],
    emoji: '🏃',
  },
  {
    id: 'primary_goal',
    question: 'Qual é o seu objetivo principal?',
    type: 'select',
    options: ['Emagrecer Max', 'Definir (Recompisição)', 'Ganhar Massa Magra', 'Apenas Saúde e Constância'],
    emoji: '🎯',
  },
  {
    id: 'workout_frequency',
    question: 'Frequência de Treino / Meta',
    type: 'select',
    options: ['Nenhuma', '1 a 2x na semana', '3 a 4x na semana', '5 a 6x na semana', 'Todo dia'],
    emoji: '🗓️',
  },
  {
    id: 'hardest_time',
    question: 'Qual seu horário oficial de treino?',
    type: 'select',
    options: ['Manhã (ex: 6h - 8h)', 'Almoço (ex: 12h - 14h)', 'Tarde (ex: 15h - 18h)', 'Noite (ex: 19h+)', 'Sem rotina unificada'],
    emoji: '⏰',
  },
  {
    id: 'main_struggle',
    question: 'Restrição Alimentar?',
    sub: 'Isso é crucial para o gerador de cardápio.',
    type: 'select',
    options: ['Nenhuma Restrição', 'Intolerante à Lactose', 'Intolerante a Glúten (Celíaco)', 'Vegetariano', 'Vegano'],
    emoji: '🚫',
  },
  {
    id: 'daily_water_goal_ml',
    question: 'Meta diária de água?',
    sub: 'Calculamos automaticamente, mas você pode ajustar.',
    type: 'select',
    options: ['2000', '2500', '3000', '4000'],
    emoji: '💧',
  },
  {
    id: 'coaching_preference',
    question: 'Como quer o acompanhamento da SophIA?',
    type: 'select',
    options: [
      'Acompanhamento Leve (Dicas eventuais)',
      'Acompanhamento Ativo (Supervisão diária, ajustes dinâmicos)',
    ],
    emoji: '🤖',
  },
]

const waterLabels: Record<string, string> = {
  '2000': '2L — Leve',
  '2500': '2.5L — Padrão',
  '3000': '3L — Ativo',
  '4000': '4L — Intenso',
}

export default function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [inputValue, setInputValue] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)

  const stepData = STEPS[currentStep]

  useEffect(() => {
    if (stepData.id === 'daily_water_goal_ml' && answers.weight) {
      const weight = parseFloat(answers.weight)
      const recommended = Math.round(weight * 35)
      const rounded = Math.round(recommended / 500) * 500
      setAnswers((prev) => ({ ...prev, daily_water_goal_ml: rounded.toString() }))
    }
  }, [currentStep, answers.weight, stepData.id])

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [stepData.id]: option }))
    advance()
  }

  const handleNextNumber = () => {
    if (!inputValue) return
    setAnswers((prev) => ({ ...prev, [stepData.id]: inputValue }))
    setInputValue('')
    advance()
  }

  const advance = () => {
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        finish()
      }
    }, 320)
  }

  const finish = async () => {
    setIsFinishing(true)
    try {
      await saveOnboardingProfile(answers)
      await new Promise((resolve) => setTimeout(resolve, 2200))
      router.push('/app/dashboard')
    } catch (e) {
      console.error(e)
      setIsFinishing(false)
    }
  }

  // ── FINISHING SCREEN ──
  if (isFinishing) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 font-body"
        style={{ background: '#f8fafb' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
          className="flex flex-col items-center text-center max-w-sm"
        >
          <div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-8"
            style={{
              background: 'linear-gradient(145deg, #14b8a6, #0d9488)',
              boxShadow: '0 20px 60px -10px rgba(20,184,166,0.5)',
            }}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-[28px] font-sans font-black tracking-tight mb-3" style={{ color: '#0a0f1e' }}>
            Tudo pronto!
          </h2>
          <p className="text-[14px] font-medium leading-relaxed mb-8" style={{ color: '#6b7280' }}>
            Seu perfil foi configurado. Estamos preparando seu dashboard personalizado...
          </p>

          <div className="mb-8">
            <ProgressRing percentage={100} size={120} showPercent={false} />
          </div>

          <SophiaBlock message="Seu perfil está moldado. Estou pronta para te manter focado. Vamos nessa!" />
        </motion.div>
      </div>
    )
  }

  const progressPercentage = Math.round((currentStep / STEPS.length) * 100)

  return (
    <div
      className="min-h-screen flex flex-col font-body"
      style={{ background: '#f8fafb' }}
    >
      {/* Ambient */}
      <div
        className="fixed top-0 left-0 w-full h-64 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 0%, rgba(20,184,166,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ─── HEADER ── */}
      <header className="relative z-10 flex items-center gap-4 px-5 pt-14 pb-8">
        {/* Back button */}
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          className={`w-9 h-9 rounded-full flex items-center justify-center active-press transition-opacity ${
            currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 relative">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #14b8a6, #0ea5e9)' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step count */}
        <span className="text-[12px] font-bold w-12 text-right" style={{ color: '#9ca3af' }}>
          {currentStep + 1}/{STEPS.length}
        </span>
      </header>

      {/* ─── CONTENT ── */}
      <main className="flex-1 flex flex-col px-5 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col"
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: 'spring', bounce: 0.4 }}
              className="text-[44px] mb-5"
            >
              {stepData.emoji}
            </motion.div>

            {/* Question */}
            <h1
              className="text-[26px] font-sans font-black tracking-tight mb-2 leading-tight"
              style={{ color: '#0a0f1e' }}
            >
              {stepData.question}
            </h1>
            {stepData.sub && (
              <p className="text-[13px] font-medium mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>
                {stepData.sub}
              </p>
            )}

            {/* ── SELECT OPTIONS ── */}
            {stepData.type === 'select' ? (
              <div className="space-y-3 mt-4">
                {stepData.options?.map((option) => {
                  const isSelected = answers[stepData.id] === option
                  const displayLabel =
                    stepData.id === 'daily_water_goal_ml' ? waterLabels[option] || option : option

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className="w-full text-left p-4 rounded-[var(--radius-xl)] font-medium text-[14px] transition-all duration-200 flex items-center justify-between active-press"
                      style={{
                        background: isSelected ? '#f0fdfb' : '#ffffff',
                        border: isSelected
                          ? '2px solid rgba(20,184,166,0.4)'
                          : '1.5px solid rgba(0,0,0,0.08)',
                        boxShadow: isSelected
                          ? '0 4px 16px -4px rgba(20,184,166,0.2)'
                          : '0 2px 6px -2px rgba(0,0,0,0.04)',
                        color: isSelected ? '#0f766e' : '#374151',
                      }}
                    >
                      <span className="font-semibold">{displayLabel}</span>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: '#14b8a6' }}
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              /* ── NUMBER INPUT ── */
              <div className="space-y-4 mt-4">
                <div className="relative">
                  <input
                    type="number"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextNumber()}
                    placeholder={stepData.placeholder}
                    className="w-full rounded-[var(--radius-xl)] text-center text-[40px] font-sans font-black tracking-tight outline-none transition-all duration-200"
                    style={{
                      background: '#ffffff',
                      border: '2px solid rgba(0,0,0,0.08)',
                      padding: '28px 72px 28px 72px',
                      color: '#0a0f1e',
                      boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid rgba(20,184,166,0.5)'
                      e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(20,184,166,0.2)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '2px solid rgba(0,0,0,0.08)'
                      e.currentTarget.style.boxShadow = '0 4px 16px -4px rgba(0,0,0,0.06)'
                    }}
                  />
                  {stepData.unit && (
                    <span
                      className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-[18px] pointer-events-none"
                      style={{ color: '#d1d5db' }}
                    >
                      {stepData.unit}
                    </span>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextNumber}
                  className="w-full"
                  disabled={!inputValue}
                >
                  Próximo
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── BRAND FOOTER ── */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 opacity-40">
          <Leaf className="w-3 h-3" style={{ color: '#14b8a6' }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#9ca3af' }}>FitJá</span>
        </div>
      </div>
    </div>
  )
}
