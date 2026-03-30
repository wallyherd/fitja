'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Trophy, Flame, Star, Crown, ChevronRight, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

interface RankItem {
  user_id: string
  full_name: string
  avatar_url: string | null
  total_points: number
  perfect_days: number
  current_streak: number
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRanking()
  }, [])

  async function fetchRanking() {
    setLoading(true)
    const { data } = await supabase
      .from('vw_weekly_ranking')
      .select('*')
      .limit(20)

    if (data) setRanking(data)
    setLoading(false)
  }

  const getBadge = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />
      case 1: return <Star className="w-6 h-6 text-gray-400" fill="currentColor" />
      case 2: return <Star className="w-6 h-6 text-orange-400" fill="currentColor" />
      default: return <span className="text-[14px] font-black text-gray-300">#{index + 1}</span>
    }
  }

  return (
    <div className="max-w-md mx-auto pb-32 font-body" style={{ background: '#f8fafb', minHeight: '100vh' }}>
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-black/5 flex items-center gap-4">
        <Link href="/app/dashboard" className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center active:scale-90 transition-transform shadow-sm">
          <ChevronLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-[18px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>Liga Semanal</h1>
          <p className="text-[11px] font-medium text-gray-400">Os atletas mais brabos da semana</p>
        </div>
      </header>

      {/* Top 3 Podium */}
      <div className="px-5 pt-8 pb-10 flex items-end justify-center gap-4 bg-gradient-to-b from-white to-[#f8fafb]">
        {/* 2nd Place */}
        {ranking[1] && (
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50">
                {ranking[1].avatar_url ? (
                  <img src={ranking[1].avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-300 m-auto" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black">2</div>
            </div>
            <p className="text-[12px] font-black text-center truncate w-20 leading-tight mb-1">{ranking[1].full_name.split(' ')[0]}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{Math.round(ranking[1].total_points)} PTS</p>
          </div>
        )}

        {/* 1st Place */}
        {ranking[0] && (
          <div className="flex flex-col items-center flex-[1.2] -mb-4">
            <Crown className="w-6 h-6 text-yellow-500 mb-2 drop-shadow-lg" fill="currentColor" />
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden bg-white shadow-xl">
                {ranking[0].avatar_url ? (
                  <img src={ranking[0].avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-teal-400 m-auto" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center text-[12px] font-black shadow-lg ring-4 ring-white">1</div>
            </div>
            <p className="text-[14px] font-black text-center truncate w-24 leading-tight mb-1">{ranking[0].full_name.split(' ')[0]}</p>
            <p className="text-[11px] font-black text-teal-600 uppercase tracking-widest">{Math.round(ranking[0].total_points)} PTS</p>
          </div>
        )}

        {/* 3rd Place */}
        {ranking[2] && (
          <div className="flex flex-col items-center flex-1">
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-full border-4 border-orange-100 overflow-hidden bg-gray-50">
                {ranking[2].avatar_url ? (
                  <img src={ranking[2].avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-300 m-auto" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-[9px] font-black">3</div>
            </div>
            <p className="text-[11px] font-black text-center truncate w-16 leading-tight mb-1">{ranking[2].full_name.split(' ')[0]}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{Math.round(ranking[2].total_points)} PTS</p>
          </div>
        )}
      </div>

      {/* Full List */}
      <div className="px-5 space-y-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse bg-white rounded-2xl border border-black/5" />
          ))
        ) : (
          ranking.slice(3).map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.user_id}
              className="p-4 rounded-2xl bg-white border border-black/5 flex items-center gap-4 shadow-sm"
            >
              <div className="w-6 flex justify-center">
                <span className="text-[12px] font-black text-gray-300">#{idx + 4}</span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-black/5">
                {item.avatar_url ? (
                  <img src={item.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-200 m-auto p-2" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-black text-gray-900 leading-tight">{item.full_name}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-[10px] font-bold text-gray-400">{item.current_streak} dias</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-teal-500" />
                    <span className="text-[10px] font-bold text-teal-600">{item.perfect_days} ofensivas 100%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-black text-gray-900">{Math.round(item.total_points)}</p>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">PONTOS</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="p-5 mt-4">
        <div className="p-6 rounded-3xl bg-[#0a0f1e] text-white relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl" />
          <Trophy className="w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-[16px] font-sans font-black tracking-tight mb-2">Como subir no Ranking?</h3>
          <p className="text-[13px] leading-relaxed text-gray-400 font-medium">
            Registre refeições, beba água e treine! Cada atividade completa gera pontos valiosos para sua liga semanal. <br/><br/>
            ⭐ 100% no dia = Bônus de Ofensiva.
          </p>
        </div>
      </div>

    </div>
  )
}
