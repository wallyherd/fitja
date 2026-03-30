'use client'

import React from 'react'
import { Check, Sparkles, Zap, ShieldCheck, ArrowLeft, Star, Crown } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  { title: 'SophIA Pro Coach', desc: 'Análise diária personalizada e conselhos master via IA.', icon: Sparkles },
  { title: 'Acesso Ilimitado', desc: 'Todos os cronogramas, dietas e desafios exclusivos.', icon: Zap },
  { title: 'Relatórios de Elite', desc: 'Estatísticas avançadas e predição de resultados.', icon: ShieldCheck },
  { title: 'Sem Anúncios', desc: 'Foque 100% na sua evolução sem interrupções.', icon: Star },
]

export default function PremiumPage() {
  return (
    <div className="max-w-md mx-auto min-h-screen pb-20" style={{ background: '#0a0f1e' }}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-teal-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full" />
      </div>

      <header className="px-5 py-6 flex items-center justify-between relative z-10">
        <Link href="/app/dashboard" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
          <ArrowLeft size={20} />
        </Link>
        <div className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-500/30">
          PLANO PRO
        </div>
      </header>

      <div className="px-5 text-center mb-10 relative z-10">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20"
        >
          <Crown className="w-10 h-10 text-white" fill="currentColor" />
        </motion.div>
        <h1 className="text-[32px] font-sans font-black text-white tracking-tight leading-tight mb-3">
          Sua Evolução <br/> <span className="text-teal-400">Sem Limites</span>
        </h1>
        <p className="text-gray-400 text-[14px] px-4 font-medium">
          Dê o próximo passo e torne-se o melhor atleta da sua liga com as ferramentas de elite do FitJá.
        </p>
      </div>

      {/* Features Grid */}
      <div className="px-5 space-y-4 mb-12 relative z-10">
        {features.map((f, i) => (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            key={f.title} 
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/20">
              <f.icon className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-[15px] font-black text-white tracking-tight">{f.title}</h4>
              <p className="text-[12px] text-gray-500 font-medium">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="px-5 relative z-10">
        <div className="p-8 rounded-[38px] bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-2xl shadow-teal-500/20 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
             
             <div className="flex justify-between items-start mb-8">
               <div>
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Assinatura Anual</p>
                 <h2 className="text-[42px] font-sans font-black tracking-tight leading-none">R$ 99,00<span className="text-[16px] opacity-60 font-bold tracking-normal">/ano</span></h2>
                 <p className="text-[10px] font-bold opacity-60 mt-1 uppercase italic">(Apenas R$ 8,25/mês)</p>
               </div>
               <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                 ECONOMIZE +R$ 69/ano
               </div>
             </div>

             <button className="w-full py-4 rounded-2xl bg-white text-[#0a0f1e] text-[16px] font-black active:scale-[0.98] transition-all shadow-lg mb-4">
               COMEÇAR AGORA
             </button>
             
             <p className="text-[10px] text-center text-white/50 font-bold uppercase tracking-widest">
               Válido por 12 meses • Cancele quando quiser
             </p>
        </div>
        
        {/* Secondary option */}
        <div className="mt-4 text-center">
            <button className="text-gray-500 text-[12px] font-black uppercase tracking-widest active-press">
                OU PLANO MENSAL POR R$ 14,00
            </button>
        </div>
      </div>

    </div>
  )
}
