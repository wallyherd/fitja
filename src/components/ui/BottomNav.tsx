'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Dumbbell, Droplets, User, Sparkles, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { icon: Crown,     label: 'Elite',   path: '/app/premium', isPremium: true },
  { icon: Home,      label: 'Início',  path: '/app/dashboard' },
  { icon: Utensils,  label: 'Comida',  path: '/app/food' },
  { icon: Droplets,  label: 'Água',    path: '/app/water' },
  { icon: Sparkles,  label: 'SophIA',  path: '/app/sophia', isCta: true },
  { icon: Dumbbell,  label: 'Treino',  path: '/app/workouts' },
  { icon: User,      label: 'Perfil',  path: '/app/profile' },
]


export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex justify-around items-center w-full max-w-md px-3 py-2.5"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderRadius: '999px',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.8) inset, 0 8px 32px -4px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.path)
          const Icon = item.icon

          if (item.isPremium) {
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center gap-1 px-2.5 py-1.5 flex-1 group"
              >
                <div
                  className={`p-2.5 rounded-[14px] transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-100 text-amber-600 shadow-sm'
                      : 'bg-amber-50/40 text-amber-500 group-hover:bg-amber-50'
                  }`}
                  style={{
                    boxShadow: isActive ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
                  }}
                >
                  <Icon className={`w-[19px] h-[19px] ${isActive ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
                </div>
                <span
                  className="text-[9px] font-black tracking-widest uppercase italic transition-colors duration-250 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent"
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          if (item.isCta) {
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center justify-center mx-1"
              >
                <motion.div
                  whileTap={{ scale: 0.93 }}
                  className="w-12 h-12 rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: isActive
                      ? 'linear-gradient(145deg, #14b8a6, #0d9488)'
                      : 'linear-gradient(145deg, #14b8a6, #0ea5e9)',
                    boxShadow: isActive
                      ? '0 4px 16px -2px rgba(20,184,166,0.5)'
                      : '0 4px 20px -4px rgba(20,184,166,0.45)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <span
                  className="text-[9px] font-bold mt-1 tracking-wide"
                  style={{ color: isActive ? '#0d9488' : '#9ca3af' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 flex-1 group outline-none"
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-dot"
                  className="absolute top-0 w-1 h-1 rounded-full"
                  style={{ background: '#14b8a6' }}
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}

              <div
                className={`p-2.5 rounded-[14px] transition-all duration-250 ${
                  isActive
                    ? 'bg-[rgba(20,184,166,0.1)] text-[#0d9488]'
                    : 'text-[#9ca3af] group-hover:text-[#6b7280] group-hover:bg-[rgba(0,0,0,0.03)]'
                }`}
              >
                <Icon className="w-[19px] h-[19px]" strokeWidth={isActive ? 2.2 : 1.8} />
              </div>

              <span
                className="text-[9px] font-bold tracking-wide transition-colors duration-250"
                style={{ color: isActive ? '#0d9488' : '#9ca3af' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
