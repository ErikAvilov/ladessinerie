import type { ParticulierCategorySlug } from '@/lib/particulier-categories'

export type SiteTheme = {
  panier_fond: string
  panier_traits: string
  background_fond: string
  background_traits: string
  bouton_petit_portraits: string
  bouton_grand_portraits: string
  bouton_stickers: string
  bouton_milklab: string
}

export const DEFAULT_SITE_THEME: SiteTheme = {
  panier_fond: '#ffffff',
  panier_traits: '#d96b43',
  background_fond: '#faf6ee',
  background_traits: '#e8ddd0',
  bouton_petit_portraits: '#cc633b',
  bouton_grand_portraits: '#e5b1b0',
  bouton_stickers: '#f6e896',
  bouton_milklab: '#c1d6d1',
}

export const BOUTON_THEME_KEYS = [
  'bouton_petit_portraits',
  'bouton_grand_portraits',
  'bouton_stickers',
  'bouton_milklab',
] as const

export type BoutonThemeKey = (typeof BOUTON_THEME_KEYS)[number]

export const BOUTON_THEME_BY_SLUG: Record<ParticulierCategorySlug, BoutonThemeKey> = {
  illustrations: 'bouton_petit_portraits',
  milklab: 'bouton_milklab',
  stickers: 'bouton_stickers',
  personnalisees: 'bouton_grand_portraits',
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export function isValidHexColor(value: string) {
  return HEX_RE.test(value)
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  const normalized = `#${withHash.slice(1).toLowerCase()}`
  return isValidHexColor(normalized) ? normalized : null
}

export function coalesceSiteTheme(row: Partial<SiteTheme> | null | undefined): SiteTheme {
  if (!row) return DEFAULT_SITE_THEME
  return {
    panier_fond: row.panier_fond ?? DEFAULT_SITE_THEME.panier_fond,
    panier_traits: row.panier_traits ?? DEFAULT_SITE_THEME.panier_traits,
    background_fond: row.background_fond ?? DEFAULT_SITE_THEME.background_fond,
    background_traits: row.background_traits ?? DEFAULT_SITE_THEME.background_traits,
    bouton_petit_portraits:
      row.bouton_petit_portraits ?? DEFAULT_SITE_THEME.bouton_petit_portraits,
    bouton_grand_portraits:
      row.bouton_grand_portraits ?? DEFAULT_SITE_THEME.bouton_grand_portraits,
    bouton_stickers: row.bouton_stickers ?? DEFAULT_SITE_THEME.bouton_stickers,
    bouton_milklab: row.bouton_milklab ?? DEFAULT_SITE_THEME.bouton_milklab,
  }
}

export function parseSiteThemeInput(
  input: Partial<SiteTheme>,
): SiteTheme | { error: string } {
  const panier_fond = normalizeHexColor(input.panier_fond ?? '')
  const panier_traits = normalizeHexColor(input.panier_traits ?? '')
  const background_fond = normalizeHexColor(input.background_fond ?? '')
  const background_traits = normalizeHexColor(input.background_traits ?? '')
  const bouton_petit_portraits = normalizeHexColor(input.bouton_petit_portraits ?? '')
  const bouton_grand_portraits = normalizeHexColor(input.bouton_grand_portraits ?? '')
  const bouton_stickers = normalizeHexColor(input.bouton_stickers ?? '')
  const bouton_milklab = normalizeHexColor(input.bouton_milklab ?? '')

  if (!panier_fond) return { error: 'Couleur panier fond invalide (format #RRGGBB).' }
  if (!panier_traits) return { error: 'Couleur panier traits invalide (format #RRGGBB).' }
  if (!background_fond) return { error: 'Couleur arrière-plan fond invalide (format #RRGGBB).' }
  if (!background_traits) {
    return { error: 'Couleur arrière-plan traits invalide (format #RRGGBB).' }
  }
  if (!bouton_petit_portraits) {
    return { error: 'Couleur bouton Illustrations invalide (format #RRGGBB).' }
  }
  if (!bouton_grand_portraits) {
    return { error: 'Couleur bouton Illustrations personnalisées invalide (format #RRGGBB).' }
  }
  if (!bouton_stickers) return { error: 'Couleur bouton Stickers invalide (format #RRGGBB).' }
  if (!bouton_milklab) return { error: 'Couleur bouton Milklab invalide (format #RRGGBB).' }

  return {
    panier_fond,
    panier_traits,
    background_fond,
    background_traits,
    bouton_petit_portraits,
    bouton_grand_portraits,
    bouton_stickers,
    bouton_milklab,
  }
}

export function boutonColorFromTheme(theme: SiteTheme, slug: ParticulierCategorySlug) {
  return theme[BOUTON_THEME_BY_SLUG[slug]]
}

/** Fond blanc pour le SVG de fond coloré par catégorie. */
export const BOUTON_BACKGROUND_FOND = '#ffffff'
