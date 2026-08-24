'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import {
  BOUTON_THEME_BY_SLUG,
  DEFAULT_SITE_THEME,
  type SiteTheme,
} from '@/lib/site-theme'
import type { ParticulierCategorySlug } from '@/lib/particulier-categories'

type SiteThemeContextValue = SiteTheme & {
  panierFond: string
  panierTraits: string
  backgroundFond: string
  backgroundTraits: string
  boutonColor: (slug: ParticulierCategorySlug) => string
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)

function toContextValue(theme: SiteTheme): SiteThemeContextValue {
  return {
    ...theme,
    panierFond: theme.panier_fond,
    panierTraits: theme.panier_traits,
    backgroundFond: theme.background_fond,
    backgroundTraits: theme.background_traits,
    boutonColor: (slug) => theme[BOUTON_THEME_BY_SLUG[slug]],
  }
}

export function SiteThemeProvider({
  theme,
  children,
}: {
  theme: SiteTheme
  children: ReactNode
}) {
  const value = useMemo(() => toContextValue(theme), [theme])

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
}

export function useSiteThemeOptional() {
  return useContext(SiteThemeContext)
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext)
  if (!context) {
    return toContextValue(DEFAULT_SITE_THEME)
  }
  return context
}
