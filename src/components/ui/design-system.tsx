"use client"

import React, { forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Sparkles, AlertCircle, CheckCircle, Info, Flame, Trophy, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

// ─────────────────────────────────────────────────────
// FITJÁ DESIGN SYSTEM v2.0
// Premium Mobile-First Components
// ─────────────────────────────────────────────────────

// ── SECTION HEADER ─────────────────────────────────
export function SectionHeader({
  title,
  action,
  actionHref,
}: {
  title: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[17px] font-sans font-black text-[#111827] tracking-tight">{title}</h2>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="text-[12px] font-bold text-[#0d9488] bg-[#f0fdfb] border border-[rgba(20,184,166,0.15)] px-3.5 py-1.5 rounded-full active-press"
        >
          {action}
        </Link>
      )}
    </div>
  )
}

// ── GLASS CARD ──────────────────────────────────────
export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-[var(--radius-2xl)] p-6 ${className}`}>
      {children}
    </div>
  )
}

// ── BASE CARD ───────────────────────────────────────
export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const isInteractive = !!onClick
  return (
    <div
      className={`${isInteractive ? "card-interactive cursor-pointer active-press" : "card"} rounded-[var(--radius-xl)] p-5 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ── BUTTONS ─────────────────────────────────────────
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "brand-outline"
  isLoading?: boolean
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", isLoading, size = "md", children, ...props }, ref) => {
    const sizes = {
      sm: "px-5 py-3 text-[14px]",
      md: "px-7 py-4 text-[15px]",
      lg: "px-8 py-5 text-[16px]",
    }

    const variants = {
      primary:
        "bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white font-bold rounded-[var(--radius-pill)] shadow-[var(--shadow-brand)] hover:shadow-[var(--shadow-brand-lg)] hover:-translate-y-[1px] focus:ring-4 focus:ring-[rgba(20,184,166,0.15)] transition-all duration-200 active:scale-[0.98]",
      secondary:
        "bg-white text-[#111827] font-bold rounded-[var(--radius-pill)] border border-[rgba(0,0,0,0.08)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] hover:border-[rgba(0,0,0,0.12)] hover:-translate-y-[1px] focus:ring-4 focus:ring-[rgba(0,0,0,0.05)] transition-all duration-200 active:scale-[0.98]",
      danger:
        "bg-[#fff1f2] text-[#f43f5e] font-bold rounded-[var(--radius-pill)] border border-[rgba(244,63,94,0.15)] hover:bg-[#ffe4e6] focus:ring-4 focus:ring-[rgba(244,63,94,0.1)] transition-all duration-200 active:scale-[0.98]",
      ghost:
        "text-[#6b7280] font-bold hover:text-[#111827] hover:bg-[rgba(0,0,0,0.04)] rounded-[var(--radius-pill)] transition-all duration-200 active:scale-[0.98]",
      "brand-outline":
        "bg-[#f0fdfb] text-[#0d9488] font-bold rounded-[var(--radius-pill)] border border-[rgba(20,184,166,0.25)] hover:bg-[#ccfbf5] focus:ring-4 focus:ring-[rgba(20,184,166,0.12)] transition-all duration-200 active:scale-[0.98]",
    }

    return (
      <button
        ref={ref}
        className={`relative inline-flex items-center justify-center gap-2 leading-none disabled:opacity-50 disabled:cursor-not-allowed outline-none ${sizes[size]} ${variants[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-[2px] border-current/30 border-t-current rounded-full animate-spin-smooth" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// ── INPUT ────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-[#f8fafb] border border-[rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] px-5 py-[14px] text-[#111827] text-[15px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:shadow-[var(--ring-brand)] transition-all duration-200 ${className}`}
        style={{ boxSizing: "border-box" }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// ── BADGE ────────────────────────────────────────────
export function Badge({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "ghost" | "premium"
}) {
  const colors = {
    success: "bg-[#f0fdf4] text-[#16a34a] border-[rgba(22,163,74,0.2)]",
    warning: "bg-[#fffbeb] text-[#92400e] border-[rgba(245,158,11,0.2)]",
    error: "bg-[#fff1f2] text-[#be123c] border-[rgba(244,63,94,0.2)]",
    info: "bg-[#eff8ff] text-[#0369a1] border-[rgba(14,165,233,0.2)]",
    ghost: "bg-[#f8fafb] text-[#6b7280] border-[rgba(0,0,0,0.08)]",
    premium: "bg-[#fefce8] text-[#92400e] border-[rgba(245,158,11,0.25)]",
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wide rounded-full border ${colors[variant]}`}
    >
      {children}
    </span>
  )
}

// ── STREAK BADGE ─────────────────────────────────────
export function StreakBadge({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
        border: "1.5px solid rgba(249,115,22,0.25)",
        boxShadow: "0 2px 12px -2px rgba(249,115,22,0.2)",
      }}
    >
      <Flame className="w-4 h-4 text-orange-500 fill-orange-400" style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.5))" }} />
      <span className="font-sans font-black text-[13px] text-orange-700 tracking-tight">{count}</span>
      <span className="text-[11px] font-bold text-orange-500">dias</span>
    </motion.div>
  )
}

// ── ACHIEVEMENT BADGE ─────────────────────────────────
export function AchievementBadge({ title, isLocked = true }: { title: string; isLocked?: boolean }) {
  return (
    <div
      className={`p-4 rounded-[var(--radius-xl)] flex flex-col items-center gap-2.5 transition-all duration-300 ${
        isLocked
          ? "bg-[#f8fafb] border border-[rgba(0,0,0,0.06)] opacity-45 grayscale"
          : "card-raised hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${
          isLocked
            ? "bg-[#e5e7eb]"
            : "bg-gradient-to-br from-[#f0fdfb] to-[#ccfbf5] border border-[rgba(20,184,166,0.2)]"
        }`}
      >
        <Trophy className={`w-6 h-6 ${isLocked ? "text-[#d1d5db]" : "text-[#0d9488]"}`} />
      </div>
      <p className="text-[11px] font-bold text-center text-[#374151] leading-snug">{title}</p>
      {!isLocked && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
          <span className="text-[10px] font-bold text-[#92400e]">Conquista</span>
        </div>
      )}
    </div>
  )
}

// ── PROGRESS RING ─────────────────────────────────────
export function ProgressRing({
  percentage,
  size = 120,
  color = "#14b8a6",
  trackColor = "rgba(0,0,0,0.06)",
  strokeWidth = 11,
  label,
  showPercent = true,
}: {
  percentage: number
  size?: number
  color?: string
  trackColor?: string
  strokeWidth?: number
  label?: string
  showPercent?: boolean
}) {
  const center = size / 2
  const radius = center - strokeWidth - 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - ((percentage > 100 ? 100 : percentage) / 100) * circumference

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track */}
        <circle stroke={trackColor} strokeWidth={strokeWidth} fill="transparent" r={radius} cx={center} cy={center} />
        {/* Fill */}
        <motion.circle
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, type: "spring", bounce: 0.1 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {showPercent && (
          <span className="font-sans font-black tracking-tighter text-white" style={{ fontSize: size * 0.17 }}>
            {percentage}
            <span style={{ fontSize: size * 0.09 }}>%</span>
          </span>
        )}
        {label && (
          <span className="text-white/60 font-bold uppercase tracking-widest" style={{ fontSize: size * 0.065 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ── MINI PROGRESS BAR ─────────────────────────────────
export function ProgressBar({
  value,
  max,
  color = "#14b8a6",
  className = "",
}: {
  value: number
  max: number
  color?: string
  className?: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={`h-2 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.1 }}
      />
    </div>
  )
}

// ── PREMIUM LOCK OVERLAY ─────────────────────────────
export function PremiumLockOverlay({ children, isUnlocked = false }: { children: React.ReactNode, isUnlocked?: boolean }) {
  if (isUnlocked) return <>{children}</>

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-2xl)]">
      <div className="opacity-40 pointer-events-none select-none blur-[1.5px]">{children}</div>
      <Link
        href="/app/premium"
        className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 premium-lock-overlay"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-14 h-14 bg-white rounded-[16px] shadow-[var(--shadow-md)] flex items-center justify-center mb-4 border border-[rgba(0,0,0,0.06)]"
        >
          <Lock className="w-6 h-6 text-[#0d9488]" />
        </motion.div>
        <h3 className="text-[20px] font-sans font-black text-[#111827] text-center mb-1.5 tracking-tight">Exclusivo Premium</h3>
        <p className="text-[13px] text-[#6b7280] text-center mb-5 leading-relaxed max-w-[210px]">
          Relatórios avançados e coaching com IA em tempo real.
        </p>
        <div
          className="text-white font-bold rounded-full px-6 py-3 text-[13px] tracking-wide"
          style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", boxShadow: "var(--shadow-brand)" }}
        >
          Ver Planos PRO →
        </div>
      </Link>
    </div>
  )
}

// ── SOPHIA BLOCK ──────────────────────────────────────
export function SophiaBlock({ message }: { message: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-xl)] p-5"
      style={{
        background: "linear-gradient(145deg, #f0fdfb 0%, #eff8ff 100%)",
        border: "1px solid rgba(20,184,166,0.15)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      {/* Decorative ambient */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: "rgba(14,165,233,0.08)", filter: "blur(24px)" }}
      />
      <div className="flex items-start gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
            boxShadow: "0 4px 12px -2px rgba(14,165,233,0.3)",
          }}
        >
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-[#0d9488] uppercase tracking-[0.12em] mb-1">SophIA Coach</p>
          <p className="text-[#374151] text-[13.5px] leading-relaxed font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────
export function EmptyState({
  title,
  description,
  icon: Icon = Info,
  action,
  actionLabel,
}: {
  title: string
  description: string
  icon?: React.ElementType
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6 animate-scale-in">
      <div
        className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5"
        style={{ background: "#f8fafb", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "var(--shadow-xs)" }}
      >
        <Icon className="w-7 h-7 text-[#d1d5db]" />
      </div>
      <h3 className="font-sans font-black text-[17px] text-[#111827] mb-2 tracking-tight">{title}</h3>
      <p className="text-[#9ca3af] text-[13px] max-w-[180px] leading-relaxed mb-5">{description}</p>
      {action && actionLabel && (
        <Button variant="brand-outline" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// ── ERROR STATE ───────────────────────────────────────
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] flex items-start gap-4 animate-slide-up"
      style={{ background: "#fff1f2", border: "1px solid rgba(244,63,94,0.15)" }}
    >
      <div className="w-9 h-9 bg-[#ffe4e6] rounded-[10px] flex items-center justify-center shrink-0">
        <AlertCircle className="w-5 h-5 text-[#f43f5e]" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-[#be123c] mb-1 text-[13px]">Algo deu errado</h4>
        <p className="text-[#f43f5e] text-[13px] leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-[12px] font-bold text-[#be123c] bg-white border border-[rgba(244,63,94,0.15)] px-4 py-2 rounded-full"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}

// ── SUCCESS FEEDBACK ──────────────────────────────────
export function SuccessState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-[var(--radius-xl)] flex items-center gap-4"
      style={{ background: "#f0fdfb", border: "1px solid rgba(20,184,166,0.2)" }}
    >
      <div className="w-9 h-9 bg-[#ccfbf5] rounded-[10px] flex items-center justify-center shrink-0">
        <CheckCircle className="w-5 h-5 text-[#0d9488]" />
      </div>
      <p className="text-[#0f766e] text-[13.5px] font-semibold leading-relaxed">{message}</p>
    </motion.div>
  )
}

// ── MODAL / OVERLAY ───────────────────────────────────
export function OverlayWrapper({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(10,15,30,0.5)", backdropFilter: "blur(12px)" }}
          />
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[100] pointer-events-none">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.4 }}
              className="w-full max-w-lg bg-white rounded-t-[var(--radius-3xl)] sm:rounded-[var(--radius-2xl)] pointer-events-auto max-h-[92dvh] overflow-y-auto"
              style={{ boxShadow: "0 -16px 80px -8px rgba(0,0,0,0.18), 0 -4px 20px rgba(0,0,0,0.06)" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-[3px] bg-[#e5e7eb] rounded-full" />
              </div>
              {title && (
                <div className="px-6 pt-3 pb-2 border-b border-[rgba(0,0,0,0.06)]">
                  <h3 className="font-sans font-black text-[18px] text-[#111827] tracking-tight">{title}</h3>
                </div>
              )}
              <div className="px-6 py-5 pb-10">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── STAT CARD ──────────────────────────────────────────
export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  color = "#14b8a6",
  trend,
}: {
  label: string
  value: string | number
  unit?: string
  icon?: React.ElementType
  color?: string
  trend?: "up" | "down" | "flat"
}) {
  return (
    <div className="card rounded-[var(--radius-xl)] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {Icon && (
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: `${color}18` }}
          >
            <Icon style={{ color }} className="w-4 h-4" />
          </div>
        )}
        {trend && (
          <TrendingUp
            className={`w-4 h-4 ${trend === "up" ? "text-[#16a34a]" : trend === "down" ? "text-[#f43f5e] rotate-180" : "text-[#9ca3af]"}`}
          />
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide mb-0.5">{label}</p>
        <p className="font-sans font-black text-[22px] text-[#111827] tracking-tight leading-none">
          {value}
          {unit && <span className="text-[14px] text-[#6b7280] ml-1 font-bold">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

// ── LOADING SPINNER ───────────────────────────────────
export function LoadingSpinner({ size = 24, color = "#14b8a6" }: { size?: number; color?: string }) {
  return (
    <div
      className="rounded-full border-[2.5px] animate-spin-smooth"
      style={{
        width: size,
        height: size,
        borderColor: `${color}30`,
        borderTopColor: color,
      }}
    />
  )
}

// ── SKELETON ──────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-[10px] ${className}`} />
}
