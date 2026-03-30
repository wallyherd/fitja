'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Impede o Chrome de mostrar o prompt automtico
      e.preventDefault()
      // Salva o evento para ser disparado depois
      setDeferredPrompt(e)
      // Mostra o nosso prprio boto
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Detecta se j est instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
       setVisible(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostra o prompt nativo
    deferredPrompt.prompt()
    
    // Espera a escolha do usurio
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('Usurio aceitou a instalao')
    }
    
    // Limpa o prompt e esconde o boto
    setDeferredPrompt(null)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 20, scale: 0.8 }}
           className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3"
        >
          {/* DICA DE TEXTO (SOPRADA) */}
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-soft border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-bounce">
             Instalar FitJá no Celular
          </div>

          <div className="flex items-center gap-2">
            <button 
               onClick={() => setVisible(false)}
               className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-zinc-400 hover:text-zinc-600 border border-zinc-100 transition-all"
            >
               <X className="w-4 h-4" />
            </button>

            <button
               onClick={handleInstallClick}
               className="h-14 px-6 bg-brand-500 text-white rounded-[2rem] shadow-[0_15px_35px_rgba(0,209,178,0.4)] border-4 border-white flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group"
            >
               <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" />
               </div>
               <span className="font-sans font-black text-xs uppercase tracking-tighter">Baixar App</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
