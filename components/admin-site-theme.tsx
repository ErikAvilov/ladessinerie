'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoutonIcon } from '@/components/bouton-icon'
import { PanierIcon } from '@/components/panier-icon'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { updateSiteTheme } from '@/lib/admin-actions'
import { PARTICULIER_CATEGORIES } from '@/lib/particulier-categories'
import {
  BOUTON_BACKGROUND_FOND,
  BOUTON_THEME_BY_SLUG,
  type BoutonThemeKey,
  type SiteTheme,
} from '@/lib/site-theme-shared'

type AdminSiteThemePanelProps = {
  initialTheme: SiteTheme
}

function ThemeColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
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

export function AdminSiteThemePanel({ initialTheme }: AdminSiteThemePanelProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<SiteTheme>(initialTheme)
  const [savingPanier, setSavingPanier] = useState(false)
  const [savingBackground, setSavingBackground] = useState(false)
  const [savingBoutons, setSavingBoutons] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function saveTheme(
    event: FormEvent,
    setSaving: (value: boolean) => void,
    successMessage: string,
  ) {
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

  return (
    <div className="mb-10 space-y-6">
      {error && (
        <p className="rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl bg-[var(--grass)]/10 px-4 py-3 text-sm text-[var(--forest)]">
          {success}
        </p>
      )}

      <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
        <h2 className="display text-xl font-semibold">Panier</h2>
        <p className="mt-1 text-sm text-foreground/55">
          Couleurs du SVG <code className="text-xs">panier.svg</code> (fond + traits).
        </p>

        <form
          onSubmit={(event) => void saveTheme(event, setSavingPanier, 'Couleurs du panier enregistrées.')}
          className="mt-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ThemeColorField
              label="Fond"
              value={theme.panier_fond}
              onChange={(value) => setTheme((current) => ({ ...current, panier_fond: value }))}
            />
            <ThemeColorField
              label="Traits"
              value={theme.panier_traits}
              onChange={(value) => setTheme((current) => ({ ...current, panier_traits: value }))}
            />
          </div>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end">
            <div className="flex h-36 w-full max-w-xs items-center justify-center rounded-xl border border-foreground/10 bg-[var(--cream)] p-4 md:h-44">
              <PanierIcon
                fond={theme.panier_fond}
                traits={theme.panier_traits}
                className="block h-32 w-44 md:h-36 md:w-52"
              />
            </div>
            <button
              type="submit"
              disabled={savingPanier}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPanier ? 'Enregistrement…' : 'Enregistrer le panier'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
        <h2 className="display text-xl font-semibold">Boutons Particulier</h2>
        <p className="mt-1 text-sm text-foreground/55">
          Couleur des traits sur <code className="text-xs">background.svg</code> (carrés blancs).
        </p>

        <form
          onSubmit={(event) =>
            void saveTheme(event, setSavingBoutons, 'Couleurs des boutons enregistrées.')
          }
          className="mt-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {PARTICULIER_CATEGORIES.map((category) => {
              const key = BOUTON_THEME_BY_SLUG[category.slug]
              const color = theme[key]
              return (
                <div
                  key={category.slug}
                  className="rounded-xl border border-foreground/10 p-4"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-foreground/10">
                      <SiteBackgroundLayer
                        className="absolute inset-0"
                        fond={color}
                        traits={BOUTON_BACKGROUND_FOND}
                      />
                      <div className="relative z-[1] flex h-full w-full items-center justify-center p-2">
                        <BoutonIcon
                          src={category.imageSrc}
                          color={color}
                          className="h-full w-full drop-shadow-[0_4px_10px_rgba(43,41,39,0.2)]"
                        />
                      </div>
                    </div>
                    <p className="display text-base font-semibold">{category.label}</p>
                  </div>
                  <ThemeColorField
                    label="Couleur"
                    value={color}
                    onChange={(value) => setBoutonColor(key, value)}
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={savingBoutons}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingBoutons ? 'Enregistrement…' : 'Enregistrer les boutons'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
        <h2 className="display text-xl font-semibold">Arrière-plan</h2>
        <p className="mt-1 text-sm text-foreground/55">
          Couleurs du SVG <code className="text-xs">background.svg</code> (fond + texture).
        </p>

        <form
          onSubmit={(event) =>
            void saveTheme(event, setSavingBackground, 'Couleurs de l’arrière-plan enregistrées.')
          }
          className="mt-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ThemeColorField
              label="Fond"
              value={theme.background_fond}
              onChange={(value) => setTheme((current) => ({ ...current, background_fond: value }))}
            />
            <ThemeColorField
              label="Traits"
              value={theme.background_traits}
              onChange={(value) => setTheme((current) => ({ ...current, background_traits: value }))}
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
              disabled={savingBackground}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingBackground ? 'Enregistrement…' : 'Enregistrer l’arrière-plan'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
