import type { ParticulierCategorySlug } from '@/lib/particulier-categories'
import type { ProCategorySlug } from '@/lib/pro-categories'

/** Blocs texte des pages éditoriales Pro (branding / fresque / événementiel). */
export const PRO_EDITORIAL_TEXT_BLOCKS = [
  'titre',
  'sous_titre',
  'description',
  'livrables_titre',
  'livrables',
  'etapes_titre',
  'etapes',
  'tarif',
  'delai',
] as const

export type ProEditorialTextBlock = (typeof PRO_EDITORIAL_TEXT_BLOCKS)[number]

export const PRO_EDITORIAL_TEXT_LABELS: Record<ProEditorialTextBlock, string> = {
  titre: 'Titre',
  sous_titre: 'Sous-titre',
  description: 'Description',
  livrables_titre: 'Titre « Ce que vous recevrez »',
  livrables: 'Liste livrables',
  etapes_titre: 'Titre « Comment ça se passe »',
  etapes: 'Liste étapes',
  tarif: 'Tarif',
  delai: 'Délai',
}

/** Blocs texte page Contact Pro. */
export const PRO_CONTACT_TEXT_BLOCKS = [
  'titre',
  'accroche_titre',
  'accroche',
  'formulaire',
] as const

export type ProContactTextBlock = (typeof PRO_CONTACT_TEXT_BLOCKS)[number]

export const PRO_CONTACT_TEXT_LABELS: Record<ProContactTextBlock, string> = {
  titre: 'Titre',
  accroche_titre: 'Accroche — titre',
  accroche: 'Accroche — texte',
  formulaire: 'Formulaire',
}

export const PRO_EDITORIAL_SECTIONS = ['branding', 'fresque', 'evenementiel'] as const
export type ProEditorialSection = (typeof PRO_EDITORIAL_SECTIONS)[number]

export type ProTextThemeKey =
  | `texte_pro_${ProEditorialSection}_${ProEditorialTextBlock}`
  | `texte_pro_contact_${ProContactTextBlock}`

export function proEditorialTextKey(
  section: ProEditorialSection,
  block: ProEditorialTextBlock,
): `texte_pro_${ProEditorialSection}_${ProEditorialTextBlock}` {
  return `texte_pro_${section}_${block}`
}

export function proContactTextKey(
  block: ProContactTextBlock,
): `texte_pro_contact_${ProContactTextBlock}` {
  return `texte_pro_contact_${block}`
}

function buildDefaultProTextTheme(
  color: string,
): Record<ProTextThemeKey, string> {
  const out = {} as Record<ProTextThemeKey, string>
  for (const section of PRO_EDITORIAL_SECTIONS) {
    for (const block of PRO_EDITORIAL_TEXT_BLOCKS) {
      out[proEditorialTextKey(section, block)] = color
    }
  }
  for (const block of PRO_CONTACT_TEXT_BLOCKS) {
    out[proContactTextKey(block)] = color
  }
  return out
}

const DEFAULT_PRO_TEXT = '#2b2927'
const DEFAULT_PRO_TEXT_THEME = buildDefaultProTextTheme(DEFAULT_PRO_TEXT)

export const PRO_TEXT_THEME_KEYS = Object.keys(DEFAULT_PRO_TEXT_THEME) as ProTextThemeKey[]

export type SiteTheme = {
  panier_fond: string
  panier_traits: string
  background_fond: string
  background_traits: string
  /** Couleur du SVG bouton */
  bouton_petit_portraits: string
  bouton_grand_portraits: string
  bouton_stickers: string
  bouton_milklab: string
  /** Couleur du fond de page une fois dans la catégorie */
  fond_petit_portraits: string
  fond_grand_portraits: string
  fond_stickers: string
  fond_milklab: string
  /** Titre « La Dessinerie » (header) */
  texte_marque: string
  /** Noms sous les boutons catégories (Illustrations, Milklab…) */
  texte_noms_boutons: string
  /** Portes Accueil / Particulier / Pro */
  texte_portes: string
  /** Corps de texte page À propos */
  texte_a_propos: string
  /** Titre page À propos */
  texte_titre_a_propos: string
  /** CTA « Ajouter » / « Ajouter au panier » */
  bouton_ajouter_panier: string
  /** CTA « Acheter » (paiement direct) */
  bouton_acheter: string
} & Record<ProTextThemeKey, string>

export const DEFAULT_SITE_THEME: SiteTheme = {
  panier_fond: '#ffffff',
  panier_traits: '#d96b43',
  background_fond: '#faf6ee',
  background_traits: '#e8ddd0',
  bouton_petit_portraits: '#cc633b',
  bouton_grand_portraits: '#e5b1b0',
  bouton_stickers: '#f6e896',
  bouton_milklab: '#c1d6d1',
  fond_petit_portraits: '#cc633b',
  fond_grand_portraits: '#e5b1b0',
  fond_stickers: '#f6e896',
  fond_milklab: '#c1d6d1',
  texte_marque: '#3a4f3c',
  texte_noms_boutons: '#2b2927',
  texte_portes: '#2b2927',
  texte_a_propos: '#2b2927',
  texte_titre_a_propos: '#2b2927',
  bouton_ajouter_panier: '#d96b43',
  bouton_acheter: '#d96b43',
  ...DEFAULT_PRO_TEXT_THEME,
}

export function isProEditorialSection(value: string): value is ProEditorialSection {
  return (PRO_EDITORIAL_SECTIONS as readonly string[]).includes(value)
}

export function proEditorialColorsFromTheme(
  theme: SiteTheme,
  section: ProEditorialSection,
): Record<ProEditorialTextBlock, string> {
  const colors = {} as Record<ProEditorialTextBlock, string>
  for (const block of PRO_EDITORIAL_TEXT_BLOCKS) {
    colors[block] = theme[proEditorialTextKey(section, block)]
  }
  return colors
}

export function proContactColorsFromTheme(
  theme: SiteTheme,
): Record<ProContactTextBlock, string> {
  const colors = {} as Record<ProContactTextBlock, string>
  for (const block of PRO_CONTACT_TEXT_BLOCKS) {
    colors[block] = theme[proContactTextKey(block)]
  }
  return colors
}

export const BOUTON_THEME_KEYS = [
  'bouton_petit_portraits',
  'bouton_grand_portraits',
  'bouton_stickers',
  'bouton_milklab',
] as const

export type BoutonThemeKey = (typeof BOUTON_THEME_KEYS)[number]

export const FOND_THEME_KEYS = [
  'fond_petit_portraits',
  'fond_grand_portraits',
  'fond_stickers',
  'fond_milklab',
] as const

export type FondThemeKey = (typeof FOND_THEME_KEYS)[number]

export const BOUTON_THEME_BY_SLUG: Record<ParticulierCategorySlug, BoutonThemeKey> = {
  illustrations: 'bouton_petit_portraits',
  milklab: 'bouton_milklab',
  stickers: 'bouton_stickers',
  personnalisees: 'bouton_grand_portraits',
}

export const FOND_THEME_BY_SLUG: Record<ParticulierCategorySlug, FondThemeKey> = {
  illustrations: 'fond_petit_portraits',
  milklab: 'fond_milklab',
  stickers: 'fond_stickers',
  personnalisees: 'fond_grand_portraits',
}

/** Réutilise les 4 couleurs admin, dans l’ordre Branding / Fresque / Événementiel / Contact. */
export const BOUTON_THEME_BY_PRO_SLUG: Record<ProCategorySlug, BoutonThemeKey> = {
  branding: 'bouton_petit_portraits',
  fresque: 'bouton_milklab',
  evenementiel: 'bouton_stickers',
  contact: 'bouton_grand_portraits',
}

export const FOND_THEME_BY_PRO_SLUG: Record<ProCategorySlug, FondThemeKey> = {
  branding: 'fond_petit_portraits',
  fresque: 'fond_milklab',
  evenementiel: 'fond_stickers',
  contact: 'fond_grand_portraits',
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

type LegacyTheme = Partial<SiteTheme> & {
  texte_titres?: string
  texte_corps?: string
  /** Ancienne couleur unique pour tous les textes Pro. */
  texte_pro?: string
}

function coalesceProTextTheme(row: LegacyTheme): Record<ProTextThemeKey, string> {
  const legacy =
    row.texte_pro ?? row.texte_corps ?? DEFAULT_PRO_TEXT
  const out = {} as Record<ProTextThemeKey, string>
  for (const key of PRO_TEXT_THEME_KEYS) {
    out[key] = row[key] ?? legacy
  }
  return out
}

export function coalesceSiteTheme(row: LegacyTheme | null | undefined): SiteTheme {
  if (!row) return DEFAULT_SITE_THEME

  const bouton_petit_portraits =
    row.bouton_petit_portraits ?? DEFAULT_SITE_THEME.bouton_petit_portraits
  const bouton_grand_portraits =
    row.bouton_grand_portraits ?? DEFAULT_SITE_THEME.bouton_grand_portraits
  const bouton_stickers = row.bouton_stickers ?? DEFAULT_SITE_THEME.bouton_stickers
  const bouton_milklab = row.bouton_milklab ?? DEFAULT_SITE_THEME.bouton_milklab

  return {
    panier_fond: row.panier_fond ?? DEFAULT_SITE_THEME.panier_fond,
    panier_traits: row.panier_traits ?? DEFAULT_SITE_THEME.panier_traits,
    background_fond: row.background_fond ?? DEFAULT_SITE_THEME.background_fond,
    background_traits: row.background_traits ?? DEFAULT_SITE_THEME.background_traits,
    bouton_petit_portraits,
    bouton_grand_portraits,
    bouton_stickers,
    bouton_milklab,
    // Ancien thème : le fond = couleur bouton ; nouveau : clés séparées.
    fond_petit_portraits: row.fond_petit_portraits ?? bouton_petit_portraits,
    fond_grand_portraits: row.fond_grand_portraits ?? bouton_grand_portraits,
    fond_stickers: row.fond_stickers ?? bouton_stickers,
    fond_milklab: row.fond_milklab ?? bouton_milklab,
    texte_marque:
      row.texte_marque ?? row.texte_titres ?? DEFAULT_SITE_THEME.texte_marque,
    texte_noms_boutons:
      row.texte_noms_boutons ?? row.texte_titres ?? DEFAULT_SITE_THEME.texte_noms_boutons,
    texte_portes:
      row.texte_portes ?? row.texte_corps ?? DEFAULT_SITE_THEME.texte_portes,
    texte_a_propos:
      row.texte_a_propos ?? row.texte_corps ?? DEFAULT_SITE_THEME.texte_a_propos,
    texte_titre_a_propos:
      row.texte_titre_a_propos ?? row.texte_titres ?? DEFAULT_SITE_THEME.texte_titre_a_propos,
    bouton_ajouter_panier:
      row.bouton_ajouter_panier ?? DEFAULT_SITE_THEME.bouton_ajouter_panier,
    bouton_acheter: row.bouton_acheter ?? DEFAULT_SITE_THEME.bouton_acheter,
    ...coalesceProTextTheme(row),
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
  const fond_petit_portraits = normalizeHexColor(input.fond_petit_portraits ?? '')
  const fond_grand_portraits = normalizeHexColor(input.fond_grand_portraits ?? '')
  const fond_stickers = normalizeHexColor(input.fond_stickers ?? '')
  const fond_milklab = normalizeHexColor(input.fond_milklab ?? '')
  const texte_marque = normalizeHexColor(input.texte_marque ?? '')
  const texte_noms_boutons = normalizeHexColor(input.texte_noms_boutons ?? '')
  const texte_portes = normalizeHexColor(input.texte_portes ?? '')
  const texte_a_propos = normalizeHexColor(input.texte_a_propos ?? '')
  const texte_titre_a_propos = normalizeHexColor(input.texte_titre_a_propos ?? '')
  const bouton_ajouter_panier = normalizeHexColor(input.bouton_ajouter_panier ?? '')
  const bouton_acheter = normalizeHexColor(input.bouton_acheter ?? '')

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
    return { error: 'Couleur bouton Illustrations sur mesure invalide (format #RRGGBB).' }
  }
  if (!bouton_stickers) return { error: 'Couleur bouton Stickers invalide (format #RRGGBB).' }
  if (!bouton_milklab) return { error: 'Couleur bouton Milklab invalide (format #RRGGBB).' }
  if (!fond_petit_portraits) {
    return { error: 'Couleur fond Illustrations invalide (format #RRGGBB).' }
  }
  if (!fond_grand_portraits) {
    return { error: 'Couleur fond Illustrations sur mesure invalide (format #RRGGBB).' }
  }
  if (!fond_stickers) return { error: 'Couleur fond Stickers invalide (format #RRGGBB).' }
  if (!fond_milklab) return { error: 'Couleur fond Milklab invalide (format #RRGGBB).' }
  if (!texte_marque) return { error: 'Couleur titre La Dessinerie invalide (format #RRGGBB).' }
  if (!texte_noms_boutons) return { error: 'Couleur noms boutons invalide (format #RRGGBB).' }
  if (!texte_portes) return { error: 'Couleur portes Accueil/Particulier/Pro invalide (format #RRGGBB).' }
  if (!texte_a_propos) return { error: 'Couleur texte À propos invalide (format #RRGGBB).' }
  if (!texte_titre_a_propos) return { error: 'Couleur titre À propos invalide (format #RRGGBB).' }
  if (!bouton_ajouter_panier) {
    return { error: 'Couleur bouton Ajouter au panier invalide (format #RRGGBB).' }
  }
  if (!bouton_acheter) return { error: 'Couleur bouton Acheter invalide (format #RRGGBB).' }

  const proText = {} as Record<ProTextThemeKey, string>
  for (const key of PRO_TEXT_THEME_KEYS) {
    const value = normalizeHexColor(input[key] ?? '')
    if (!value) {
      return { error: `Couleur ${key.replace(/_/g, ' ')} invalide (format #RRGGBB).` }
    }
    proText[key] = value
  }

  return {
    panier_fond,
    panier_traits,
    background_fond,
    background_traits,
    bouton_petit_portraits,
    bouton_grand_portraits,
    bouton_stickers,
    bouton_milklab,
    fond_petit_portraits,
    fond_grand_portraits,
    fond_stickers,
    fond_milklab,
    texte_marque,
    texte_noms_boutons,
    texte_portes,
    texte_a_propos,
    texte_titre_a_propos,
    bouton_ajouter_panier,
    bouton_acheter,
    ...proText,
  }
}

export type BoutonCategorySlug = ParticulierCategorySlug | ProCategorySlug

export function boutonColorFromTheme(theme: SiteTheme, slug: BoutonCategorySlug) {
  if (slug in BOUTON_THEME_BY_SLUG) {
    return theme[BOUTON_THEME_BY_SLUG[slug as ParticulierCategorySlug]]
  }
  return theme[BOUTON_THEME_BY_PRO_SLUG[slug as ProCategorySlug]]
}

export function fondColorFromTheme(theme: SiteTheme, slug: BoutonCategorySlug) {
  if (slug in FOND_THEME_BY_SLUG) {
    return theme[FOND_THEME_BY_SLUG[slug as ParticulierCategorySlug]]
  }
  return theme[FOND_THEME_BY_PRO_SLUG[slug as ProCategorySlug]]
}

/** Traits blancs du motif de fond coloré par catégorie. */
export const CATEGORY_BACKGROUND_TRAITS = '#ffffff'
