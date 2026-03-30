import Link from "next/link"
import { Button, Input, ErrorState } from "@/components/ui/design-system"
import { loginUser } from "./actions"
import { Leaf } from "lucide-react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen font-body flex flex-col relative overflow-hidden" style={{ background: '#f8fafb' }}>

      {/* ── Ambient background orbs ── */}
      <div
        className="absolute top-[-8%] right-[-12%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', filter: 'blur(1px)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-8%] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', filter: 'blur(1px)' }}
      />

      {/* ── Logo area ── */}
      <header className="pt-14 pb-8 px-6 flex flex-col items-center z-10">
        <div
          className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(145deg, #14b8a6, #0d9488)',
            boxShadow: '0 8px 28px -4px rgba(20,184,166,0.45)',
          }}
        >
          <Leaf className="w-7 h-7 text-white" />
        </div>
        <p
          className="text-[13px] font-bold tracking-[0.15em] uppercase"
          style={{ color: '#9ca3af' }}
        >
          FitJá
        </p>
      </header>

      {/* ── Form Card ── */}
      <main className="flex-1 flex items-start justify-center px-5 z-10">
        <div className="w-full max-w-md">

          {/* Greeting */}
          <div className="mb-8 px-1">
            <h1
              className="text-[28px] font-sans font-black tracking-tight mb-1.5"
              style={{ color: '#0a0f1e' }}
            >
              Que bom te ver! 👋
            </h1>
            <p className="text-[15px] font-medium" style={{ color: '#6b7280' }}>
              Entre para continuar sua evolução.
            </p>
          </div>

          {/* Card */}
          <div
            className="w-full rounded-[var(--radius-2xl)] p-6"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <form action={loginUser} className="space-y-5">
              {params?.error && <ErrorState message={params.error} />}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-bold mb-2 ml-0.5"
                  style={{ color: '#374151' }}
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2 ml-0.5">
                  <label htmlFor="password" className="text-[13px] font-bold" style={{ color: '#374151' }}>
                    Senha
                  </label>
                  <Link
                    href="#"
                    className="text-[12px] font-bold"
                    style={{ color: '#0d9488' }}
                  >
                    Esqueci a senha
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  defaultChecked
                  className="w-4 h-4 rounded accent-[#14b8a6]"
                />
                <label htmlFor="remember" className="text-[13px] font-medium" style={{ color: '#6b7280' }}>
                  Manter conectado
                </label>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                Entrar
              </Button>
            </form>
          </div>

          {/* Switch to Signup */}
          <p className="text-center text-[14px] font-medium mt-6" style={{ color: '#9ca3af' }}>
            Ainda não tem o FitJá?{' '}
            <Link href="/signup" className="font-bold" style={{ color: '#0d9488' }}>
              Crie sua conta grátis
            </Link>
          </p>

          <p className="text-center text-[10px] font-medium mt-8" style={{ color: '#d1d5db', letterSpacing: '0.04em' }}>
            Ao entrar, você aceita os{' '}
            <Link href="/terms" className="underline">Termos</Link>
            {' '}e a{' '}
            <Link href="/privacy" className="underline">Política de Privacidade</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
