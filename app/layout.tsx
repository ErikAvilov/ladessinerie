import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const display = Fraunces({ subsets: ['latin'], variable: '--font-display' })
export const metadata: Metadata = { title: 'La Dessinerie — Anna, illustratrice', description: 'Illustrations, fresques et images qui racontent quelque chose.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className="bg-background"><body className={`${body.variable} ${display.variable}`}>{children}</body></html>
}
