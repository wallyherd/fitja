'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, X, Check, Clock, Info, Trophy, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  read_at: string | null
  created_at: string
}

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  async function fetchNotifications() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('notifications_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setNotifications(data)
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase
      .from('notifications_log')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak_alert': return <Flame className="w-5 h-5 text-orange-500" />
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'news': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 w-full max-w-[320px] h-full bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-5 flex items-center justify-between border-bottom" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <h2 className="text-[17px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>Notificações</h2>
                <p className="text-[11px] font-medium text-gray-400">Fique por dentro do seu progresso</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 active:scale-90 transition-transform"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px] font-medium text-gray-400">Carregando...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-20">
                  <Bell className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                  <p className="text-[13px] font-bold text-gray-400">Tudo limpo por aqui!</p>
                  <p className="text-[11px] text-gray-300">Avisaremos quando algo novo surgir.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.read_at && markAsRead(n.id)}
                    className="relative p-4 rounded-2xl border transition-all active:scale-[0.98]"
                    style={{
                      background: n.read_at ? '#f9fafb' : '#fff',
                      borderColor: n.read_at ? 'transparent' : 'rgba(20,184,166,0.1)',
                      boxShadow: n.read_at ? 'none' : '0 4px 12px rgba(20,184,166,0.05)'
                    }}
                  >
                    {!n.read_at && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    )}
                    <div className="flex gap-4">
                      <div className="pt-1">{getIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className="text-[13px] font-black text-gray-900 leading-tight mb-1">{n.title}</p>
                        <p className="text-[12px] font-medium text-gray-500 leading-relaxed mb-2">{n.body}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-300">
                            {new Date(n.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-full bg-[#0a0f1e] text-white text-[13px] font-black tracking-wide active:scale-95 transition-all shadow-lg"
              >
                FECHAR
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
