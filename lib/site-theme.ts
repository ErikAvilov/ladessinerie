import { createClient } from '@supabase/supabase-js'
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
  'petit-portraits': 'bouton_petit_portraits',
  'grand-portraits': 'bouton_grand_portraits',
  stickers: 'bouton_stickers',
  milklab: 'bouton_milklab',
}

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_RE.test(value)
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  const normalized = `#${withHash.slice(1).toLowerCase()}`
  return isValidHexColor(normalized) ? normalized : null
}

function getAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    )
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

function rowToTheme(row: Partial<SiteTheme> | null | undefined): SiteTheme {
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

export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    const supabase = getAnonClient()
    const { data, error } = await supabase.from('site_theme').select('*').eq('id', 1).maybeSingle()

    if (error) {
      console.error('Erreur Supabase site_theme:', error)
      return DEFAULT_SITE_THEME
    }

    return rowToTheme(data as Partial<SiteTheme> | null)
  } catch (error) {
    console.error('getSiteTheme:', error)
    return DEFAULT_SITE_THEME
  }
}

export function parseSiteThemeInput(input: Partial<SiteTheme>): SiteTheme | { error: string } {
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
    return { error: 'Couleur bouton Petit portraits invalide (format #RRGGBB).' }
  }
  if (!bouton_grand_portraits) {
    return { error: 'Couleur bouton Grand portraits invalide (format #RRGGBB).' }
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

export function boutonColorFromTheme(
  theme: SiteTheme,
  slug: ParticulierCategorySlug,
): string {
  return theme[BOUTON_THEME_BY_SLUG[slug]]
}

/** Dans background.svg, `--background-fond` colore les traits ; `--background-traits` les carrés. */
export const BOUTON_BACKGROUND_FOND = '#ffffff'
