'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Clock, BookOpen, Heart, Brain, Flame, Apple, Moon, Zap, TrendingUp, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { id: 'all', label: 'Todos', icon: BookOpen },
  { id: 'Nutrição', label: 'Nutrição', icon: Apple },
  { id: 'Saúde Mental', label: 'Mente', icon: Brain },
  { id: 'Sono & Recuperação', label: 'Recuperação', icon: Moon },
  { id: 'Metabolismo', label: 'Metabolismo', icon: TrendingUp },
]

const articles = [
  {
    category: 'Nutrição',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: Apple,
    title: 'Por que a proteína é a rainha dos macronutrientes?',
    read: '4 min',
    content: [
      'A proteína é o único macronutriente que o corpo não armazena como reserva — ela precisa ser consumida diariamente.',
      'Funções essenciais da proteína:',
      '• Construção e reparação de músculos após o treino',
      '• Produção de enzimas, hormônios e anticorpos',
      '• Manutenção da saciedade — proteína reduz o hormônio grelina (fome) por mais tempo que carboidratos ou gordura',
      '• Efeito térmico: o corpo gasta ~30% das calorias da proteína só para digeri-la',
      'Quanto consumir? Para ganho muscular: 1.6g–2.2g por kg de peso corporal. Para manutenção: 1.2g/kg. Para perda de gordura: recomenda-se manter a proteína alta (1.8g/kg) para preservar massa magra.',
      'Melhores fontes: frango sem pele, atum, ovos, whey protein, grão-de-bico, lentilha, tofu firme.',
    ],
  },
  {
    category: 'Nutrição',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: Sparkles,
    title: 'Suplementação Básica: O que realmente funciona?',
    read: '6 min',
    content: [
      'O mercado de suplementos é gigante, mas poucos produtos têm evidência científica sólida nível A.',
      'Os 3 pilares da suplementação eficiente:',
      '1. Creatina Monohidratada: Aumenta a força e explosão. 3-5g/dia, todos os dias.',
      '2. Proteína em Pó (Whey/Vegana): Praticidade para atingir a meta proteica diária.',
      '3. Cafeína: Melhora foco e reduz percepção de esforço.',
      'Lembre-se: suplementos são o topo da pirâmide. Base (sono, dieta, treino) vem primeiro.',
    ],
  },
  {
    category: 'Saúde Mental',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    icon: Brain,
    title: 'Exercício é o antidepressivo mais subestimado do mundo',
    read: '5 min',
    content: [
      'Estudos publicados no JAMA Psychiatry mostram que 150 minutos de exercício moderado por semana reduzem sintomas depressivos em até 47% — comparável a antidepressivos de primeira linha.',
      'O que acontece no seu cérebro durante o exercício:',
      '• Liberação de endorfinas e dopamina imediatamente após o esforço',
      '• Aumento do BDNF (fator neurotrófico) — proteína que "fertiliza" a memória e o aprendizado',
      '• Regulação do cortisol (hormônio do estresse) nas horas seguintes',
      '• Melhora do sono profundo (fase delta) em até 65%',
      'Você não precisa de academia: caminhadas de 30 minutos em ritmo moderado já ativam esses mecanismos. A constância é mais importante que a intensidade.',
    ],
  },
  {
    category: 'Sono & Recuperação',
    color: '#f59e0b',
    bg: '#fffbeb',
    icon: Moon,
    title: 'Músculo não cresce na academia — cresce dormindo',
    read: '4 min',
    content: [
      'Durante o sono profundo (fase 3 e 4 do NREM), o corpo libera 70% de todo o hormônio do crescimento (GH) do dia. Sem sono de qualidade, o treino mais intenso do mundo não entrega os resultados esperados.',
      'O que acontece quando você dorme menos de 6h por noite:',
      '• Níveis de testosterona caem 10–15%',
      '• Cortisol aumenta — o que causa catabolismo muscular',
      '• Recuperação do glicogênio muscular fica comprometida',
      '• Maior propensão a lesões e inflamações',
      'Estratégias para melhorar o sono:',
      '• Temperatura do quarto: 18–20°C',
      '• Sem telas 1h antes de dormir',
      '• Comer a última refeição 2h antes de deitar',
      '• Horário fixo de acordar — mesmo no fim de semana',
    ],
  },
  {
    category: 'Metabolismo',
    color: '#f43f5e',
    bg: '#fff1f2',
    icon: TrendingUp,
    title: 'Por que o "modo faminto" não existe — mas a adaptação metabólica sim',
    read: '5 min',
    content: [
      'Existe um mito popular de que se você comer pouco, seu corpo "trava" e para de queimar gordura. A realidade é mais sutil e mais interessante.',
      'O que realmente acontece em dietas de baixa caloria:',
      '• O corpo reduz o gasto calórico em repouso em 10–25% (adaptação metabólica)',
      '• A termogênese adaptativa (calor produzido pelo corpo) diminui',
      '• Aumento do hormônio grelina (fome) — que pode durar meses',
      '• Redução da leptina (hormônio da saciedade)',
      'Como contornar isso:',
      '• Refeeds estratégicos: 1 dia por semana com calorias na manutenção',
      '• Priorizar proteína — não reduz o metabolismo como carboidratos e gorduras',
      '• Treino de força durante a dieta — mantém massa muscular e metabolismo',
      '• Déficit moderado (300–500 kcal/dia) é mais sustentável que cortes drásticos',
    ],
  },
]

export default function ArtigosPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeTab)

  return (
    <div className="max-w-md mx-auto pb-32 font-body" style={{ background: '#f8fafb', minHeight: '100vh' }}>

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
            <h1 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>Artigos de Saúde</h1>
            <p className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>Ciência aplicada ao seu dia a dia</p>
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
                background: activeTab === cat.id ? '#8b5cf6' : '#fff',
                color: activeTab === cat.id ? '#fff' : '#6b7280',
                border: '1px solid',
                borderColor: activeTab === cat.id ? '#8b5cf6' : 'rgba(0,0,0,0.08)',
                boxShadow: activeTab === cat.id ? '0 4px 12px rgba(139,92,246,0.25)' : 'none',
              }}
            >
              <cat.icon size={13} />
              <span className="text-[12px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-5 space-y-4">
        {filteredArticles.map((a, idx) => {
          const Icon = a.icon
          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className="rounded-[var(--radius-xl)] overflow-hidden"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)' }}
            >
              {/* Top */}
              <div className="p-5 pb-4" style={{ background: a.bg, borderBottom: `1px solid ${a.color}18` }}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ background: `${a.color}18`, color: a.color }}
                  >
                    {a.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                    <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>{a.read} leitura</span>
                  </div>
                </div>
                <h2 className="text-[15px] font-sans font-black tracking-tight leading-snug" style={{ color: '#111827' }}>
                  {a.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                {a.content.map((para, i) => (
                  <p key={i} className="text-[13px] font-medium leading-relaxed" style={{ color: para.startsWith('•') || /^\d\./.test(para) ? '#374151' : '#6b7280' }}>
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

