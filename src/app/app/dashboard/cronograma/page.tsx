'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Dumbbell, Clock, Flame, ChevronDown, Zap, ShieldCheck, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { id: 'all', label: 'Todos', icon: Trophy },
  { id: 'Iniciante', label: 'Iniciante', icon: ShieldCheck },
  { id: 'Intermediário', label: 'Intermediário', icon: Zap },
  { id: 'Avançado', label: 'Avançado', icon: Flame },
]

const programs = [
  {
    id: 'iniciante',
    category: 'Iniciante',
    title: 'Iniciante Total — 4 Semanas',
    goal: 'Condicionamento e hábito',
    freq: '3x por semana',
    level: 'Iniciante',
    levelColor: '#16a34a',
    levelBg: '#f0fdf4',
    weeks: [
      {
        week: 'Semana 1–2',
        days: [
          {
            day: 'Segunda — Corpo Inteiro A',
            exercises: [
              { nome: 'Agachamento com peso corporal', series: '3x15', desc: 'Pés na largura dos ombros, desça até 90°' },
              { nome: 'Flexão de braço (joelhos)', series: '3x10', desc: 'Mantenha o core contraído o tempo todo' },
              { nome: 'Remada com elástico', series: '3x12', desc: 'Puxe até a cintura, cotovelando para trás' },
              { nome: 'Prancha', series: '3x20s', desc: 'Progressão: 20→30→45s nas próximas semanas' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'desafio-30',
    category: 'Iniciante',
    title: 'Desafio 30 Dias (Evolução)',
    goal: 'Queima rápida para iniciantes',
    freq: '4x por semana',
    level: 'Iniciante',
    levelColor: '#14b8a6',
    levelBg: '#f0fdfa',
    weeks: [
      {
        week: 'Mês 1',
        days: [
          {
            day: 'Treino A - Cardio Base',
            exercises: [
              { nome: 'Polichinelos', series: '4x30s', desc: 'Ritmo constante' },
              { nome: 'Escalada (Mountain Climbers)', series: '4x20s', desc: 'Foco no abdome' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hipertrofia',
    category: 'Intermediário',
    title: 'Hipertrofia ABC — 6 Semanas',
    goal: 'Ganho de massa muscular',
    freq: '5x por semana',
    level: 'Intermediário',
    levelColor: '#0ea5e9',
    levelBg: '#f0f9ff',
    weeks: [
      {
        week: 'Semana 1–3 (Volume)',
        days: [
          {
            day: 'Segunda — Peito + Tríceps (A)',
            exercises: [
              { nome: 'Supino reto com barra', series: '4x8-10', desc: 'Descanso: 90s. Carga progressiva a cada semana' },
              { nome: 'Crucifixo inclinado halteres', series: '3x12', desc: 'Alongue bem na fase excêntrica' },
              { nome: 'Tríceps corda (polia)', series: '4x12', desc: 'Cotovelo fixo, extensão completa' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'queima',
    category: 'Avançado',
    title: 'Queima de Gordura HIIT — 3 Semanas',
    goal: 'Perda de gordura e condicionamento',
    freq: '4x por semana',
    level: 'Avançado',
    levelColor: '#f43f5e',
    levelBg: '#fff1f2',
    weeks: [
      {
        week: 'Protocolo HIIT (Treino de 25 min)',
        days: [
          {
            day: 'Circuito A — Segunda e Quinta',
            exercises: [
              { nome: 'Burpee', series: '40s esforço / 20s descanso', desc: 'Repita 4–5 vezes. FC alvo: 80–90% FCmax' },
              { nome: 'Agachamento com salto', series: '30s / 15s', desc: 'Aterrissage suave, use o glúteo para amortecer' },
            ],
          },
        ],
      },
    ],
  },
]

export default function CronogramaPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredPrograms = activeTab === 'all' 
    ? programs 
    : programs.filter(p => p.category === activeTab)

  return (
    <div className="max-w-md mx-auto pb-32 font-body" style={{ background: '#f8fafb', minHeight: '100vh' }}>

      {/* Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(248,250,251,0.94)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex items-center gap-4 px-5 py-3.5">
          <Link
            href="/app/dashboard"
            className="w-9 h-9 rounded-full flex items-center justify-center active-press"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#6b7280' }} />
          </Link>
          <div>
            <h1 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>Cronogramas</h1>
            <p className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>Programas focados em objetivos</p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-5 pb-3 overflow-x-auto no-scrollbar flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all active:scale-95"
              style={{
                background: activeTab === cat.id ? '#0a0f1e' : '#fff',
                color: activeTab === cat.id ? '#fff' : '#6b7280',
                border: '1px solid',
                borderColor: activeTab === cat.id ? '#0a0f1e' : 'rgba(0,0,0,0.08)',
                boxShadow: activeTab === cat.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              <cat.icon size={13} />
              <span className="text-[12px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-5 space-y-5">
        {filteredPrograms.map((prog) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            key={prog.id}
            className="rounded-[var(--radius-xl)] overflow-hidden"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)' }}
          >
            {/* Header */}
            <div className="p-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: prog.levelBg }}
                >
                  <Dumbbell className="w-5 h-5" style={{ color: prog.levelColor }} />
                </div>
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: prog.levelBg, color: prog.levelColor }}
                >
                  {prog.level}
                </span>
              </div>
              <h2 className="text-[16px] font-sans font-black tracking-tight mb-1" style={{ color: '#111827' }}>
                {prog.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" style={{ color: prog.levelColor }} />
                  <span className="text-[12px] font-medium" style={{ color: '#6b7280' }}>{prog.goal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                  <span className="text-[12px] font-medium" style={{ color: '#6b7280' }}>{prog.freq}</span>
                </div>
              </div>
            </div>

            {/* Weeks */}
            {prog.weeks.map((week) => (
              <div key={week.week} className="p-4 space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: '#9ca3af' }}>
                  {week.week}
                </p>
                {week.days.map((dayBlock) => (
                  <div key={dayBlock.day}>
                    <p
                      className="text-[13px] font-bold mb-3 pb-1.5"
                      style={{ color: '#374151', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      {dayBlock.day}
                    </p>
                    <div className="space-y-3">
                      {dayBlock.exercises.map((ex, i) => (
                        <div key={i} className="flex gap-3">
                          <div
                            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5"
                            style={{ background: prog.levelBg, color: prog.levelColor }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-bold" style={{ color: '#111827' }}>{ex.nome}</span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: prog.levelBg, color: prog.levelColor }}
                              >
                                {ex.series}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium mt-0.5" style={{ color: '#9ca3af' }}>{ex.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
