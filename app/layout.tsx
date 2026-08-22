import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import { PageTransition } from '@/components/page-transition'
import './globals.css'

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const display = Fraunces({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: {
    default: 'La Dessinerie',
    template: '%s — La Dessinerie',
  },
  description: 'Illustrations uniques & branding créatif pour marques et particuliers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background" suppressHydrationWarning>
      <body className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
        <div className="h-dvh overflow-hidden bg-background">
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  )
}
