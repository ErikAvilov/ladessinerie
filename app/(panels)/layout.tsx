import { PanelsShell } from '@/components/panels-shell'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function PanelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [particulier, pro] = await Promise.all([
    getIllustrations('particulier'),
    getIllustrations('pro'),
  ])

  return (
    <PanelsShell
      initialHome={pickHomeScatterIllustrations(particulier)}
      initialParticulier={particulier}
      initialPro={pro}
    >
      {children}
    </PanelsShell>
  )
}
