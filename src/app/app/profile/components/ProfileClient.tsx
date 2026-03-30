'use client'

import React, { useState, useTransition } from 'react'
import { Button, Input, OverlayWrapper } from '@/components/ui/design-system'
import {
  User,
  ChevronRight,
  Crown,
  Phone,
  LogOut,
  Camera,
  Loader2,
  Trophy,
  Edit2,
  Activity,
  Settings,
} from 'lucide-react'
import { updateProfileAction } from '../actions'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  profile: any
}

export function ProfileClient({ profile }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isPremium = profile.subscription_status === 'active'
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }



  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      const fd = new FormData()
      fd.append('avatar_url', publicUrl)
      fd.append('full_name', profile.full_name || '')
      const res = await updateProfileAction(fd)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }

    } catch (err: any) {
      alert(err.message || 'Erro no upload')
    } finally {
      setUploading(false)
    }
  }

  const heightM = profile.height ? profile.height / 100 : 0
  const rawBmi = profile.weight && heightM > 0 ? profile.weight / (heightM * heightM) : null
  const bmi = rawBmi ? rawBmi.toFixed(1) : null

  const getBmiInfo = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do peso', color: '#0ea5e9', bg: '#eff8ff' }
    if (val < 25) return { label: 'Peso normal', color: '#16a34a', bg: '#f0fdf4' }
    if (val < 30) return { label: 'Sobrepeso', color: '#d97706', bg: '#fffbeb' }
    return { label: 'Obesidade', color: '#f43f5e', bg: '#fff1f2' }
  }
  const bmiInfo = rawBmi ? getBmiInfo(rawBmi) : null
  const firstName = profile?.full_name?.split(' ')[0] || 'Atleta'

  const menuItems = [
    { icon: Trophy, label: 'Minhas Conquistas', href: '/app/achievements', color: '#f59e0b', bg: '#fffbeb' },
    { icon: Settings, label: 'Configurações', href: '/app/settings', color: '#6b7280', bg: '#f8fafb' },
  ]

  return (
    <div className="pb-36 max-w-md mx-auto font-body" style={{ background: '#f8fafb', minHeight: '100vh' }}>

      {/* ─── PROFILE HERO ───────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d9488 0%, #14b8a6 55%, #0ea5e9 100%)',
          paddingBottom: '48px',
          paddingTop: '56px',
        }}
      >
        {/* Ambient */}
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div
          className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        />

        {/* Avatar */}
        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full overflow-hidden relative"
              style={{
                border: '3px solid rgba(255,255,255,0.5)',
                boxShadow: '0 8px 32px -4px rgba(0,0,0,0.25)',
              }}
            >
              {uploading ? (
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-20">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                <>
                  <label className="absolute inset-0 cursor-pointer z-10 flex items-center justify-center bg-[rgba(0,0,0,0.15)] active:bg-[rgba(0,0,0,0.4)] transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
                  <div className="absolute bottom-1 right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center z-20 pointer-events-none border-2 border-white shadow-md">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </>
              )}
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <User className="w-10 h-10 text-white/80" />
                </div>
              )}
            </div>

            {isPremium && (
              <div
                className="absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: '#f59e0b', border: '2.5px solid white', boxShadow: '0 2px 8px rgba(245,158,11,0.4)', zIndex: 1 }}
              >
                <Crown className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-[22px] font-sans font-black text-white tracking-tight mb-0.5">{firstName}</h1>
          <p className="text-[13px] font-medium text-white/70">{profile.email}</p>


          {isPremium && (
            <div
              className="mt-3 px-4 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5"
              style={{ background: 'rgba(245,158,11,0.3)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <Crown className="w-3 h-3" />
              Assinante PRO
            </div>
          )}
        </div>
      </div>

      {/* ─── CARD PULL-UP ───────────────────────────── */}
      <div
        className="relative z-10 px-4"
        style={{ marginTop: '-24px' }}
      >
        {/* BMI Card */}
        {bmi && bmiInfo && (
          <div
            className="rounded-[var(--radius-2xl)] p-5 mb-4"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 32px -4px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#9ca3af' }}>
                Índice de Massa Corporal
              </p>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: bmiInfo.bg, color: bmiInfo.color, border: `1px solid ${bmiInfo.color}28` }}
              >
                {bmiInfo.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-sans font-black tracking-tighter leading-none" style={{ color: '#111827' }}>
                {bmi}
              </span>
              <span className="text-[15px] font-bold" style={{ color: '#9ca3af' }}>kg/m²</span>
            </div>
            {/* Mini bar */}
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: `linear-gradient(90deg, #0ea5e9, ${bmiInfo.color})`,
                  width: `${Math.min(100, (parseFloat(bmi) / 40) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Altura', value: profile.height || '--', unit: 'cm' },
            { label: 'Peso', value: profile.weight || '--', unit: 'kg' },
            { label: 'WhatsApp', value: profile.whatsapp ? '✓ Vinc.' : '-- --', unit: '' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-xl)] p-3.5 text-center"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 6px -2px rgba(0,0,0,0.04)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>
                {stat.label}
              </p>
              <p className="font-sans font-black text-[18px] leading-none tracking-tight" style={{ color: '#111827' }}>
                {stat.value}
              </p>
              {stat.unit && <p className="text-[10px] font-medium mt-0.5" style={{ color: '#d1d5db' }}>{stat.unit}</p>}
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center justify-between p-4 rounded-[var(--radius-xl)] mb-4 active-press"
          style={{
            background: '#f0fdfb',
            border: '1px solid rgba(20,184,166,0.2)',
            boxShadow: '0 2px 8px -2px rgba(20,184,166,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.1)' }}>
              <Edit2 className="w-4.5 h-4.5" style={{ color: '#0d9488' }} />
            </div>
            <span className="text-[14px] font-bold" style={{ color: '#0d9488' }}>Editar Perfil</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: '#0d9488' }} />
        </button>

        {/* Menu items */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-[var(--radius-xl)] active-press"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 6px -2px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                </div>
                <span className="text-[14px] font-bold" style={{ color: '#374151' }}>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#d1d5db' }} />
            </Link>
          ))}
        </div>

        {/* Premium upsell */}
        {!isPremium && (
          <Link
            href="/app/premium"
            className="w-full flex items-center gap-4 p-4 rounded-[var(--radius-xl)] mb-5 active-press"
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
              border: '1px solid rgba(245,158,11,0.25)',
              boxShadow: '0 4px 16px -4px rgba(245,158,11,0.2)',
            }}
          >
            <div
              className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold" style={{ color: '#92400e' }}>Upgrade para PRO</p>
              <p className="text-[12px] font-medium" style={{ color: '#b45309' }}>Detrave a SophIA e muito mais</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: '#d97706' }} />
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-[var(--radius-xl)] active-press"
          style={{ background: '#fff1f2', border: '1px solid rgba(244,63,94,0.12)' }}
        >
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: '#ffe4e6' }}>
            <LogOut className="w-4.5 h-4.5" style={{ color: '#f43f5e' }} />
          </div>
          <span className="text-[14px] font-bold" style={{ color: '#f43f5e' }}>Sair da Conta</span>
        </button>

      </div>

      {/* ─── EDIT MODAL ─────────────────────────────── */}
      <OverlayWrapper isOpen={isEditing} onClose={() => setIsEditing(false)} title="Editar Perfil">
        <p className="text-[13px] font-medium mb-5" style={{ color: '#9ca3af' }}>
          Mantenha seus dados atualizados para cálculos precisos.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            startTransition(async () => {
              const res = await updateProfileAction(fd)
              if (res?.error) {
                alert(res.error)
              } else {
                setIsEditing(false)
              }
            })
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Nome Completo</label>
            <Input name="full_name" defaultValue={profile.full_name} placeholder="Seu nome" />
          </div>
          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>WhatsApp</label>
            <Input name="whatsapp" defaultValue={profile.whatsapp} placeholder="11999999999" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Altura (cm)</label>
              <Input name="height" type="number" defaultValue={profile.height} placeholder="175" />
            </div>
            <div>
              <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Peso (kg)</label>
              <Input name="weight" type="number" step="0.1" defaultValue={profile.weight} placeholder="70.5" />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Gênero</label>
            <select
              name="gender"
              defaultValue={profile.gender}
              className="w-full rounded-[var(--radius-lg)] px-4 py-3.5 text-[14px] font-medium focus:outline-none transition-all"
              style={{
                background: '#f8fafb',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#374151',
              }}
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-bold block mb-1.5" style={{ color: '#6b7280' }}>Nível de Atividade</label>
            <select
              name="activity_level"
              defaultValue={profile.activity_level}
              className="w-full rounded-[var(--radius-lg)] px-4 py-3.5 text-[14px] font-medium focus:outline-none transition-all"
              style={{
                background: '#f8fafb',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#374151',
              }}
            >
              <option value="Sedentário">Sedentário (Escritório)</option>
              <option value="Leve">Leve (1-2x semana)</option>
              <option value="Moderado">Moderado (3-5x semana)</option>
              <option value="Intenso">Intenso (Atleta)</option>
            </select>
          </div>
          <div className="flex gap-3 pt-3">
            <Button variant="ghost" type="button" size="md" onClick={() => setIsEditing(false)} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="md" className="flex-[2]" isLoading={isPending}>
              Salvar Tudo
            </Button>
          </div>
        </form>

      </OverlayWrapper>
    </div>
  )
}
