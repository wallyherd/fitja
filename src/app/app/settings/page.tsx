import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './components/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-md mx-auto pt-10 px-6 font-body">
       <header className="mb-8">
          <h1 className="text-3xl font-sans font-extrabold text-zinc-900 tracking-tight">Ajustes</h1>
          <p className="text-zinc-500 font-medium">Controle sua rotina e privacidade.</p>
       </header>

       <SettingsClient profile={profile} />
    </div>
  )
}
