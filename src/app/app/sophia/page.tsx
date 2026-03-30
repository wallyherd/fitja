import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, MessageSquare, Bot, Zap, Waves, Dumbbell, ArrowRight, Crown } from 'lucide-react'
import { PremiumLockOverlay, GlassCard } from '@/components/ui/design-system'

export default async function SophiaHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
  const isPremium = profile?.subscription_status === 'active'

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body pb-40">
       
       {/* SOPHIA CHARACTER INTRO */}
       <div className="flex flex-col items-center text-center mb-12 relative">
          <div className="absolute top-0 -translate-y-12 w-64 h-64 bg-sky-400 opacity-10 blur-[100px] rounded-full" />
          
          <div className="w-24 h-24 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-[0_12px_40px_-5px_rgba(56,189,248,0.5)] rotate-3">
             <Bot className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-sans font-black text-zinc-900 tracking-tighter mb-4 leading-none">SophIA</h1>
          <p className="text-zinc-500 font-medium px-4 leading-relaxed">Sua treinadora de elite, disponível 24h via WhatsApp e dentro do ecossistema FitJá.</p>
       </div>

        {/* O QUE ELA FAZ (VALOR PERCEBIDO) */}
        <div className="space-y-4 mb-12">
           <GlassCard className="p-5 flex gap-5 items-start">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center shrink-0"><MessageSquare className="w-6 h-6"/></div>
              <div>
                 <h3 className="font-bold text-zinc-900 mb-1">Coach Nutricional 24h</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed font-medium">Tire dúvidas sobre alimentos, peça substituições saudáveis e receba análise de calorias por foto no WhatsApp.</p>
              </div>
           </GlassCard>
           
           <GlassCard className="p-5 flex gap-5 items-start">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><Zap className="w-6 h-6"/></div>
              <div>
                 <h3 className="font-bold text-zinc-900 mb-1">Ajuste de Treinos e Intensidade</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed font-medium">Sentindo cansaço? A SophIA adapta sua rotina de hoje para garantir que você não pare, mas respeite seu corpo.</p>
              </div>
           </GlassCard>

           <GlassCard className="p-5 flex gap-5 items-start">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0"><Dumbbell className="w-6 h-6"/></div>
              <div>
                 <h3 className="font-bold text-zinc-900 mb-1">Rotinas de Sono e Descanso</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed font-medium">Sugestões baseadas em ciência para otimizar sua recuperação muscular e manter sua energia no pico durante o dia.</p>
              </div>
           </GlassCard>

           <GlassCard className="p-5 flex gap-5 items-start">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shrink-0"><Crown className="w-6 h-6"/></div>
              <div>
                 <h3 className="font-bold text-zinc-900 mb-1">Relatórios de Elite</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed font-medium">Análise comportamental: ela identifica padrões que estão travando seu progresso e sugere micro-hábitos de correção.</p>
              </div>
           </GlassCard>
        </div>


       {/* STATUS DO RECURSO E BOTÃO DE WHATSAPP */}
       <section className="relative">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Sua Conexão</h4>
             <span className={`text-[10px] font-black px-2 py-1 rounded-full ${isPremium ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {isPremium ? 'DISPONÍVEL' : 'PRO REQUIRED'}
             </span>
          </div>

          <div className={`p-8 rounded-[3rem] border-2 text-center transition-all ${isPremium ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-zinc-50 border-zinc-100 opacity-60'}`}>
             <Bot className={`w-12 h-12 mx-auto mb-4 ${isPremium ? 'text-sky-400' : 'text-zinc-300'}`} />
             <h3 className={`text-xl font-bold mb-2 ${isPremium ? 'text-white' : 'text-zinc-500'}`}>Conectar com SophIA</h3>
             <p className={`text-sm mb-8 ${isPremium ? 'text-zinc-400' : 'text-zinc-400'}`}>Inicie a conversa para ativar as notificações e IA nutricional.</p>
             
             {isPremium ? (
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(14,165,233,0.5)] transition-all active:scale-95">
                   Chamar no WhatsApp <ArrowRight className="w-5 h-5"/>
                </button>
             ) : (
                <Link href="/app/premium" className="w-full bg-zinc-800 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95">
                   Fazer Upgrade <Crown className="w-5 h-5 text-amber-500"/>
                </Link>
             )}
          </div>
          
          <p className="text-center mt-6 text-zinc-400 text-xs font-medium px-8 italic leading-relaxed">
             "Treine como um profissional, acompanhado pela melhor tecnologia de hábitos do país."
          </p>
       </section>
    </div>
  )
}
