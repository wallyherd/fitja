import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen p-6 pt-12 max-w-2xl mx-auto">
      <Link href="/login" className="flex items-center gap-2 text-zinc-400 font-bold text-sm mb-8 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      
      <header className="mb-10">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
           <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Política de Privacidade</h1>
        <p className="text-zinc-500 font-medium">Última atualização: 28 de Março, 2026</p>
      </header>

      <article className="prose prose-zinc prose-sm">
        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">1. Coleta de Dados</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Coletamos dados fornecidos por você (nome, email, objetivos) e dados de uso (logs de alimentação, água e treino) para personalizar a experiência SophIA.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">2. Uso de Imagens</h2>
        <p className="text-zinc-600 leading-relaxed mb-6 font-bold">
          As fotos de refeições que você envia são processadas pela API da Google Gemini Vision para extrair dados nutricionais e NÃO são compartilhadas com terceiros para outros fins.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">3. Proteção de Dados</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Utilizamos o Supabase para armazenamento seguro de dados com criptografia em repouso e políticas RLS (Row Level Security).
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">4. Seus Direitos</h2>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Você pode excluir sua conta e todos os dados associados a qualquer momento através das configurações do aplicativo.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">5. Stripe & Pagamentos</h2>
        <p className="text-zinc-600 leading-relaxed mb-12">
          Não armazenamos seus dados de cartão de crédito. Todas as transações são processadas de forma segura pela Stripe e regidas pela política de privacidade deles.
        </p>
      </article>

      <footer className="pt-12 border-t border-zinc-100 text-center pb-20">
         <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">FitJá © 2026 ─ Segurança e Transparência</p>
      </footer>
    </div>
  )
}
