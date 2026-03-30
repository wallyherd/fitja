import Link from "next/link"
import { Button, Input, ErrorState } from "@/components/ui/design-system"
import { signupUser } from "./actions"
import { Sparkles, User, Mail, Lock, Phone, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, ref?: string }>
}) {
  const params = await searchParams
  const referralCode = params.ref || ""

  return (
    <div className="min-h-screen font-body flex flex-col relative overflow-hidden" style={{ background: '#0a0f1e' }}>

      {/* ── Background Hero ── */}
      <div className="absolute inset-x-0 top-0 h-[40dvh] z-0 overflow-hidden">
        <img 
          src="/premium_fitness_background_1774686737441.png" 
          alt="Premium Fitness" 
          className="w-full h-full object-cover opacity-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent" />
      </div>

      {/* ── Floating Benefits ── */}
      <header className="relative z-10 pt-16 pb-6 px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 transform -rotate-1 shadow-2xl">
           <Sparkles className="w-4 h-4 text-emerald-400" />
           <span className="text-[11px] font-black text-white uppercase tracking-widest">+12k Atletas Ativos</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-5 pb-16 pt-2">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-[34px] font-sans font-black tracking-tight text-white mb-2 leading-[1.1]">
              O Futuro do Seu<br />
              <span className="text-brand-400">Próprio Corpo</span>
            </h1>
            <p className="text-[15px] font-medium text-zinc-400 max-w-[280px] sm:max-w-none">
              SophIA está pronta para guiar cada passo da sua transformação.
            </p>
          </div>

          {/* Card */}
          <div
            className="w-full rounded-[36px] p-8 sm:p-10 mb-8"
            style={{
              background: '#ffffff',
              boxShadow: '0 24px 64px -12px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <form action={signupUser} className="space-y-5">
              {params?.error && <ErrorState message={params.error} />}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-zinc-400 uppercase tracking-wider ml-1">Quem é você?</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                  <input id="name" name="name" type="text" placeholder="Seu nome" required className="w-full bg-zinc-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[18px] pl-11 pr-4 py-4 text-[15px] font-bold text-zinc-800 transition-all outline-none placeholder:text-zinc-300" />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-zinc-400 uppercase tracking-wider ml-1">WhatsApp da SophIA</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                  <input id="whatsapp" name="whatsapp" type="tel" placeholder="(11) 99999-9999" required className="w-full bg-zinc-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[18px] pl-11 pr-4 py-4 text-[15px] font-bold text-zinc-800 transition-all outline-none placeholder:text-zinc-300" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-black text-zinc-400 uppercase tracking-wider ml-1">Login</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                  <input id="email" name="email" type="email" placeholder="voce@email.com" required className="w-full bg-zinc-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[18px] pl-11 pr-4 py-4 text-[15px] font-bold text-zinc-800 transition-all outline-none placeholder:text-zinc-300" />
                </div>
              </div>

              {/* Password Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                    <input id="password" name="password" type="password" placeholder="Senha" required className="w-full bg-zinc-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[18px] pl-11 pr-4 py-4 text-[15px] font-bold text-zinc-800 transition-all outline-none placeholder:text-zinc-300" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                    <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirmar" required className="w-full bg-zinc-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[18px] pl-11 pr-4 py-4 text-[15px] font-bold text-zinc-800 transition-all outline-none placeholder:text-zinc-300" />
                  </div>
                </div>
              </div>

              <input type="hidden" name="referralCode" value={referralCode} />

              <div className="pt-4">
                <Button type="submit" variant="primary" size="lg" className="w-full h-16 rounded-[22px] flex items-center justify-center gap-3 active-press shadow-[0_12px_32px_-6px_rgba(20,184,166,0.5)]">
                  Criar Meu Perfil 
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Link href="/login" className="flex items-center gap-2 text-white/60 font-bold text-sm hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Já sou da elite FitJá, fazer login
            </Link>

            <div className="flex items-center gap-2 text-zinc-600 bg-white/5 px-4 py-2 rounded-full border border-white/10 select-none">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold uppercase tracking-tight">Dados 100% Protegidos</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

