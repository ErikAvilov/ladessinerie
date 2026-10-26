import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PageTransition } from '@/components/page-transition'
import { SiteThemeProvider } from '@/components/site-theme-context'
import { getSiteTheme } from '@/lib/site-theme'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

/** Thème admin : ISR + revalidatePath côté admin. */
export const revalidate = 60

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
    /* SVG boutique uniquement — ne pas écraser --cream (chrome / admin). */
    '--background-fond': theme.background_fond,
    '--background-traits': theme.background_traits,
  } as CSSProperties

  return (
    <html lang="fr" className="bg-background" style={themeVars} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteThemeProvider theme={theme}>
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
