import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { BottomNav } from '@/components/ui/BottomNav'
import { TopHeader } from '@/components/ui/TopHeader'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    return redirect('/onboarding')
  }

  return (
    <div
      className="font-body selection:bg-[rgba(20,184,166,0.15)] selection:text-[#0f766e] relative"
      style={{ background: '#f8fafb', minHeight: '100dvh' }}
    >
      <TopHeader profile={profile} />
      
      <main className="pt-16 min-h-screen">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}

