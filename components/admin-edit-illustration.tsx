'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSizeFields, type SizeField } from '@/components/admin-size-fields'
import { formatFromPrice, illustrationAlt, parseSizeFields, sizesToFields } from '@/lib/illustration-utils'
import { supabase, type Illustration } from '@/lib/supabase'

const BUCKET = 'illustrations'
const PRINT_SIZES = ['Small', 'Medium', 'Large'] as const

function storagePathFromUrl(url: string) {
  const marker = `/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

type AdminEditIllustrationProps = {
  illustration: Illustration
}

export function AdminEditIllustration({ illustration }: AdminEditIllustrationProps) {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [title, setTitle] = useState(illustration.title)
  const [altText, setAltText] = useState(illustration.alt_text ?? '')
  const [category, setCategory] = useState<'particulier' | 'pro'>(illustration.category)
  const [subcategory, setSubcategory] = useState(illustration.subcategory ?? '')
  const [sizeFields, setSizeFields] = useState<SizeField[]>(sizesToFields(illustration.sizes))
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/admin/login')
      else setCheckingSession(false)
    })
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const sizes = parseSizeFields(sizeFields)
    if (sizes.length === 0) {
      setError('Ajoutez au moins un format avec son prix.')
      return
    }

    setSubmitting(true)

    let imageUrl = illustration.image_url

    if (file) {
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

      const oldPath = storagePathFromUrl(illustration.image_url)
      if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath])

      imageUrl = supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('illustrations')
      .update({
        title,
        alt_text: altText.trim() || null,
        category,
        subcategory: subcategory.trim() || null,
        sizes,
        image_url: imageUrl,
      })
      .eq('id', illustration.id)

    setSubmitting(false)

    if (updateError) {
      setError(`Mise à jour impossible : ${updateError.message}`)
      return
    }

    setSuccess('Illustration mise à jour.')
    setFile(null)
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
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-10 md:py-12">
      <Link
        href="/admin"
        className="cursor-pointer text-sm font-medium text-[var(--forest)] transition hover:opacity-80"
      >
        ← Retour au dashboard
      </Link>

      <header className="mt-4 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
          Édition
        </p>
        <h1 className="display mt-1.5 text-2xl font-semibold text-[var(--forest)] md:text-3xl">
          {illustration.title}
        </h1>
        {formatFromPrice(illustration.sizes) && (
          <p className="mt-2 text-sm text-foreground/55">{formatFromPrice(illustration.sizes)}</p>
        )}
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

      <section className="rounded-2xl border border-foreground/10 bg-background p-5 md:p-6 paper-shadow">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
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
            <span className="mb-1.5 block text-sm font-medium">Texte alternatif (SEO / accessibilité)</span>
            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Ex. : Fresque murale colorée dans une cour d’école"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
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
              {PRINT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <AdminSizeFields fields={sizeFields} onChange={setSizeFields} />

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Image actuelle</p>
            <div className="relative mx-auto mb-4 h-56 w-40 overflow-hidden rounded-xl bg-foreground/5">
              <Image
                src={illustration.image_url}
                alt={illustrationAlt(illustration)}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>

          <label className="block cursor-pointer md:col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Remplacer l&apos;image (optionnel)</span>
            <div className="flex min-h-[3.25rem] items-center gap-3 rounded-xl border border-foreground/15 bg-background px-4 py-3 transition hover:border-foreground/25">
              <span className="shrink-0 rounded-full bg-[var(--mustard)] px-4 py-1.5 text-sm font-medium">
                Choisir un fichier
              </span>
              <span className="truncate text-sm text-foreground/55">
                {file ? file.name : 'Conserver l’image actuelle'}
              </span>
            </div>
            <input
              type="file"
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
              {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
