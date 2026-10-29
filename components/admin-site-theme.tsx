'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSuccessBanner } from '@/components/admin-success-banner'
import { BoutonIcon } from '@/components/bouton-icon'
import { PanierIcon } from '@/components/panier-icon'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { updateSiteTheme } from '@/lib/admin-actions'
import { PARTICULIER_CATEGORIES } from '@/lib/particulier-categories'
import {
  BOUTON_THEME_BY_SLUG,
  CATEGORY_BACKGROUND_TRAITS,
  FOND_THEME_BY_SLUG,
  PRO_CONTACT_TEXT_BLOCKS,
  PRO_CONTACT_TEXT_LABELS,
  PRO_EDITORIAL_TEXT_BLOCKS,
  PRO_EDITORIAL_TEXT_LABELS,
  proContactTextKey,
  proEditorialColorsFromTheme,
  proEditorialTextKey,
  type BoutonThemeKey,
  type FondThemeKey,
  type ProEditorialSection,
  type SiteTheme,
} from '@/lib/site-theme-shared'

type AdminSiteThemePanelProps = {
  initialTheme: SiteTheme
}

type ThemeTab = 'textes' | 'textes_pro' | 'background' | 'categories' | 'panier'
type ProTextSubTab = ProEditorialSection | 'contact'

const PRO_TEXT_SUB_TABS: { id: ProTextSubTab; label: string }[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'fresque', label: 'Fresque' },
  { id: 'evenementiel', label: 'Événementiel' },
  { id: 'contact', label: 'Contact' },
]

const TABS: { id: ThemeTab; label: string }[] = [
  { id: 'textes', label: 'Textes' },
  { id: 'textes_pro', label: 'Textes Pro' },
  { id: 'background', label: 'Arrière-plan' },
  { id: 'categories', label: 'Catégories' },
  { id: 'panier', label: 'Panier' },
]

function isThemeTab(value: string): value is ThemeTab {
  return TABS.some((entry) => entry.id === value)
}

function themeTabFromHash(): ThemeTab | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  return isThemeTab(hash) ? hash : null
}

function setHash(id: string) {
  if (typeof window === 'undefined') return
  const next = `#${id}`
  if (window.location.hash === next) return
  window.history.replaceState(null, '', next)
}

function ThemeColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {hint && <span className="mb-2 block text-xs text-foreground/50">{hint}</span>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-foreground/15 bg-transparent p-0.5"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#RRGGBB"
          className="min-w-0 flex-1 rounded-xl border border-foreground/15 bg-background px-4 py-2.5 font-mono text-sm outline-none transition focus:border-[var(--terracotta)]"
        />
      </div>
    </label>
  )
}

function ProEditorialPreview({
  theme,
  section,
}: {
  theme: SiteTheme
  section: ProEditorialSection
}) {
  const colors = proEditorialColorsFromTheme(theme, section)
  const labels: Record<ProEditorialSection, { titre: string; sousTitre: string }> = {
    branding: {
      titre: 'Branding',
      sousTitre: 'Une identité visuelle qui vous ressemble',
    },
    fresque: {
      titre: 'Fresque',
      sousTitre: 'Une vitrine qui attire les regards !',
    },
    evenementiel: {
      titre: 'Evenementiel',
      sousTitre: 'Votre portrait dessiné en quelques minutes',
    },
  }
  const copy = labels[section]

  return (
    <div className="space-y-2.5">
      <p className="display text-2xl font-semibold" style={{ color: colors.titre }}>
        {copy.titre}
      </p>
      <p className="display text-base font-semibold" style={{ color: colors.sous_titre }}>
        {copy.sousTitre}
      </p>
      <p className="text-sm leading-relaxed opacity-70" style={{ color: colors.description }}>
        Description introductive de la prestation…
      </p>
      <p className="display text-sm font-semibold" style={{ color: colors.livrables_titre }}>
        Ce que vous recevrez
      </p>
      <p className="text-sm opacity-70" style={{ color: colors.livrables }}>
        • Élément livrable
      </p>
      <p className="display text-sm font-semibold" style={{ color: colors.etapes_titre }}>
        Comment ça se passe
      </p>
      <p className="text-sm opacity-70" style={{ color: colors.etapes }}>
        1. Première étape
      </p>
      <p className="display text-sm font-semibold" style={{ color: colors.tarif }}>
        À partir de …
      </p>
      <p className="text-xs opacity-60" style={{ color: colors.delai }}>
        Délai indicatif
      </p>
    </div>
  )
}

export function AdminSiteThemePanel({ initialTheme }: AdminSiteThemePanelProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<SiteTheme>(initialTheme)
  const [tab, setTab] = useState<ThemeTab>('textes')
  const [proSubTab, setProSubTab] = useState<ProTextSubTab>('branding')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    function syncFromHash() {
      const fromHash = themeTabFromHash()
      if (fromHash) setTab(fromHash)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  function selectTab(next: ThemeTab) {
    setTab(next)
    setHash(next)
    setError(null)
    setSuccess(null)
  }

  async function saveTheme(event: FormEvent, successMessage: string) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const result = await updateSiteTheme(theme)

    setSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.theme) setTheme(result.theme)
    setSuccess(successMessage)
    router.refresh()
  }

  function setBoutonColor(key: BoutonThemeKey, value: string) {
    setTheme((current) => ({ ...current, [key]: value }))
  }

  function setFondColor(key: FondThemeKey, value: string) {
    setTheme((current) => ({ ...current, [key]: value }))
  }

  function setTextColor<K extends keyof SiteTheme>(key: K, value: string) {
    setTheme((current) => ({ ...current, [key]: value }))
  }

  return (
    <div id="apparence" className="mb-10 scroll-mt-6">
      <div className="mb-5">
        <h2 className="display text-xl font-semibold">Apparence du site</h2>
        <p className="mt-1 text-sm text-foreground/55">
          Couleurs de textes, textes Pro, fond, catégories et panier.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Sections d’apparence"
        className="mb-5 flex gap-1 overflow-x-auto rounded-full border border-foreground/10 bg-foreground/[0.03] p-1"
      >
        {TABS.map((entry) => {
          const active = tab === entry.id
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={active}
              id={entry.id}
              onClick={() => selectTab(entry.id)}
              className={`cursor-pointer shrink-0 scroll-mt-6 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-[var(--terracotta)] text-white shadow-sm'
                  : 'text-foreground/65 hover:bg-foreground/[0.05] hover:text-foreground'
              }`}
            >
              {entry.label}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
          {error}
        </p>
      )}
      {success && (
        <AdminSuccessBanner
          message={success}
          className="mb-4"
          onHide={() => setSuccess(null)}
        />
      )}

      {tab === 'textes' && (
        <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
          <p className="text-sm text-foreground/55">
            Une couleur par zone de texte du site.
          </p>

          <form
            onSubmit={(event) => void saveTheme(event, 'Couleurs de textes enregistrées.')}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ThemeColorField
                label="Titre (La Dessinerie)"
                hint="Header en haut à gauche"
                value={theme.texte_marque}
                onChange={(value) => setTextColor('texte_marque', value)}
              />
              <ThemeColorField
                label="Noms boutons"
                hint="Illustrations, Milklab, Stickers…"
                value={theme.texte_noms_boutons}
                onChange={(value) => setTextColor('texte_noms_boutons', value)}
              />
              <ThemeColorField
                label="Boutons Accueil / Particulier / Pro"
                hint="Portes latérales et haut"
                value={theme.texte_portes}
                onChange={(value) => setTextColor('texte_portes', value)}
              />
              <ThemeColorField
                label="Titre À propos"
                hint="« Salut, moi c’est Anna. »"
                value={theme.texte_titre_a_propos}
                onChange={(value) => setTextColor('texte_titre_a_propos', value)}
              />
              <ThemeColorField
                label="À propos"
                hint="Paragraphes de la page À propos"
                value={theme.texte_a_propos}
                onChange={(value) => setTextColor('texte_a_propos', value)}
              />
            </div>

            <div className="rounded-xl border border-foreground/10 bg-[var(--cream)] p-4">
              <p className="display text-lg font-semibold" style={{ color: theme.texte_marque }}>
                La Dessinerie
              </p>
              <p className="mt-3 display text-sm font-semibold" style={{ color: theme.texte_noms_boutons }}>
                Illustrations · Milklab
              </p>
              <p className="mt-2 display text-sm font-semibold" style={{ color: theme.texte_portes }}>
                Particulier → Accueil ← Pro
              </p>
              <p
                className="display mt-4 text-xl font-semibold"
                style={{ color: theme.texte_titre_a_propos }}
              >
                Salut, moi c’est Anna.
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-70" style={{ color: theme.texte_a_propos }}>
                Bienvenue dans mon jardin pas si secret.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer les textes'}
            </button>
          </form>
        </section>
      )}

      {tab === 'textes_pro' && (
        <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
          <p className="text-sm text-foreground/55">
            Une couleur par bloc, indépendante pour chaque page Pro
            (/pro/branding, /pro/fresque…).
          </p>

          <div
            role="tablist"
            aria-label="Pages Pro"
            className="mt-5 flex gap-1 overflow-x-auto rounded-full border border-foreground/10 bg-foreground/[0.03] p-1"
          >
            {PRO_TEXT_SUB_TABS.map((entry) => {
              const active = proSubTab === entry.id
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setProSubTab(entry.id)
                    setError(null)
                    setSuccess(null)
                  }}
                  className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-foreground/65 hover:bg-foreground/[0.05] hover:text-foreground'
                  }`}
                >
                  {entry.label}
                </button>
              )
            })}
          </div>

          <form
            onSubmit={(event) =>
              void saveTheme(event, 'Couleurs des textes Pro enregistrées.')
            }
            className="mt-6 space-y-6"
          >
            {proSubTab === 'contact' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {PRO_CONTACT_TEXT_BLOCKS.map((block) => {
                  const key = proContactTextKey(block)
                  return (
                    <ThemeColorField
                      key={key}
                      label={PRO_CONTACT_TEXT_LABELS[block]}
                      value={theme[key]}
                      onChange={(value) => setTextColor(key, value)}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {PRO_EDITORIAL_TEXT_BLOCKS.map((block) => {
                  const key = proEditorialTextKey(proSubTab, block)
                  return (
                    <ThemeColorField
                      key={key}
                      label={PRO_EDITORIAL_TEXT_LABELS[block]}
                      value={theme[key]}
                      onChange={(value) => setTextColor(key, value)}
                    />
                  )
                })}
              </div>
            )}

            <div className="rounded-xl border border-foreground/10 bg-[var(--cream)] p-4 md:p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/45">
                Aperçu · {PRO_TEXT_SUB_TABS.find((entry) => entry.id === proSubTab)?.label}
              </p>
              {proSubTab === 'contact' ? (
                <div className="space-y-2">
                  <p
                    className="display text-2xl font-semibold"
                    style={{ color: theme.texte_pro_contact_titre }}
                  >
                    Contact
                  </p>
                  <p
                    className="display text-lg font-semibold"
                    style={{ color: theme.texte_pro_contact_accroche_titre }}
                  >
                    On imagine quelque chose ?
                  </p>
                  <p
                    className="text-sm leading-relaxed opacity-70"
                    style={{ color: theme.texte_pro_contact_accroche }}
                  >
                    Parlez-moi de votre projet, même s’il n’est pas encore très précis.
                  </p>
                  <p
                    className="text-sm opacity-60"
                    style={{ color: theme.texte_pro_contact_formulaire }}
                  >
                    Votre nom · Email · Message…
                  </p>
                </div>
              ) : (
                <ProEditorialPreview
                  theme={theme}
                  section={proSubTab}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer les textes Pro'}
            </button>
          </form>
        </section>
      )}

      {tab === 'background' && (
        <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
          <p className="text-sm text-foreground/55">
            Couleurs du fond SVG (fond + texture).
          </p>

          <form
            onSubmit={(event) =>
              void saveTheme(event, 'Couleurs de l’arrière-plan enregistrées.')
            }
            className="mt-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ThemeColorField
                label="Fond"
                value={theme.background_fond}
                onChange={(value) => setTextColor('background_fond', value)}
              />
              <ThemeColorField
                label="Traits"
                value={theme.background_traits}
                onChange={(value) => setTextColor('background_traits', value)}
              />
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end">
              <div className="relative h-36 w-full max-w-md overflow-hidden rounded-xl border border-foreground/10 md:h-44">
                <SiteBackgroundLayer
                  fond={theme.background_fond}
                  traits={theme.background_traits}
                  className="absolute inset-0"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer l’arrière-plan'}
              </button>
            </div>
          </form>
        </section>
      )}

      {tab === 'categories' && (
        <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
          <p className="text-sm text-foreground/55">
            Deux couleurs distinctes par catégorie : le bouton (icône) et le fond
            de page une fois entrée dans la collection.
          </p>

          <form
            onSubmit={(event) => void saveTheme(event, 'Couleurs des catégories enregistrées.')}
            className="mt-6"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {PARTICULIER_CATEGORIES.map((category) => {
                const boutonKey = BOUTON_THEME_BY_SLUG[category.slug]
                const fondKey = FOND_THEME_BY_SLUG[category.slug]
                const bouton = theme[boutonKey]
                const fond = theme[fondKey]
                return (
                  <div
                    key={category.slug}
                    className="rounded-xl border border-foreground/10 p-4"
                  >
                    <p
                      className="display mb-4 text-base font-semibold"
                      style={{ color: theme.texte_noms_boutons }}
                    >
                      {category.label}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
                        <div className="mb-3 flex h-24 items-center justify-center rounded-md border border-dashed border-foreground/15 bg-[var(--cream)] p-3">
                          <BoutonIcon
                            src={category.imageSrc}
                            color={bouton}
                            className="h-full w-auto max-w-[5.5rem]"
                          />
                        </div>
                        <ThemeColorField
                          label="Bouton"
                          hint="Remplissage de l’icône sur le hub"
                          value={bouton}
                          onChange={(value) => setBoutonColor(boutonKey, value)}
                        />
                      </div>

                      <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
                        <div className="relative mb-3 h-24 overflow-hidden rounded-md border border-foreground/10">
                          <SiteBackgroundLayer
                            className="absolute inset-0"
                            fond={fond}
                            traits={CATEGORY_BACKGROUND_TRAITS}
                          />
                          <span className="absolute inset-x-0 bottom-2 z-[1] text-center text-[10px] font-medium text-foreground/70">
                            Fond de page
                          </span>
                        </div>
                        <ThemeColorField
                          label="Fond"
                          hint="Arrière-plan de la collection"
                          value={fond}
                          onChange={(value) => setFondColor(fondKey, value)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer les catégories'}
              </button>
            </div>
          </form>
        </section>
      )}

      {tab === 'panier' && (
        <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
          <p className="text-sm text-foreground/55">
            Couleurs du SVG panier et des boutons d’achat.
          </p>

          <form
            onSubmit={(event) => void saveTheme(event, 'Couleurs du panier enregistrées.')}
            className="mt-6 space-y-8"
          >
            <div>
              <p className="mb-3 text-sm font-medium">Icône panier</p>
              <div className="grid gap-4 md:grid-cols-2">
                <ThemeColorField
                  label="Fond"
                  value={theme.panier_fond}
                  onChange={(value) => setTextColor('panier_fond', value)}
                />
                <ThemeColorField
                  label="Traits"
                  value={theme.panier_traits}
                  onChange={(value) => setTextColor('panier_traits', value)}
                />
              </div>
              <div className="mt-4 flex h-36 w-full max-w-xs items-center justify-center rounded-xl border border-foreground/10 bg-[var(--cream)] p-4 md:h-44">
                <PanierIcon
                  fond={theme.panier_fond}
                  traits={theme.panier_traits}
                  className="block h-32 w-44 md:h-36 md:w-52"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Boutons boutique</p>
              <div className="grid gap-4 md:grid-cols-2">
                <ThemeColorField
                  label="Ajouter au panier"
                  hint="Grille Illustrations + fiche art"
                  value={theme.bouton_ajouter_panier}
                  onChange={(value) => setTextColor('bouton_ajouter_panier', value)}
                />
                <ThemeColorField
                  label="Acheter"
                  hint="Paiement direct sur la fiche art"
                  value={theme.bouton_acheter}
                  onChange={(value) => setTextColor('bouton_acheter', value)}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md border-2 bg-white px-2.5 py-1.5 text-[10px] font-semibold"
                  style={{
                    borderColor: theme.bouton_ajouter_panier,
                    color: theme.bouton_ajouter_panier,
                  }}
                >
                  Ajouter au panier
                </span>
                <span
                  className="rounded-md border-2 bg-white px-3 py-2 text-[11px] font-semibold"
                  style={{
                    borderColor: theme.bouton_acheter,
                    color: theme.bouton_acheter,
                  }}
                >
                  Acheter
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer le panier'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
