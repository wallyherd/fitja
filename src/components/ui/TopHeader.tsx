'use client'

import React, { useState, useEffect } from 'react'
import { Bell, User, X, Clock, Flame, Trophy, Info, ShieldEllipsis } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NotificationCenter } from './NotificationCenter'

type Props = {
  profile: any
}

export function TopHeader({ profile }: Props) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkUnread()
    
    // Simple polling for unread (could use realtime if needed)
    const interval = setInterval(checkUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  async function checkUnread() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { count } = await supabase
      .from('notifications_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('read_at', null)

    setHasUnread(!!count && count > 0)
  }

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[60] h-16 flex items-center justify-between px-6 px-safe transition-all"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* ─── ESQUERDA: ADMIN PIN (SE FOR ADMIN) ─── */}
        <div className="w-9">
           {profile?.id === '5b5453fa-2add-47e6-b5db-8326f24028ee' && (
             <Link href="/app/admin" className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 active:scale-90 transition-all">
                <ShieldEllipsis size={18} />
             </Link>
           )}
        </div>

        {/* ─── DIREITA: NOTIFICAÇÃO + PERFIL ─── */}
        <div className="flex items-center gap-1.5">
          {/* Bell */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsNotifOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full active:bg-black/5 transition-all"
          >
            <Bell size={20} className="text-[#0a0f1e]" strokeWidth={2.2} />
            {hasUnread && (
              <span 
                className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full border border-white animate-pulse" 
                style={{ background: '#f43f5e' }}
              />
            )}
          </motion.button>

          {/* Profile */}
          <Link href="/app/profile">
            <motion.div 
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center relative shadow-sm"
              style={{
                border: '2px solid rgba(20,184,166,0.15)',
                background: '#ffffff',
              }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-[#14b8a6]" />
              )}
            </motion.div>
          </Link>
        </div>
      </header>

      <NotificationCenter 
        isOpen={isNotifOpen} 
        onClose={() => {
          setIsNotifOpen(false)
          setHasUnread(false) // Optimistic clear for simple UI
        }} 
      />
    </>
  )
}
