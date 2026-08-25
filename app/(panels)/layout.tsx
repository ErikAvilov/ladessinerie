import { PanelsShell } from '@/components/panels-shell'
import { getPanelsIllustrations } from '@/lib/panels-data'

export const dynamic = 'force-dynamic'

export default async function PanelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { home, pro } = await getPanelsIllustrations()

  return (
    <PanelsShell initialHome={home} initialPro={pro}>
      {children}
    </PanelsShell>
  )
}
