'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSiteThemePanel } from '@/components/admin-site-theme'
import { AdminSizeFields, type SizeField } from '@/components/admin-size-fields'
import { deleteIllustration, insertIllustration, refreshIllustrations } from '@/lib/admin-actions'
import {
  formatFromPrice,
  getMinPrice,
  illustrationAlt,
  parseSizeFields,
} from '@/lib/illustration-utils'
import { supabase } from '@/lib/supabase-browser'
import type { Illustration } from '@/lib/supabase'
import type { SiteTheme } from '@/lib/site-theme'

const BUCKET = 'illustrations'
const SUBCATEGORIES = [
  'Illustrations personnalisées',
  'Stickers',
  'Milklab',
  'Petit portraits',
  'Grand portraits',
  'Fleurs',
  'Canapé',
  'Autour de la nourriture',
] as const

type SortOption = 'date-desc' | 'date-asc' | 'price-asc' | 'price-desc'

function storagePathFromUrl(url: string) {
  const marker = `/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

type AdminDashboardProps = {
  initialIllustrations: Illustration[]
  initialTheme: SiteTheme
}

export function AdminDashboard({ initialIllustrations, initialTheme }: AdminDashboardProps) {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)
  const [illustrations, setIllustrations] = useState<Illustration[]>(initialIllustrations)
  const [loadingList, setLoadingList] = useState(initialIllustrations.length === 0)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Illustration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [category, setCategory] = useState<'particulier' | 'pro'>('particulier')
  const [subcategory, setSubcategory] = useState('')
  const [sizeFields, setSizeFields] = useState<SizeField[]>([{ size: '', price: '' }])
  const [file, setFile] = useState<File | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')

  const loadIllustrations = useCallback(async () => {
    setLoadingList(true)
    try {
      const data = await refreshIllustrations()
      setIllustrations(data)
    } catch {
      setError('Impossible de charger les illustrations.')
    }
    setLoadingList(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login')
        return
      }
      setCheckingSession(false)
    })
  }, [router])

  useEffect(() => {
    if (checkingSession) return
    void loadIllustrations()
  }, [checkingSession, loadIllustrations])

  useEffect(() => {
    if (!pendingDelete) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPendingDelete(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pendingDelete])

  const subcategoryOptions = useMemo(() => {
    const fromData = illustrations
      .map((item) => item.subcategory)
      .filter((value): value is string => Boolean(value))
    return [...new Set([...SUBCATEGORIES, ...fromData])]
  }, [illustrations])

  const filteredIllustrations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = illustrations.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.alt_text?.toLowerCase().includes(query) ?? false) ||
        (item.subcategory?.toLowerCase().includes(query) ?? false)

      const matchesSubcategory =
        filterSubcategory === 'all' ||
        (filterSubcategory === 'none'
          ? !item.subcategory
          : item.subcategory === filterSubcategory)

      return matchesSearch && matchesSubcategory
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date-asc' || sortBy === 'date-desc') {
        const aTime = new Date(a.created_at).getTime()
        const bTime = new Date(b.created_at).getTime()
        return sortBy === 'date-desc' ? bTime - aTime : aTime - bTime
      }

      const aPrice = getMinPrice(a.sizes) ?? Number.POSITIVE_INFINITY
      const bPrice = getMinPrice(b.sizes) ?? Number.POSITIVE_INFINITY
      return sortBy === 'price-asc' ? aPrice - bPrice : bPrice - aPrice
    })
  }, [illustrations, searchQuery, filterSubcategory, sortBy])

  const hasActiveFilters =
    searchQuery.trim() !== '' || filterSubcategory !== 'all' || sortBy !== 'date-desc'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!file) {
      setError('Choisissez une image à uploader.')
      return
    }

    const sizes = parseSizeFields(sizeFields)
    if (sizes.length === 0) {
      setError('Ajoutez au moins un format avec son prix.')
      return
    }

    setSubmitting(true)

    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      setSubmitting(false)
      setError(`Upload impossible : ${uploadError.message}`)
      return
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

    const result = await insertIllustration({
      title,
      altText,
      category,
      subcategory,
      sizes,
      image_url: publicData.publicUrl,
    })

    setSubmitting(false)

    if (result.error) {
      await supabase.storage.from(BUCKET).remove([filePath])
      setError(`Enregistrement impossible : ${result.error}`)
      return
    }

    setTitle('')
    setAltText('')
    setCategory('particulier')
    setSubcategory('')
    setSizeFields([{ size: '', price: '' }])
    setFile(null)
    setSuccess('Illustration ajoutée.')
    await loadIllustrations()
    router.refresh()
  }

  async function confirmDelete() {
    if (!pendingDelete) return

    const illustration = pendingDelete
    setPendingDelete(null)
    setDeletingId(illustration.id)
    setError(null)
    setSuccess(null)

    const storagePath = storagePathFromUrl(illustration.image_url)
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath])
    }

    const result = await deleteIllustration(illustration.id)

    setDeletingId(null)

    if (result.error) {
      setError(`Suppression impossible : ${result.error}`)
      return
    }

    setSuccess('Illustration supprimée.')
    await loadIllustrations()
    router.refresh()
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5">
        <p className="text-sm text-foreground/50">Vérification de la session…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-10 md:py-12">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
            La Dessinerie
          </p>
          <h1 className="display mt-1.5 text-2xl font-semibold text-[var(--forest)] md:text-3xl">
            Dashboard admin
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="cursor-pointer rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          >
            Voir le site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium transition hover:border-[var(--terracotta)] hover:text-[var(--terracotta)]"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {error && (
        <p className="mb-6 rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-6 rounded-xl bg-[var(--grass)]/10 px-4 py-3 text-sm text-[var(--forest)]">
          {success}
        </p>
      )}

      <AdminSiteThemePanel initialTheme={initialTheme} />

      <section className="mb-10 rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
        <h2 className="display text-xl font-semibold">Ajouter une illustration</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Titre</span>
            <input
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">
              Texte alternatif (SEO / accessibilité)
            </span>
            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Ex. : Illustration aquarelle d’une cafetière fleurie sur fond crème"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
            <span className="mt-1.5 block text-xs text-foreground/50">
              Décrit l&apos;image pour les lecteurs d&apos;écran et les moteurs de recherche. Si vide,
              le titre sera utilisé.
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Catégorie</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'particulier' | 'pro')}
              className="w-full cursor-pointer rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            >
              <option value="particulier">Particulier</option>
              <option value="pro">Pro</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Sous-catégorie</span>
            <select
              value={subcategory}
              onChange={(event) => setSubcategory(event.target.value)}
              className="w-full cursor-pointer rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            >
              <option value="">— Choisir —</option>
              {SUBCATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <AdminSizeFields fields={sizeFields} onChange={setSizeFields} />

          <label className="block cursor-pointer md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Image</span>
            <div className="flex min-h-[3.25rem] items-center gap-3 rounded-xl border border-foreground/15 bg-background px-4 py-3 transition hover:border-foreground/25">
              <span className="shrink-0 rounded-full bg-[var(--mustard)] px-4 py-1.5 text-sm font-medium">
                Choisir un fichier
              </span>
              <span className="truncate text-sm text-foreground/55">
                {file ? file.name : 'Aucun fichier sélectionné'}
              </span>
            </div>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Ajout en cours…' : 'Ajouter'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display text-xl font-semibold">Illustrations existantes</h2>
            <p className="mt-1 text-sm text-foreground/50">
              {loadingList
                ? 'Chargement…'
                : `${filteredIllustrations.length} résultat${filteredIllustrations.length > 1 ? 's' : ''}${
                    hasActiveFilters ? ` sur ${illustrations.length}` : ''
                  }`}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setFilterSubcategory('all')
                setSortBy('date-desc')
              }}
              className="cursor-pointer self-start text-sm font-medium text-[var(--forest)] underline-offset-2 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground/50">
              Recherche
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Titre, alt text, sous-catégorie…"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[var(--terracotta)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground/50">
              Sous-catégorie
            </span>
            <select
              value={filterSubcategory}
              onChange={(event) => setFilterSubcategory(event.target.value)}
              className="w-full cursor-pointer rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[var(--terracotta)]"
            >
              <option value="all">Toutes</option>
              <option value="none">Sans sous-catégorie</option>
              {subcategoryOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground/50">
              Trier par
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full cursor-pointer rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition focus:border-[var(--terracotta)]"
            >
              <option value="date-desc">Date · plus récentes</option>
              <option value="date-asc">Date · plus anciennes</option>
              <option value="price-asc">Prix · croissant</option>
              <option value="price-desc">Prix · décroissant</option>
            </select>
          </label>
        </div>

        {loadingList ? (
          <p className="mt-4 text-sm text-foreground/50">Chargement…</p>
        ) : illustrations.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/50">Aucune illustration pour le moment.</p>
        ) : filteredIllustrations.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/50">
            Aucune illustration ne correspond à ces critères.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredIllustrations.map((illustration) => (
              <li
                key={illustration.id}
                className="overflow-hidden rounded-xl border border-foreground/10 bg-background paper-shadow"
              >
                <Link
                  href={`/admin/${illustration.id}/edit`}
                  className="block cursor-pointer transition hover:bg-foreground/[0.02]"
                >
                  <div className="relative mx-auto h-36 w-24 bg-foreground/5 sm:h-40 sm:w-28">
                    <Image
                      src={illustration.image_url}
                      alt={illustrationAlt(illustration)}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="space-y-1.5 p-3">
                    <h3 className="truncate text-sm font-semibold">{illustration.title}</h3>
                    <p className="text-xs text-foreground/55">
                      {illustration.category}
                      {illustration.subcategory ? ` · ${illustration.subcategory}` : ''}
                      {formatFromPrice(illustration.sizes)
                        ? ` · ${formatFromPrice(illustration.sizes)}`
                        : ''}
                    </p>
                    <span className="text-xs font-medium text-[var(--forest)]">Modifier →</span>
                  </div>
                </Link>
                <div className="border-t border-foreground/10 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setPendingDelete(illustration)}
                    disabled={deletingId === illustration.id}
                    className="cursor-pointer text-sm font-medium text-[var(--terracotta)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === illustration.id ? 'Suppression…' : 'Supprimer'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-5 backdrop-blur-[2px]"
          onClick={() => setPendingDelete(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-6 paper-shadow"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
              Confirmation
            </p>
            <h3 id="delete-modal-title" className="display mt-2 text-2xl font-semibold">
              Supprimer cette illustration ?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60">
              « {pendingDelete.title} » sera définitivement retirée de la boutique et du portfolio.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="cursor-pointer rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium transition hover:border-foreground/30"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                className="cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
