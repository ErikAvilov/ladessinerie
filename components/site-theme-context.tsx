'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import {
  boutonColorFromTheme,
  DEFAULT_SITE_THEME,
  fondColorFromTheme,
  type BoutonCategorySlug,
  type SiteTheme,
} from '@/lib/site-theme-shared'

type SiteThemeContextValue = SiteTheme & {
  panierFond: string
  panierTraits: string
  backgroundFond: string
  backgroundTraits: string
  boutonColor: (slug: BoutonCategorySlug) => string
  fondColor: (slug: BoutonCategorySlug) => string
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)

function toContextValue(theme: SiteTheme): SiteThemeContextValue {
  return {
    ...theme,
    panierFond: theme.panier_fond,
    panierTraits: theme.panier_traits,
    backgroundFond: theme.background_fond,
    backgroundTraits: theme.background_traits,
    boutonColor: (slug) => boutonColorFromTheme(theme, slug),
    fondColor: (slug) => fondColorFromTheme(theme, slug),
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
