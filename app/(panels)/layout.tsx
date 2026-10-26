import { PanelsShell } from '@/components/panels-shell'
import { getPanelsIllustrations } from '@/lib/panels-data'

export const revalidate = 60

export default async function PanelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { home } = await getPanelsIllustrations()

  return (
    <PanelsShell initialHome={home}>
      {children}
    </PanelsShell>
  )
}
