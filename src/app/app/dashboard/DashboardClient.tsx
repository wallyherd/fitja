'use client'

import React, { useState } from 'react'
import { ShareCardModal } from '@/components/ui/ShareCardModal'
import { PushHandler } from '@/components/ui/PushHandler'
import { Award, Share2 } from 'lucide-react'

interface DashboardClientProps {
  streak: number
  points: number
  userName: string
  isComplete: boolean
  children: React.ReactNode
}

export function DashboardClient({ streak, points, userName, isComplete, children }: DashboardClientProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <>
      <div className="relative">
        {children}
        
        {/* SHARE CTA (Fixed or Floating) */}
        {isComplete && (
          <div className="px-4 mb-10">
            <div className="p-6 rounded-[32px] bg-teal-50 border border-teal-100 flex flex-col items-center text-center shadow-lg shadow-teal-500/5">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 border border-teal-500/20">
                   <Award className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-[17px] font-sans font-black tracking-tight text-teal-900 mb-1">
                  Dia Impecável! 🏆
                </h3>
                <p className="text-[13px] font-medium text-teal-600 mb-5 px-6">
                  Compartilhe sua vitória e inspire sua rede!
                </p>
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="w-full py-4 rounded-2xl bg-teal-500 text-white text-[14px] font-black shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Share2 className="w-4 h-4" />
                  GERAR CARD DE STATUS
                </button>
            </div>
          </div>
        )}
      </div>

      <ShareCardModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)}
        streak={streak}
        points={points}
        userName={userName}
      />

      <PushHandler />
    </>
  )
}
