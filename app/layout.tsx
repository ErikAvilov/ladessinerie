import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import { PageTransition } from '@/components/page-transition'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const display = Fraunces({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: {
    default: 'La Dessinerie — Anna, illustratrice',
    template: '%s — La Dessinerie',
  },
  description: 'Illustrations, fresques et images qui racontent quelque chose.',
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
          <SiteHeader />
          <RouteSideGates />
          <PageTransition>{children}</PageTransition>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
