import Link from "next/link";
import { Button } from "@/components/ui/design-system";
import { Sparkles, Trophy, ArrowRight, ShieldCheck } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen overflow-hidden relative font-body flex flex-col items-center justify-between p-7 pb-12" style={{ background: '#0a0f1e' }}>
      
      {/* ── Background Atmosphere ── */}
      <div className="absolute top-[-15%] right-[-10%] w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[400px] h-[400px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[30%] left-[-5%] w-24 h-24 bg-white/5 rounded-full border border-white/5 animate-pulse" />
      <div className="absolute top-[10%] right-[10%] w-12 h-12 bg-indigo-400/10 rounded-full border border-indigo-400/5" />

      {/* ── Top Header/Brand ── */}
      <header className="relative z-10 w-full flex flex-col items-center pt-8">
        <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-2xl mb-6">
           <Sparkles className="w-4 h-4 text-teal-400" />
           <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">SISTEMA MASTER 2025</span>
        </div>
      </header>

      {/* ── Hero Center ── */}
      <main className="relative z-10 w-full max-w-lg mb-8">
        
        <div className="text-center mb-10">
          <h1 className="text-[48px] sm:text-[64px] font-sans font-black text-white leading-[1.05] tracking-tight mb-6">
            Sua Saúde, <br />
            <span className="text-teal-400">Totalmente <br /> sob Controle.</span>
          </h1>
          <p className="text-[15px] font-medium text-gray-400 px-6 leading-relaxed max-w-[340px] mx-auto">
            O FitJá une acompanhamento humano e IA para hackear sua rotina e transformar seu corpo definitivamente.
          </p>
        </div>

        {/* Feature Cards Grid (Compact) */}
        <div className="grid grid-cols-2 gap-3 mb-10">
           <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-2 scale-95 opacity-80 backdrop-blur-sm">
              <Trophy className="text-indigo-400" size={20} />
              <p className="text-[12px] font-bold text-white tracking-tight leading-none italic">Metodologia <br/> Exclusiva</p>
           </div>
           <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-2 rotate-1 backdrop-blur-sm">
              <ShieldCheck className="text-teal-400" size={20} />
              <p className="text-[12px] font-bold text-white tracking-tight leading-none italic">Foco Total <br/> em Resultados</p>
           </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4 px-2">
          <Link href="/quiz" className="block focus:outline-none">
            <button className="w-full h-18 bg-white text-[#0a0f1e] text-[16px] font-black uppercase tracking-widest rounded-3xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 py-5">
              Começar Jornada
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/login" className="block focus:outline-none">
            <button className="w-full h-18 bg-white/5 hover:bg-white/10 text-white text-[14px] font-black uppercase tracking-widest rounded-3xl border border-white/10 backdrop-blur-xl transition-all py-5">
              Já tenho uma conta
            </button>
          </Link>
        </div>
      </main>
      
      {/* ── Footer ── */}
      <footer className="relative z-10 w-full text-center">
        <div className="flex items-center justify-center gap-6 mb-6">
           <div className="flex flex-col items-center">
              <span className="text-white font-black text-xl leading-none italic">12k+</span>
              <span className="text-gray-500 font-bold text-[9px] uppercase tracking-widest">Atletas</span>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-white font-black text-xl leading-none italic">Elite</span>
              <span className="text-gray-500 font-bold text-[9px] uppercase tracking-widest">Acesso</span>
           </div>
        </div>
        <p className="text-gray-600 text-[11px] font-medium tracking-tight">
          © 2025 FitJá Health & Performance Labs.
          <br/> Sua evolução começa hoje.
        </p>
      </footer>
    </div>
  );
}
