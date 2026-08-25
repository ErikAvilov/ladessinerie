import { PanelsShell } from '@/components/panels-shell'
import { getPanelsIllustrations } from '@/lib/panels-data'

export const dynamic = 'force-dynamic'

export default async function PanelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { home, particulier, pro } = await getPanelsIllustrations()

  return (
    <PanelsShell
      initialHome={home}
      initialParticulier={particulier}
      initialPro={pro}
    >
      {children}
    </PanelsShell>
  )
}
