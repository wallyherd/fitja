'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, Users, Gift, Crown, Trophy, CheckCircle2, 
  ArrowLeft, Copy, Sparkles, DollarSign, Clock
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ReferralPage() {
  const [profile, setProfile] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: pr } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(pr)

    const { data: refs } = await supabase
      .from('profiles')
      .select('full_name, subscription_status, created_at')
      .eq('referred_by_id', user.id)
    
    if (refs) setReferrals(refs)
  }

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/signup?ref=${profile?.referral_code}` 
    : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activePaidRefs = referrals.filter(r => r.subscription_status === 'active').length
  const annualPaidRefs = referrals.filter(r => r.subscription_status === 'active' && r.tier === 'annual').length
  
  // 30-day Cycle Logic
  const daysLeft = 30 - Math.floor((new Date().getTime() - new Date(profile?.created_at || new Date()).getTime()) / (1000 * 60 * 60 * 24)) % 30
  
  const tiers = [
    { label: '5 Pagantes', reward: '+1 Mês Elite', goal: 5, current: activePaidRefs, icon: Crown, color: '#14b8a6' },
    { label: '10 Pagantes', reward: 'Assinatura Anual', goal: 10, current: activePaidRefs, icon: Trophy, color: '#f59e0b' },
    { label: '5 Anuais', reward: 'R$ 129 via Pix', goal: 5, current: annualPaidRefs, icon: DollarSign, color: '#22c55e' }
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0f1e' }}>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/app/dashboard" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 bg-rose-500/20 text-rose-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/30">
          <Clock size={14} /> {daysLeft} DIAS RESTANTES
        </div>
      </header>

      <div className="px-6 text-center mb-10 relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30 -rotate-3"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-[32px] font-sans font-black text-white tracking-tight leading-none mb-3">
          Mini-Desafio <br/> <span className="text-teal-400">Viral 30 Dias</span>
        </h1>
        <p className="text-gray-400 text-[14px] px-8 font-medium leading-relaxed">
          O período de indicações reseta a cada 30 dias. Acelere sua rede e desbloqueie prêmios em dinheiro e assinaturas.
        </p>
      </div>

      <main className="px-6 space-y-8 relative z-10">
        
        {/* Challenge Tiers Cards */}
        <div className="space-y-4">
           {tiers.map(t => {
              const Icon = t.icon
              const progress = Math.min(100, (t.current / t.goal) * 100)
              const isComplete = t.current >= t.goal

              return (
                <div key={t.label} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{t.label}</p>
                         <h3 className="text-[18px] font-black text-white tracking-tight">{t.reward}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${t.color}20` }}>
                         <Icon size={20} style={{ color: t.color }} />
                      </div>
                   </div>

                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full"
                        style={{ background: t.color }}
                      />
                   </div>
                   
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-gray-500">{t.current} de {t.goal} concluídos</span>
                      {isComplete && <span className="text-teal-400">RESGATAR AGORA!</span>}
                   </div>
                </div>
              )
           })}
        </div>

        {/* Share Section */}
        <div className="space-y-4">
           <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Seu Link de Convite Especial</p>
           <div className="flex gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-[14px] font-mono truncate">
                 {referralLink}
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-14 h-14 bg-white text-[#0a0f1e] rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl"
              >
                 {copied ? <CheckCircle2 size={24} className="text-teal-600" /> : <Copy size={24} />}
              </button>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] text-white text-[14px] font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                 <Share2 size={18} />
                 WHATSAPP
              </button>
              <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white text-[14px] font-black shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
                 <Share2 size={18} />
                 INSTAGRAM
              </button>
           </div>
        </div>

        {/* Referral Status List */}
        <div className="space-y-4">
           <h3 className="text-[15px] font-black text-white uppercase tracking-widest pl-2">Amigos que entraram ({referrals.length})</h3>
           {referrals.length === 0 ? (
             <div className="p-10 rounded-[2.5rem] border border-white/5 border-dashed flex flex-col items-center justify-center text-center opacity-40">
                <Users className="text-white/20 mb-3" size={40} />
                <p className="text-[13px] text-white font-medium">Ninguém usou seu link ainda. <br/> Comece a divulgar!</p>
             </div>
           ) : (
             <div className="space-y-2">
                {referrals.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white font-black">
                           {r.full_name?.charAt(0)}
                        </div>
                        <div>
                           <p className="text-[13px] font-bold text-white">{r.full_name}</p>
                           <p className="text-[10px] text-gray-500 font-medium">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                     {r.subscription_status === 'active' ? (
                       <div className="flex items-center gap-1.5 text-teal-400">
                          <Crown size={14} />
                          <span className="text-[10px] font-black uppercase text-teal-500">Assinante</span>
                       </div>
                     ) : (
                       <span className="text-[10px] font-black uppercase text-gray-600">Pendente</span>
                     )}
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Rewards Info */}
        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-start">
           <Sparkles className="text-indigo-400 shrink-0" size={24} />
           <div>
              <h4 className="text-[14px] font-black text-white mb-1 tracking-tight">E o Selo Exclusivo?</h4>
              <p className="text-[12px] text-indigo-200/60 font-medium leading-relaxed">
                Assim que atingir 4 assinantes, o selo **"FitJá Pioneer"** aparecerá automaticamente no seu perfil ao lado do seu nome.
              </p>
           </div>
        </div>

      </main>

    </div>
  )
}
