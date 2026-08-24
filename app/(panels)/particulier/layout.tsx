import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pour les particuliers',
}

export default function ParticulierLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
