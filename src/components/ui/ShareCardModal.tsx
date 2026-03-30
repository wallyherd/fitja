'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Award, Flame, Star, Trophy, ArrowRight } from 'lucide-react'

interface ShareCardModalProps {
  isOpen: boolean
  onClose: () => void
  streak: number
  points: number
  userName: string
}

export function ShareCardModal({ isOpen, onClose, streak, points, userName }: ShareCardModalProps) {
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu progresso no FitJá!',
          text: `Já bati minhas metas hoje no FitJá! 🔥 ${streak} dias de ofensiva. Una-se a mim!`,
          url: window.location.origin,
        })
      } catch (err) {
        console.log('Share failed', err)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[340px] flex flex-col items-center"
          >
            {/* The Visual Card to be Screenshotted */}
            <div 
              id="share-card"
              className="w-full aspect-[4/5] rounded-[42px] p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Decor */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/20 rounded-full blur-[60px]" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px]" />
              
              <div className="flex items-center gap-1.5 mb-8 relative z-10">
                 <Trophy size={16} className="text-teal-400" />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] text-teal-400">FitJá Premium</span>
              </div>

              <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mb-6 relative z-10 border border-teal-500/20 shadow-2xl shadow-teal-500/20">
                <Flame className="w-12 h-12 text-teal-400" />
              </div>

              <h2 className="text-[34px] font-sans font-black text-white tracking-tighter leading-[0.9] mb-4 relative z-10">
                DIA <br/> <span className="text-teal-400">IMPECÁVEL</span>
              </h2>

              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest mb-10 relative z-10">
                {userName.toUpperCase()}
              </p>

              <div className="w-full grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ofensiva</p>
                   <p className="text-[20px] font-black text-white">{streak} dias</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pontos</p>
                   <p className="text-[20px] font-black text-white">{Math.round(points)}</p>
                </div>
              </div>

              <p className="mt-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Join the Elite @ fitja.app</p>
            </div>

            {/* Actions */}
            <div className="mt-8 w-full flex flex-col gap-3">
              <button 
                onClick={handleShare}
                className="w-full py-4 rounded-2xl bg-white text-[#0a0f1e] text-[14px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
              >
                <Share2 size={18} />
                COMPARTILHAR AGORA
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-white/10 text-white text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                VOLTAR
              </button>
            </div>
            
            <p className="mt-5 text-[11px] text-gray-400 font-medium text-center px-4">
              Tire um print para postar nos seus Stories e marcar o seu squad! ⚡️
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
