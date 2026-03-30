'use client'

import React, { useState } from 'react'
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Camera, 
  Utensils, 
  ShieldAlert, 
  ArrowLeft, 
  ChevronRight,
  Info,
  Users,
  Award,
  Lock,
  Zap,
  Gift
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, SophiaBlock } from '@/components/ui/design-system'

const prizes = [
  { rank: 1, title: 'Combos de Elite', desc: '30 Marmitas Fitness + Kit Suplemento Pro', icon: Trophy, color: '#f59e0b' },
  { rank: 2, title: 'Combos Master', desc: '14 Marmitas Fitness + Suplemento', icon: Award, color: '#94a3b8' },
  { rank: 3, title: 'Combos Base', desc: '7 Marmitas Fitness', icon: Target, color: '#92400e' }
]

const rules = [
  "Apenas usuários com assinatura Premium ativa podem participar oficialmente e concorrer a prêmios.",
  "As fotos no feed devem ser reais e datadas. Nossa equipe audita cada postagem diariamente.",
  "Registros de refeições devem ser feitos no FitJá Food Tracker dentro da janela de 24h.",
  "O check-in diário no feed do desafio é obrigatório para manter a pontuação sequencial.",
  "Identificação de ilegalidades, bots ou fotos fakes resultará em desclassificação imediata sem aviso prévio."
]

function Target({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </div>
  )
}

export default function SecaTudoPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'ranking' | 'feed'>('info')
  const isPremium = false // This would come from props/state in reality

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 font-body" style={{ background: '#0a0f1e' }}>
      
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-700 opacity-90 z-10" />
        <img 
          src="/premium_fitness_background_1774686737441.png" 
          alt="Seca Tudo Hero" 
          className="w-full h-full object-cover grayscale" 
        />
        
        <header className="absolute inset-0 z-20 px-6 py-8 flex flex-col justify-between">
          <Link href="/app/dashboard" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </Link>
          
          <div className="mb-4">
             <div className="flex items-center gap-2 mb-2">
                <div className="bg-yellow-400 text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">DESAFIO VIP</div>
                <div className="bg-white/20 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter backdrop-blur-sm italic">🔥 Ativo: 21 DIAS</div>
             </div>
             <h1 className="text-[38px] font-sans font-black text-white leading-none tracking-tight">Seca Tudo 21D</h1>
             <p className="text-white/80 text-[13px] font-medium max-w-[280px] mt-2 italic leading-relaxed">
               A liga de elite que vai derreter gordura e transformar sua mentalidade de atleta.
             </p>
          </div>
        </header>
      </div>

      {/* ── TABS ─────────────────────────────────── */}
      <div className="flex px-4 py-4 gap-2 sticky top-0 z-40 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/5">
        {[
          { id: 'info', label: 'Info', icon: Info },
          { id: 'ranking', label: 'Ranking', icon: Users },
          { id: 'feed', label: 'Feed', icon: Flame },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-[#0a0f1e] shadow-lg shadow-white/10' 
                : 'bg-white/5 text-gray-500'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <main className="px-5 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div 
               key="info"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="space-y-10"
            >
              {/* SCORE CARDS */}
              <div>
                <h3 className="text-white font-black text-[18px] tracking-tight mb-4 flex items-center gap-2 italic uppercase">
                  <Zap size={20} className="text-yellow-400" /> Como Funciona?
                </h3>
                <div className="grid grid-cols-3 gap-3">
                   {[
                     { label: 'Foto Feed', pts: '+50', icon: Camera, color: '#f97316' },
                     { label: 'Refeição', pts: '+20', icon: Utensils, color: '#10b981' },
                     { label: 'Check-in', pts: '+30', icon: Flame, color: '#ea580c' },
                   ].map(s => (
                     <div key={s.label} className="p-4 rounded-3xl bg-white/5 border border-white/5 text-center flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                           <s.icon size={20} style={{ color: s.color }} />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter opacity-60">{s.label}</span>
                        <span className="text-[16px] font-black text-white" style={{ color: s.color }}>{s.pts}</span>
                     </div>
                   ))}
                </div>
              </div>

              {/* PRIZES */}
              <div>
                <h3 className="text-white font-black text-[18px] tracking-tight mb-4 flex items-center gap-2 italic uppercase">
                  <Gift size={20} className="text-teal-400" /> Premiação Final
                </h3>
                <div className="space-y-4">
                  {prizes.map((p) => (
                    <div key={p.rank} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-5 relative overflow-hidden group">
                       {p.rank === 1 && <div className="absolute top-0 right-0 p-3 bg-yellow-400 text-black text-[9px] font-black rounded-bl-2xl">VENCEDOR</div>}
                       <div className="w-16 h-16 rounded-2.5xl flex items-center justify-center shrink-0" style={{ background: `${p.color}20` }}>
                          <p.icon size={32} style={{ color: p.color }} />
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{p.rank}º LUGAR</p>
                          <h4 className="text-[18px] font-black text-white tracking-tight leading-tight">{p.title}</h4>
                          <p className="text-[13px] text-gray-400 font-medium">{p.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RULES & POLICY */}
              <div className="p-6 rounded-[38px] bg-white text-[#0a0f1e]">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert size={28} className="text-rose-600" />
                    <h3 className="text-[20px] font-sans font-black tracking-tight leading-none">Regras & Política</h3>
                 </div>
                 <div className="space-y-3 mb-8">
                    {rules.map((rule, i) => (
                      <div key={i} className="flex gap-3">
                         <CheckCircle2 size={16} className="text-[#0a0f1e]/20 mt-0.5 shrink-0" />
                         <p className="text-[12px] font-bold leading-relaxed">{rule}</p>
                      </div>
                    ))}
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-3 italic">
                    <Info size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-rose-700">Responsabilidade: O FitJá não se responsabiliza por riscos físicos do usuário. Consulte um profissional antes de qualquer mudança radical.</p>
                 </div>
              </div>

              {/* PARTICIPATE BUTTON */}
              {!isPremium ? (
                <div className="flex flex-col gap-4">
                  <div className="p-6 rounded-[32px] bg-teal-500/10 border border-teal-500/20 text-center">
                    <Lock size={32} className="text-teal-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-[15px] mb-4">Acesso exclusivo para membros Elite.</p>
                    <Link href="/app/premium">
                      <button className="w-full py-4 rounded-2xl bg-teal-500 text-white font-black text-[14px] uppercase tracking-widest active-press shadow-teal-500/20">
                         Tornar-se Premium
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <button className="w-full py-5 rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-[16px] uppercase tracking-widest shadow-2xl shadow-orange-500/30 active:scale-95 transition-all">
                  Participar do Desafio
                </button>
              )}
            </motion.div>
          )}

          {activeTab === 'ranking' && (
             <motion.div 
               key="ranking"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-4"
             >
                <SophiaBlock message="O ranking é atualizado a cada check-in. Mantenha a constância e poste suas fotos!" />
                
                <div className="space-y-3">
                   {[
                     { name: 'Lucas Oliveira', pts: 1250, rank: 1, img: 'https://i.pravatar.cc/100?u=1' },
                     { name: 'Amanda Silva', pts: 1100, rank: 2, img: 'https://i.pravatar.cc/100?u=2' },
                     { name: 'Ricardo Dias', pts: 980, rank: 3, img: 'https://i.pravatar.cc/100?u=3' },
                     { name: 'Carla Souza', pts: 850, rank: 4, img: 'https://i.pravatar.cc/100?u=4' },
                     { name: 'Você', pts: 320, rank: 12, img: 'https://i.pravatar.cc/100?u=99', isSelf: true },
                   ].map(u => (
                     <div key={u.name} className={`p-4 rounded-2xl flex items-center justify-between border ${u.isSelf ? 'bg-teal-500/10 border-teal-500/30' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center gap-4">
                           <span className={`text-[12px] font-black w-6 ${u.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>#{u.rank}</span>
                           <img src={u.img} className="w-10 h-10 rounded-full border border-white/10" alt={u.name} />
                           <span className="text-[14px] font-bold text-white tracking-tight">{u.name}</span>
                        </div>
                        <span className="text-[15px] font-black text-white">{u.pts} <span className="text-[9px] opacity-40 uppercase tracking-tighter">PTS</span></span>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'feed' && (
             <motion.div 
               key="feed"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
             >
                <button className="w-full p-6 rounded-3xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center gap-3 text-white/50 hover:text-white transition-colors active-press">
                   <Camera size={24} />
                   <span className="text-[14px] font-black uppercase tracking-widest">Postar no Feed</span>
                </button>

                <div className="space-y-10">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                           <img src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-9 h-9 rounded-full" alt="User" />
                           <div>
                              <p className="text-[13px] font-black text-white leading-none">Atleta#{i+100}</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Faltam 18 dias • Secando!</p>
                           </div>
                        </div>
                        <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 overflow-hidden shadow-2xl">
                           <img src={`https://images.unsplash.com/photo-${1517836357463 + i}-4762ae05206d?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover" alt="Challenge Post" />
                        </div>
                        <div className="bg-teal-500/10 p-3 rounded-2xl flex items-center justify-between border border-teal-500/20">
                            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">Foto do Dia</span>
                            <span className="text-[11px] font-black text-teal-400">+50 PTS</span>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── STICKY CHECK-IN BAR ── */}
      {isPremium && activeTab === 'feed' && (
        <div className="fixed bottom-24 left-0 right-0 px-6 z-50">
           <button className="w-full py-5 rounded-[40px] bg-white text-[#0a0f1e] font-black text-[16px] uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(255,255,255,0.2)] active-press">
              Fazer Check-in Diário
           </button>
        </div>
      )}

    </div>
  )
}
