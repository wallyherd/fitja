'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, TrendingUp, DollarSign, ShieldAlert, Search, Settings, 
  Pause, Play, ShieldEllipsis, Crown, KeyRound, Calendar, Plus, 
  SendHorizonal, BarChart3, PieChart, Users2, ChevronRight, X, User,
  Trophy, Flame, Clock, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { SectionHeader } from '@/components/ui/design-system'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== '5b5453fa-2add-47e6-b5db-8326f24028ee') {
      window.location.href = '/app/dashboard'
      return
    }

    // 1. Fetch Stats
    const { data: st } = await supabase.from('vw_admin_performance').select('*').single()
    setStats(st)

    // 2. Fetch Users
    const { data: us } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (us) setUsers(us)
    setLoading(false)
  }

  // ─── ADMIN ACTIONS ─────────────────────────────────

  async function toggleSuspension(user: any) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_suspended: !user.is_suspended })
      .eq('id', user.id)
    
    if (!error) fetchData()
  }

  async function grantPremium(user: any, days: number) {
    const until = new Date()
    until.setDate(until.getDate() + days)
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'active',
        premium_until: until.toISOString(),
        tier: 'premium'
      })
      .eq('id', user.id)
    
    if (!error) {
      alert(`Premium de ${days} dias concedido com sucesso!`)
      fetchData()
    }
  }

  async function sendGlobalNotif(title: string, body: string) {
    const { data, error } = await supabase.rpc('send_global_news', { p_title: title, p_body: body })
    if (!error) alert('Notificação enviada com sucesso!')
  }

  // ─── COMPONENTS ────────────────────────────────────

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-black uppercase tracking-widest transition-all ${
        activeTab === id ? 'bg-teal-500 text-[#0a0f1e] shadow-lg shadow-teal-500/20' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )

  const StatCard = ({ label, value, color, icon: Icon }: any) => (
    <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mb-4`} style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-[26px] font-sans font-black tracking-tight" style={{ color: '#0a0f1e' }}>{value || 0}</p>
    </div>
  )

  return (
    <div className="min-h-screen pb-32" style={{ background: '#f8fafb' }}>
      
      {/* Header Admin */}
      <header className="px-6 py-8 bg-white border-b border-black/5" style={{ background: 'linear-gradient(135deg, #0a0f1e, #111827)' }}>
        <div className="flex items-center gap-4 mb-2">
           <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
             <ShieldEllipsis size={24} className="text-[#0a0f1e]" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Sistema FitJá Master</p>
             <h1 className="text-[22px] font-sans font-black text-white tracking-tight">Painel do Administrador</h1>
           </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-5 bg-white border-b border-black/5">
        <TabButton id="overview" label="Visão Geral" icon={TrendingUp} />
        <TabButton id="users" label="Usuários" icon={Users} />
        <TabButton id="challenges" label="Desafios" icon={Trophy} />
        <TabButton id="finance" label="Financeiro" icon={DollarSign} />
        <TabButton id="marketing" label="Marketing" icon={SendHorizonal} />
      </div>

      <main className="px-6 pt-6">
        {/* ─── TAB: OVERVIEW ───────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <StatCard label="Total de Alunos" value={stats?.total_users} color="#0ea5e9" icon={Users2} />
               <StatCard label="Assinantes Pro" value={stats?.active_subscribers} color="#14b8a6" icon={Crown} />
               <StatCard label="Ativos Hoje" value={stats?.active_today} color="#f59e0b" icon={TrendingUp} />
               <StatCard label="Conversão" value={`${Math.round((stats?.active_subscribers / stats?.total_users) * 100)}%`} color="#6366f1" icon={PieChart} />
            </div>

            {/* Quick Chart (Demográfico Simulator) */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm">
                <SectionHeader title="Faixa Etária" />
                <div className="space-y-4 mt-2">
                   {[
                     { l: '18-24 anos', p: 35, c: '#14b8a6' },
                     { l: '25-34 anos', p: 48, c: '#0ea5e9' },
                     { l: '35-44 anos', p: 12, c: '#6366f1' },
                     { l: '45+ anos', p: 5, c: '#94a3b8' }
                   ].map(item => (
                     <div key={item.l}>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                           <span>{item.l}</span>
                           <span>{item.p}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${item.p}%` }} className="h-full" style={{ background: item.c }} />
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          </motion.div>
        )}

        {/* ─── TAB: USERS ──────────────────────────── */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <div className="relative mb-6">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome ou email..." 
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-black/5 focus:ring-2 focus:ring-teal-500/20 text-[14px] font-medium transition-all"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>

             <div className="space-y-3">
                {users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase())).map(u => (
                  <div key={u.id} className="p-4 rounded-3xl bg-white border border-black/5 flex items-center justify-between group shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 border border-black/5 shrink-0">
                           {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <User className="text-gray-200 mt-3 mx-auto" />}
                        </div>
                        <div>
                           <p className="text-[14px] font-black text-gray-900 leading-tight">{u.full_name || 'Usuário Anon'}</p>
                           <div className="flex items-center gap-2 mt-1">
                              {u.subscription_status === 'active' ? (
                                <span className="text-[9px] font-black uppercase bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">Pro</span>
                              ) : (
                                <span className="text-[9px] font-black uppercase bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">Free</span>
                              )}
                              {u.is_suspended && <span className="text-[9px] font-black uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Suspenso</span>}
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setEditUser(u)} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-black/5 text-gray-400 active:scale-90 transition-all">
                        <ChevronRight size={18} />
                     </button>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* ─── TAB: CHALLENGES ────────────────────────── */}
        {activeTab === 'challenges' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
             <div className="flex gap-4">
                <button className="flex-1 p-5 rounded-3xl bg-white border border-black/5 shadow-sm text-left active-press">
                   <Flame className="text-orange-500 mb-2" size={24} />
                   <h4 className="text-[14px] font-black text-zinc-900 leading-none mb-1">Seca Tudo 21D</h4>
                   <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">142 Participantes</p>
                </button>
                <button className="p-5 rounded-3xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                   <Plus size={24} />
                </button>
             </div>

             <SectionHeader title="Auditoria de Atividades" action="Ver Tudo" />
             <div className="space-y-3">
                {[
                  { user: 'Marcos P.', type: 'Foto', task: 'Treino de Costas', time: '12m atrás', points: 50, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
                  { user: 'Julia F.', type: 'Refeição', task: 'Almoço Low Carb', time: '28m atrás', points: 20 },
                ].map((act, i) => (
                  <div key={i} className="p-4 rounded-[2rem] bg-white border border-black/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        {act.img ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                             <img src={act.img} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                             <CheckCircle2 size={24} />
                          </div>
                        )}
                        <div>
                           <p className="text-[13px] font-black text-zinc-900 leading-none mb-1">{act.user} <span className="text-[10px] font-bold text-gray-300 uppercase ml-1">#{act.type}</span></p>
                           <p className="text-[11px] font-medium text-gray-400">{act.task} • {act.time}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-teal-600 mr-2">+{act.points}</span>
                        <button className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center active:scale-90"><X size={14} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* ─── TAB: FINANCE ──────────────────────────── */}
        {activeTab === 'finance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="grid grid-cols-1 gap-4">
                <div className="p-8 rounded-[38px] bg-[#0a0f1e] text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-50" />
                   <DollarSign className="text-teal-400 mb-6" size={32} />
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Receita Mensal Estimada</p>
                   <h2 className="text-[44px] font-sans font-black tracking-tighter leading-none mb-4">R$ 14.280,00</h2>
                   <div className="flex gap-4">
                      <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                         <span className="text-[10px] font-black uppercase">+12% vs last month</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-7 rounded-[3rem] border border-black/5 shadow-sm">
                <SectionHeader title="Desempenho de Vendas" />
                <div className="grid grid-cols-2 gap-6 mt-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Planos Mensais</p>
                      <p className="text-[20px] font-black text-[#0a0f1e]">842 <span className="text-[12px] text-gray-300">vendas</span></p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Planos Anuais</p>
                      <p className="text-[20px] font-black text-[#0a0f1e]">124 <span className="text-[12px] text-gray-300">vendas</span></p>
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><AlertTriangle size={20} /></div>
                      <div>
                         <p className="text-[12px] font-black text-[#0a0f1e] leading-none mb-1">Chargebacks</p>
                         <p className="text-[10px] font-bold text-gray-400">2 solicitações pendentes</p>
                      </div>
                   </div>
                   <button className="text-[11px] font-black uppercase text-teal-600 tracking-widest">Ver Todos</button>
                </div>
             </div>
          </motion.div>
        )}

        {/* ─── TAB: MARKETING / NOTIF ──────────────── */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
             <div className="bg-white p-8 rounded-[42px] border border-black/5 shadow-xl shadow-black/5 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
                <SendHorizonal size={40} className="text-teal-500 mb-6" />
                <h3 className="text-[20px] font-sans font-black tracking-tight mb-2">Enviar Notificação Global</h3>
                <p className="text-gray-400 text-[13px] font-medium mb-6">Mande uma mensagem instantânea para toda a sua base de alunos.</p>
                
                <div className="space-y-4">
                   <input type="text" id="notif-title" placeholder="Título chamativo..." className="w-full p-4 rounded-2xl bg-[#f8fafb] border-none text-[14px] font-bold" />
                   <textarea id="notif-body" placeholder="Corpo da mensagem (desconto, novo treino, brinde)..." className="w-full p-4 rounded-2xl bg-[#f8fafb] border-none text-[14px] font-medium h-32" />
                   <button 
                     onClick={() => {
                        const t = (document.getElementById('notif-title') as HTMLInputElement).value
                        const b = (document.getElementById('notif-body') as HTMLTextAreaElement).value
                        if(t && b) sendGlobalNotif(t, b)
                     }}
                     className="w-full py-4 rounded-2xl bg-[#0a0f1e] text-white text-[14px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                   >
                     LANÇAR AGORA 🚀
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* ─── USER EDIT MODAL ─────────────────────── */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setEditUser(null)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
               className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl"
            >
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-gray-100 shadow-inner">
                     {editUser.avatar_url ? <img src={editUser.avatar_url} className="w-full h-full object-cover" /> : <User className="text-gray-300 mt-5 mx-auto" size={32} />}
                  </div>
                  <div>
                    <h3 className="text-[22px] font-sans font-black tracking-tight leading-none mb-1">{editUser.full_name}</h3>
                    <p className="text-[12px] font-medium text-gray-400 truncate w-40">{editUser.id}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => grantPremium(editUser, 30)}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-teal-50 border border-teal-100 text-teal-700 active:scale-95 transition-all"
                  >
                     <Crown size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Premium 30D</span>
                  </button>
                  <button 
                    onClick={() => grantPremium(editUser, 90)}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700 active:scale-95 transition-all"
                  >
                     <Crown size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Premium 90D</span>
                  </button>
                  <button 
                    onClick={() => toggleSuspension(editUser)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-3xl transition-all ${editUser.is_suspended ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-400 border border-black/5'}`}
                  >
                     {editUser.is_suspended ? <Play size={24} /> : <Pause size={24} />}
                     <span className="text-[10px] font-black uppercase tracking-widest">
                       {editUser.is_suspended ? 'Ativar Conta' : 'Suspender Aluno'}
                     </span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-gray-50 text-gray-300 border border-black/5 cursor-not-allowed">
                     <KeyRound size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Trocar Senha (API)</span>
                  </button>
               </div>

               <button 
                 onClick={() => setEditUser(null)}
                 className="w-full py-4 rounded-2xl bg-gray-900 text-white text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all"
               >
                 Fechar Detalhes
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
