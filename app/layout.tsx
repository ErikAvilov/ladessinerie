import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PageTransition } from '@/components/page-transition'
import { SiteThemeProvider } from '@/components/site-theme-context'
import { getSiteTheme } from '@/lib/site-theme'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'La Dessinerie',
    template: '%s — La Dessinerie',
  },
  description: 'Illustrations uniques & branding créatif pour marques et particuliers.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = await getSiteTheme()

  return (
    <html lang="fr" className="bg-background" suppressHydrationWarning>
      <body className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
        <SiteThemeProvider theme={theme}>
          <div className="h-dvh overflow-hidden bg-background">
            <PageTransition>{children}</PageTransition>
          </div>
        </SiteThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
