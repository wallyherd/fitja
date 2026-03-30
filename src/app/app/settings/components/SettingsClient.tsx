'use client'

import React, { useState } from 'react'
import { GlassCard, Button, Input, OverlayWrapper } from '@/components/ui/design-system'
import { Bell, Lock, Shield, LogOut, ChevronRight, UserCircle, Target, Clock, ShieldCheck } from 'lucide-react'
import { logoutAction, updatePasswordAction } from '../actions'
import { updateGoalsAction } from '../../profile/actions'

type Props = {
  profile: any
}

export function SettingsClient({ profile }: Props) {
  const [modalPassword, setModalPassword] = useState(false)
  const [modalGoals, setModalGoals] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  return (
    <div className="pb-32 space-y-8">
       {/* NOTIFICAÇÕES (MOCK) */}
       <section>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-3">Preferências</h3>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-3xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500"><Bell className="w-5 h-5"/></div>
                   <span className="font-bold text-zinc-700">Notificações Push</span>
                </div>
                <div className="w-12 h-6 bg-brand-500 rounded-full flex items-center p-1 justify-end"><div className="w-4 h-4 bg-white rounded-full shadow-sm" /></div>
             </div>
             <div className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-3xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500"><Clock className="w-5 h-5"/></div>
                   <span className="font-bold text-zinc-700">Lembretes de Hidratação</span>
                </div>
                <div className="w-12 h-6 bg-zinc-200 rounded-full flex items-center p-1"><div className="w-4 h-4 bg-white rounded-full shadow-sm" /></div>
             </div>
          </div>
       </section>

       {/* METAS & ROTINA */}
       <section>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-3">Metas & Rotina</h3>
          <div className="space-y-2">
             <button onClick={() => setModalGoals(true)} className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-3xl hover:bg-zinc-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 transition-colors"><Target className="w-5 h-5"/></div>
                   <span className="font-bold text-zinc-700">Ajustar Metas Diárias</span>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 transition-all" />
             </button>
          </div>
       </section>

       {/* SEGURANÇA & PRIVACIDADE */}
       <section>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-3">Privacidade & Segurança</h3>
          <div className="space-y-2">
             <button onClick={() => setModalPassword(true)} className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-3xl hover:bg-zinc-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 transition-colors"><Lock className="w-5 h-5"/></div>
                   <span className="font-bold text-zinc-700">Alterar Senha</span>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 transition-all" />
             </button>
             <div className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-3xl opacity-60">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300"><ShieldCheck className="w-5 h-5"/></div>
                   <span className="font-bold text-zinc-700">Privacidade de Dados</span>
                </div>
                <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full font-black">EDITAR</span>
             </div>
          </div>
       </section>

       {/* LOGOUT */}
       <div className="pt-6">
          <Button variant="danger" onClick={() => logoutAction()} className="w-full py-5 rounded-[2rem] gap-3">
             <LogOut className="w-5 h-5" /> Sair do Aplicativo
          </Button>
          <p className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-6">FitJá v1.0.4 ─ Orgulhosamente Saudável</p>
       </div>

       {/* MODAL ALTERAR SENHA */}
       <OverlayWrapper isOpen={modalPassword} onClose={() => setModalPassword(false)}>
           <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Sua Senha</h2>
           <p className="text-zinc-500 text-sm mb-6 font-medium">Digite sua nova senha abaixo.</p>
           <form action={async (fd) => {
               setIsUpdating(true)
               await updatePasswordAction(fd)
               setIsUpdating(false)
               setModalPassword(false)
           }} className="space-y-4">
              <Input name="password" type="password" placeholder="Nova senha" required minLength={6} />
              <div className="flex gap-2">
                <Button variant="ghost" type="button" onClick={() => setModalPassword(false)} className="w-1/3">Cancelar</Button>
                <Button variant="primary" type="submit" className="w-2/3 shadow-sm" isLoading={isUpdating}>Atualizar Senha</Button>
              </div>
           </form>
       </OverlayWrapper>

       {/* MODAL EDITAR METAS & ROTINA */}
       <OverlayWrapper isOpen={modalGoals} onClose={() => setModalGoals(false)}>
           <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Ajustar Metas</h2>
           <form action={async (fd) => {
               await updateGoalsAction(fd)
               setModalGoals(false)
           }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1 block">Meta de Água (ml)</label>
                <Input name="daily_water_goal_ml" type="number" step="100" defaultValue={profile.daily_water_goal_ml} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1 block">Frequência de Treino</label>
                <select name="workout_frequency" defaultValue={profile.workout_frequency} className="w-full bg-zinc-50 border-0 rounded-2xl p-4 text-zinc-900 font-bold outline-none focus:ring-4 ring-brand-200">
                   <option value="Sedentário">Raramente (1-2x)</option>
                   <option value="Ativo">Moderado (3-4x)</option>
                   <option value="Atleta">Frequente (5-6x)</option>
                   <option value="Insano">Diário (7x)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="ghost" type="button" onClick={() => setModalGoals(false)} className="w-1/3">Voltar</Button>
                <Button variant="primary" type="submit" className="w-2/3 shadow-sm">Confirmar Mudanças</Button>
              </div>
           </form>
       </OverlayWrapper>
    </div>
  )
}
