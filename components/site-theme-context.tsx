'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { DEFAULT_SITE_THEME, type SiteTheme } from '@/lib/site-theme'

type SiteThemeContextValue = SiteTheme & {
  panierFond: string
  panierTraits: string
  backgroundFond: string
  backgroundTraits: string
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)

export function SiteThemeProvider({
  theme,
  children,
}: {
  theme: SiteTheme
  children: ReactNode
}) {
  const value = useMemo<SiteThemeContextValue>(
    () => ({
      ...theme,
      panierFond: theme.panier_fond,
      panierTraits: theme.panier_traits,
      backgroundFond: theme.background_fond,
      backgroundTraits: theme.background_traits,
    }),
    [theme],
  )

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
}

export function useSiteThemeOptional() {
  return useContext(SiteThemeContext)
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext)
  if (!context) {
    return {
      ...DEFAULT_SITE_THEME,
      panierFond: DEFAULT_SITE_THEME.panier_fond,
      panierTraits: DEFAULT_SITE_THEME.panier_traits,
      backgroundFond: DEFAULT_SITE_THEME.background_fond,
      backgroundTraits: DEFAULT_SITE_THEME.background_traits,
    }
  }
  return context
}
