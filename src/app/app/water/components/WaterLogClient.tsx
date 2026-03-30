'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, OverlayWrapper, PremiumLockOverlay } from '@/components/ui/design-system'
import { Droplets, Plus, Clock, Trash2, Edit3, Check } from 'lucide-react'
import { logWater, updateWaterGoal, deleteWaterLog } from '../actions'

type Props = {
  logs: any[]
  profile: any
}

const quickAmounts = [150, 250, 350, 500]

export function WaterLogClient({ logs, profile }: Props) {
  const [adding, setAdding] = useState(false)
  const [modalCustom, setModalCustom] = useState(false)
  const [modalGoal, setModalGoal] = useState(false)
  const [customWater, setCustomWater] = useState('')
  const [customGoal, setCustomGoal] = useState(profile.daily_water_goal_ml?.toString() || '2000')

  const totalToday = logs?.reduce((acc, log) => acc + (log.amount_ml || 0), 0) || 0
  const goal = Math.max(profile?.daily_water_goal_ml || 2000, 1)
  const percentage = Math.min(Math.round((totalToday / goal) * 100), 100)
  const remaining = Math.max(0, goal - totalToday)
  const isGoalHit = percentage >= 100

  const handleQuickAdd = async (amount: number) => {
    setAdding(true)
    try {
      await logWater(amount)
    } finally {
      setAdding(false)
    }
  }

  const handleCustomAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customWater) return
    setAdding(true)
    try {
      await logWater(parseInt(customWater))
      setModalCustom(false)
      setCustomWater('')
    } finally {
      setAdding(false)
    }
  }

  const handleGoalUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await updateWaterGoal(parseInt(customGoal))
      setModalGoal(false)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Remover esse registro de água?')) {
      await deleteWaterLog(id)
    }
  }

  return (
    <div className="pb-44 px-4 max-w-md mx-auto font-body" style={{ minHeight: '100vh', background: '#f8fafb' }}>

      {/* ─── HEADER ─────────────────────────────────── */}
      <header className="pt-2 mb-6 px-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9ca3af' }}>
          Tracking
        </p>
        <h1 className="text-[24px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>
          Hidratação 💧
        </h1>
      </header>

      {/* ─── HERO PROGRESS ──────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-3xl)] p-7 mb-5 flex flex-col items-center"
        style={{
          background: isGoalHit
            ? 'linear-gradient(145deg, #0369a1, #0ea5e9)'
            : 'linear-gradient(145deg, #0ea5e9, #38bdf8)',
          boxShadow: isGoalHit
            ? '0 20px 60px -10px rgba(3,105,161,0.45)'
            : '0 20px 60px -10px rgba(14,165,233,0.4)',
        }}
      >
        {/* Ambient */}
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />

        {/* Percentage label */}
        <div
          className="relative z-10 mb-5 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {isGoalHit ? '🎉 Meta Batida!' : 'Hidratação Diária'}
          </p>
        </div>

        {/* SVG Ring */}
        <div className="relative z-10 mb-4">
          {(() => {
            const size = 170
            const sw = 12
            const center = size / 2
            const radius = center - sw - 2
            const circ = 2 * Math.PI * radius
            const offset = circ - (percentage / 100) * circ
            return (
              <div className="relative flex items-center justify-center">
                <svg className="-rotate-90" width={size} height={size}>
                  <circle stroke="rgba(255,255,255,0.18)" strokeWidth={sw} fill="transparent" r={radius} cx={center} cy={center} />
                  <motion.circle
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth={sw}
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.4, type: 'spring', bounce: 0.08 }}
                    style={{ strokeDasharray: circ }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Droplets className="w-6 h-6 text-white/80 mb-1" />
                  <span className="text-[28px] font-sans font-black text-white leading-none tracking-tight">
                    {totalToday}
                  </span>
                  <span className="text-[11px] font-bold text-white/60 mt-0.5">/ {goal} ml</span>
                </div>

              </div>
            )
          })()}
        </div>

        <p className="text-white/80 text-[13px] font-medium relative z-10">
          {isGoalHit
            ? 'Corpo hidratado. Continue assim!'
            : `Faltam ${remaining.toLocaleString('pt-BR')} ml para completar hoje.`}
        </p>
      </div>

      {/* ─── HISTORY ────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[17px] font-sans font-black tracking-tight" style={{ color: '#111827' }}>
            Registros de hoje
          </h2>
          <button
            onClick={() => setModalGoal(true)}
            className="text-[12px] font-bold flex items-center gap-1 px-3.5 py-1.5 rounded-full active-press"
            style={{
              color: '#0ea5e9',
              background: '#eff8ff',
              border: '1px solid rgba(14,165,233,0.15)',
            }}
          >
            <Edit3 className="w-3 h-3" />
            Meta ({goal} ml)
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div
                className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-4"
                style={{
                  background: '#eff8ff',
                  border: '1.5px dashed rgba(14,165,233,0.3)',
                }}
              >
                <Droplets className="w-7 h-7" style={{ color: '#bae8fd' }} />
              </div>
              <p className="text-[14px] font-bold" style={{ color: '#9ca3af' }}>Nenhum registro ainda.</p>
              <p className="text-[12px] font-medium mt-1" style={{ color: '#d1d5db' }}>
                Adicione seu primeiro copo abaixo!
              </p>
            </motion.div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-4 rounded-[var(--radius-xl)] mb-3"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ background: '#eff8ff' }}
                  >
                    <Droplets className="w-5 h-5" style={{ color: '#0ea5e9' }} />
                  </div>
                  <div>
                    <p className="font-sans font-black text-[17px] leading-none" style={{ color: '#111827' }}>
                      {log.amount_ml}
                      <span className="text-[11px] font-bold ml-1" style={{ color: '#9ca3af' }}>ml</span>
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" style={{ color: '#d1d5db' }} />
                      <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>
                        {log.time?.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center active-press transition-colors"
                  style={{ background: '#f8fafb', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: '#d1d5db' }} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ─── PREMIUM BLOCK ──────────────────────────── */}
      <div className="mb-4">
        <PremiumLockOverlay>
          <div
            className="p-5 rounded-[var(--radius-xl)] flex items-center gap-4"
            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: '#eff8ff' }}
            >
              <Clock className="w-5.5 h-5.5" style={{ color: '#0ea5e9' }} />
            </div>
            <div>
              <h4 className="text-[14px] font-bold" style={{ color: '#111827' }}>Lembretes SophIA</h4>
              <p className="text-[12px] font-medium" style={{ color: '#9ca3af' }}>
                Alertas personalizados pelo WhatsApp.
              </p>
            </div>
          </div>
        </PremiumLockOverlay>
      </div>

      {/* ─── FIXED QUICK-ADD BAR ────────────────────── */}
      <div
        className="fixed bottom-[88px] left-0 right-0 z-40 flex justify-center px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div
          className="w-full max-w-md grid grid-cols-5 gap-2 px-3 py-3"
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '999px',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {quickAmounts.map((amt, i) => {
            const isFeatured = i === 1
            return (
              <button
                key={amt}
                disabled={adding}
                onClick={() => handleQuickAdd(amt)}
                className="flex flex-col items-center justify-center py-2.5 rounded-full transition-all active-press disabled:opacity-50"
                style={
                  isFeatured
                    ? {
                        background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                        boxShadow: '0 4px 14px -2px rgba(14,165,233,0.45)',
                        color: '#fff',
                      }
                    : {
                        background: '#f0f9ff',
                        border: '1px solid rgba(14,165,233,0.15)',
                        color: '#0ea5e9',
                      }
                }
              >
                <span className="text-[9px] font-bold opacity-70">ml</span>
                <span className="text-[14px] font-black">{amt}</span>
              </button>
            )
          })}
          <button
            disabled={adding}
            onClick={() => setModalCustom(true)}
            className="flex flex-col items-center justify-center py-2.5 rounded-full active-press"
            style={{
              background: '#f8fafb',
              border: '1px solid rgba(0,0,0,0.08)',
              color: '#9ca3af',
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── MODAL: CUSTOM AMOUNT ────────────────────── */}
      <OverlayWrapper isOpen={modalCustom} onClose={() => setModalCustom(false)} title="Registrar quantidade">
        <form onSubmit={handleCustomAdd} className="space-y-4">
          <input
            type="number"
            autoFocus
            value={customWater}
            onChange={(e) => setCustomWater(e.target.value)}
            required
            placeholder="Ex: 400"
            className="w-full rounded-[var(--radius-xl)] text-center text-[36px] font-sans font-black outline-none py-6"
            style={{
              background: '#f0f9ff',
              border: '2px solid rgba(14,165,233,0.2)',
              color: '#0369a1',
            }}
          />
          <p className="text-center text-[12px] font-medium" style={{ color: '#9ca3af' }}>
            Digite a quantidade em ml
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="md" type="button" onClick={() => setModalCustom(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={adding} className="flex-[2]">
              Registrar
            </Button>
          </div>
        </form>
      </OverlayWrapper>

      {/* ─── MODAL: GOAL ────────────────────────────── */}
      <OverlayWrapper isOpen={modalGoal} onClose={() => setModalGoal(false)} title="Meta Diária">
        <p className="text-[13px] font-medium mb-5" style={{ color: '#9ca3af' }}>
          Quanto seu corpo precisa por dia?
        </p>
        <form onSubmit={handleGoalUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['2000', '2500', '3000', '4000'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCustomGoal(v)}
                className="p-4 rounded-[var(--radius-xl)] text-center transition-all active-press"
                style={{
                  background: customGoal === v ? '#f0fdfb' : '#f8fafb',
                  border: customGoal === v ? '2px solid rgba(20,184,166,0.4)' : '1.5px solid rgba(0,0,0,0.07)',
                  color: customGoal === v ? '#0d9488' : '#374151',
                }}
              >
                <span className="font-sans font-black text-[18px] block">{v}</span>
                <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>ml / dia</span>
                {customGoal === v && <Check className="w-3 h-3 mx-auto mt-1" style={{ color: '#0d9488' }} />}
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="md" type="button" onClick={() => setModalGoal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={adding} className="flex-[2]">
              Salvar Meta
            </Button>
          </div>
        </form>
      </OverlayWrapper>
    </div>
  )
}
