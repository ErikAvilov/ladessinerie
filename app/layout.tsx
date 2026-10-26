import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PageTransition } from '@/components/page-transition'
import { SiteThemeProvider } from '@/components/site-theme-context'
import { getSiteTheme } from '@/lib/site-theme'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

/** Thème admin (couleurs fond, etc.) doit être relu à chaque requête. */
export const dynamic = 'force-dynamic'

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
  const themeVars = {
    '--text-marque': theme.texte_marque,
    '--text-noms-boutons': theme.texte_noms_boutons,
    '--text-portes': theme.texte_portes,
    '--text-a-propos': theme.texte_a_propos,
    '--text-titre-a-propos': theme.texte_titre_a_propos,
    /* Aligne html/body/bg-background sur le fond admin */
    '--cream': theme.background_fond,
    '--background-fond': theme.background_fond,
    '--background-traits': theme.background_traits,
  } as CSSProperties

  return (
    <html lang="fr" className="bg-background" style={themeVars} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteThemeProvider
          key={`${theme.background_fond}-${theme.background_traits}-${theme.panier_traits}`}
          theme={theme}
        >
          <div className="min-h-dvh bg-background">
            <PageTransition>{children}</PageTransition>
          </div>
        </SiteThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
