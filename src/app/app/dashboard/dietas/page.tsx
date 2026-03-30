'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Star, Clock, Flame, Leaf, Beef, Salad, Apple, Coffee, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  { id: 'all', label: 'Todas', icon: Zap },
  { id: 'loss', label: 'Emagrecer', icon: Flame },
  { id: 'gain', label: 'Ganho Massa', icon: Beef },
  { id: 'health', label: 'Saúde', icon: Leaf },
  { id: 'detox', label: 'Detox', icon: Salad },
]

const diets = [
  {
    id: 'low-carb',
    category: 'loss',
    title: 'Low Carb para Emagrecer',
    desc: 'Reduz carboidratos e prioriza proteínas e gorduras boas. Ideal para perda de gordura sem perder massa muscular.',
    kcal: '1600–1800',
    tags: ['Emagrecimento', 'Popular'],
    icon: Flame,
    color: '#ea580c',
    bg: '#fff7ed',
    meals: [
      { nome: 'Café da Manhã', itens: ['2 ovos mexidos', '1 fatia de queijo', 'Café sem açúcar', '1 abacate pequeno'] },
      { nome: 'Almoço', itens: ['150g de frango grelhado', 'Salada verde à vontade', '2 col. azeite extra-virgem', '1 tomate'] },
      { nome: 'Lanche', itens: ['Punhado de nozes', '1 fatia de presunto', 'Água com limão'] },
      { nome: 'Jantar', itens: ['200g de peixe grelhado', 'Brócolis no vapor', 'Salada de pepino com azeite'] },
    ],
  },
  {
    id: 'hipertrofia',
    category: 'gain',
    title: 'Dieta de Hipertrofia',
    desc: 'Alto consumo proteico e calórico para quem busca ganho de massa muscular com treinos de força.',
    kcal: '2800–3200',
    tags: ['Ganho muscular', 'Atleta'],
    icon: Beef,
    color: '#0d9488',
    bg: '#f0fdfb',
    meals: [
      { nome: 'Café da Manhã', itens: ['200g de frango', '1 xícara de aveia', '3 ovos', 'Banana pós-treino'] },
      { nome: 'Pré-treino', itens: ['150g de batata-doce', '100g de peito de frango', 'Suco de beterraba'] },
      { nome: 'Almoço', itens: ['200g de carne bovina magra', '1 xícara de arroz integral', 'Feijão carioca', 'Salada colorida'] },
      { nome: 'Pós-treino', itens: ['Whey protein 30g', 'Banana', '1 col. pasta amendoim'] },
      { nome: 'Jantar', itens: ['200g de atum', 'Purê de batata-doce', 'Legumes no vapor'] },
    ],
  },
  {
    id: 'ketogenic',
    category: 'loss',
    title: 'Cetogênica Turbo',
    desc: 'Resete seu metabolismo usando gordura como fonte primária de energia. Foco em corpos cetônicos.',
    kcal: '1500–1700',
    tags: ['Keto', 'Queima Rápida'],
    icon: Zap,
    color: '#d97706',
    bg: '#fef3c7',
    meals: [
      { nome: 'Café', itens: ['Café Bulletproof (manteiga + MCT)', 'Ovos com bacon'] },
      { nome: 'Almoço', itens: ['Cupim ou picanha', 'Espinafre com queijo', 'Abacate'] },
      { nome: 'Jantar', itens: ['Omelete de 4 ovos', 'Queijo brie', 'Salmão gordo'] },
    ],
  },
  {
    id: 'vegan-muscle',
    category: 'gain',
    title: 'Vegana de Ganho (Plant Based)',
    desc: 'Proteínas vegetais de alta absorção para construir músculos sem derivados animais.',
    kcal: '2600–2900',
    tags: ['Vegano', 'Limpa'],
    icon: Leaf,
    color: '#16a34a',
    bg: '#f0fdf4',
    meals: [
      { nome: 'Café', itens: ['Tofu mexido com cúrcuma', 'Pão de fermentação natural', 'Proteína de ervilha'] },
      { nome: 'Almoço', itens: ['Tempeh grelhado', 'Quinoa real', 'Lentilhas e vegetais'] },
      { nome: 'Jantar', itens: ['Hambúrguer de grão-de-bico', 'Salada de batata-doce', 'Mix de sementes'] },
    ],
  },
  {
    id: 'mediterranea',
    category: 'health',
    title: 'Dieta Mediterrânea',
    desc: 'Rica em gorduras boas, fibras e antioxidantes. Ótima para saúde geral, coração e longevidade.',
    kcal: '2000–2200',
    tags: ['Saúde', 'Longevidade'],
    icon: Leaf,
    color: '#16a34a',
    bg: '#f0fdf4',
    meals: [
      { nome: 'Café da Manhã', itens: ['Pão integral com azeite e tomate', 'Queijo branco', 'Café ou chá verde'] },
      { nome: 'Almoço', itens: ['Salada grega (pepino, azeitona, feta)', '150g de atum ou salmão', 'Arroz integral', 'Azeite generoso'] },
      { nome: 'Lanche', itens: ['Hummus com palitos de cenoura', '1 punhado de amêndoas', 'Frutas da estação'] },
      { nome: 'Jantar', itens: ['Macarrão integral al dente', 'Molho de tomate fresco', 'Abobrinha grelhada', 'Parmesão ralado'] },
    ],
  },
  {
    id: 'detox',
    category: 'detox',
    title: 'Semana Detox',
    desc: 'Elimina toxinas e reseta o metabolismo em 7 dias com alimentos naturais, líquidos e anti-inflamatórios.',
    kcal: '1400–1600',
    tags: ['Detox', '7 dias'],
    icon: Apple,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    meals: [
      { nome: 'Ao acordar', itens: ['Água morna com limão e gengibre'] },
      { nome: 'Café da Manhã', itens: ['Smoothie verde (espinafre, banana, pepino)', '1 col. chia', 'Água de coco'] },
      { nome: 'Almoço', itens: ['Sopa de legumes caseira', 'Arroz integral', 'Frango cozido sem pele'] },
      { nome: 'Lanche', itens: ['Chá de erva-cidreira ou camomila', '1 maçã com canela'] },
      { nome: 'Jantar', itens: ['Salada de folhas com cenoura ralada', 'Ovo cozido', 'Azeite + limão'] },
    ],
  },
]

export default function DietasPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredDiets = activeTab === 'all' 
    ? diets 
    : diets.filter(d => d.category === activeTab)

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
            <h1 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>Dietas Prontas</h1>
            <p className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>Planos curados por especialistas</p>
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
                background: activeTab === cat.id ? '#14b8a6' : '#fff',
                color: activeTab === cat.id ? '#fff' : '#6b7280',
                border: '1px solid',
                borderColor: activeTab === cat.id ? '#14b8a6' : 'rgba(0,0,0,0.08)',
                boxShadow: activeTab === cat.id ? '0 4px 12px rgba(20,184,166,0.25)' : 'none',
              }}
            >
              <cat.icon size={13} />
              <span className="text-[12px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-5 space-y-5">
        {filteredDiets.map((diet) => {
          const Icon = diet.icon
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={diet.id}
              className="rounded-[var(--radius-xl)] overflow-hidden"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.06)' }}
            >
              {/* Top banner */}
              <div className="p-5 pb-4" style={{ background: diet.bg, borderBottom: `1px solid ${diet.color}18` }}>
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                    style={{ background: `${diet.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: diet.color }} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {diet.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${diet.color}18`, color: diet.color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-[16px] font-sans font-black tracking-tight mb-1" style={{ color: '#111827' }}>
                  {diet.title}
                </h2>
                <p className="text-[12px] font-medium leading-relaxed mb-2" style={{ color: '#6b7280' }}>{diet.desc}</p>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" style={{ color: diet.color }} />
                  <span className="text-[12px] font-bold" style={{ color: diet.color }}>{diet.kcal} kcal/dia</span>
                </div>
              </div>

              {/* Meals */}
              <div className="p-4 space-y-3">
                {diet.meals.map((meal) => (
                  <div key={meal.nome}>
                    <p className="text-[11px] font-black uppercase tracking-[0.1em] mb-1.5" style={{ color: '#9ca3af' }}>
                      {meal.nome}
                    </p>
                    <div className="space-y-1">
                      {meal.itens.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full shrink-0" style={{ background: diet.color }} />
                          <span className="text-[13px] font-medium" style={{ color: '#374151' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

