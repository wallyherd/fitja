import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen p-6 pt-12 max-w-2xl mx-auto">
      <Link href="/login" className="flex items-center gap-2 text-zinc-400 font-bold text-sm mb-8 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      
      <header className="mb-10">
        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4 text-zinc-900">
           <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Termos de Uso</h1>
        <p className="text-zinc-500 font-medium">Última atualização: 28 de Março, 2026</p>
      </header>

      <article className="prose prose-zinc prose-sm">
        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">1. Aceitação dos Termos</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Ao acessar e usar o FitJá, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não deve usar o nosso serviço.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">2. Descrição do Serviço</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          O FitJá é uma plataforma SaaS que oferece rastreamento de saúde, alimentação, hidratação e treinos, auxiliado por inteligência artificial (SophIA).
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">3. Assinaturas e Pagamentos</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Oferecemos planos Gratuitos e Premium. As assinaturas Premium são processadas periodicamente através da Stripe. O cancelamento pode ser feito a qualquer momento, mas não oferecemos reembolsos parciais para períodos já iniciados.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">4. Disclaimer de Saúde</h2>
        <p className="text-zinc-800 font-bold leading-relaxed mb-6 bg-amber-50 p-4 rounded-2xl border border-amber-100">
          IMPORTANTE: O FitJá e a SophIA não fornecem aconselhamento médico profissional. Consulte sempre um médico ou nutricionista antes de iniciar qualquer dieta ou programa de exercícios físico. O uso do app é de sua total responsabilidade.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">5. Limitação de Responsabilidade</h2>
        <p className="text-zinc-600 leading-relaxed mb-12">
          O FitJá não se responsabiliza por imprecisões nas análises de IA (SophIA Vision) ou metas sugeridas.
        </p>
      </article>

      <footer className="pt-12 border-t border-zinc-100 text-center pb-20">
         <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">FitJá © 2026 ─ Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
