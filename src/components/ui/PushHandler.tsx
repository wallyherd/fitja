'use client'

import React, { useState, useEffect } from 'react'
import { Bell, X, ShieldAlert, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function PushHandler() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Show prompt if permission not granted
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShowPrompt(true), 15000) // Delay 15s for experience
      return () => clearTimeout(timer)
    }
  }, [])

  async function requestPermission() {
    setShowPrompt(false)
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // Success!
      console.log('Notification permission granted.')
    }
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           className="fixed bottom-24 left-4 right-4 z-[100]"
        >
          <div className="p-5 rounded-[var(--radius-3xl)] bg-[#0a0f1e] text-white shadow-2xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex gap-4 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/20">
                <Bell className="w-6 h-6 text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-sans font-black tracking-tight leading-tight mb-1">Deseja Ativar Avisos?</h3>
                <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                  Não deixe o relógio vencer você. Ative as notificações nativas para receber lembretes críticos de água, treinos e subir no ranking.
                </p>
              </div>
              <button onClick={() => setShowPrompt(false)} className="text-gray-500 active:scale-90 transition-transform">
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-3">
               <button 
                 onClick={requestPermission}
                 className="flex-1 py-3.5 rounded-2xl bg-teal-500 text-[#0a0f1e] text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
               >
                 ATIVAR AGORA
               </button>
               <button 
                 onClick={() => setShowPrompt(false)}
                 className="px-6 py-3.5 rounded-2xl bg-white/5 text-gray-400 text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all"
               >
                 NÃO
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
