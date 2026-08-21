import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pour les pros',
  description: 'Fresques, identités visuelles et illustrations sur mesure.',
}

export default function ProLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
