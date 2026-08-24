import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pour les pros',
}

export default function ProLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
