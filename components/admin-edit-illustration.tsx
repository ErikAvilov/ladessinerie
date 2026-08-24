'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSizeFields, type SizeField } from '@/components/admin-size-fields'
import { updateIllustration } from '@/lib/admin-actions'
import { formatFromPrice, illustrationAlt, parseSizeFields, sizesToFields } from '@/lib/illustration-utils'
import { supabase } from '@/lib/supabase-browser'
import type { Illustration } from '@/lib/supabase'

const BUCKET = 'illustrations'
const SUBCATEGORIES = [
  'Petit portraits',
  'Grand portraits',
  'Stickers',
  'Milklab',
  'Fleurs',
  'Canapé',
  'Autour de la nourriture',
] as const

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
  const [imageUrl, setImageUrl] = useState(illustration.image_url)
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

    let nextImageUrl = imageUrl

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

      nextImageUrl = supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl
    }

    const result = await updateIllustration(illustration.id, {
      title,
      altText,
      category,
      subcategory,
      sizes,
      image_url: nextImageUrl,
    })

    setSubmitting(false)

    if (result.error) {
      setError(`Mise à jour impossible : ${result.error}`)
      return
    }

    setTitle(title.trim())
    setAltText(altText.trim())
    setCategory(category)
    setSubcategory(subcategory)
    setSizeFields(sizesToFields(sizes))
    setImageUrl(nextImageUrl)

    setFile(null)
    setSuccess('Illustration mise à jour.')
    router.refresh()

    window.setTimeout(() => {
      router.push('/admin')
    }, 900)
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-5">
        <p className="text-sm text-foreground/50">Vérification de la session…</p>
      </div>
    )
  }

  const previewIllustration: Illustration = {
    ...illustration,
    title,
    alt_text: altText,
    image_url: imageUrl,
  }
  const priceLabel = formatFromPrice(parseSizeFields(sizeFields))

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
          {title}
        </h1>
        {priceLabel && (
          <p className="mt-2 text-sm text-foreground/55">{priceLabel}</p>
        )}
      </header>

      {error && (
        <div className="mb-6 space-y-3 rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
          <p>{error}</p>
          {error.includes('droits Supabase') && (
            <div className="rounded-lg bg-background/80 p-3 text-foreground/80">
              <p className="mb-2 font-medium text-foreground">SQL à exécuter dans Supabase → SQL Editor :</p>
              <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed text-foreground/70">{`GRANT SELECT ON TABLE illustrations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE illustrations TO authenticated;

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'illustrations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.illustrations', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "illustrations_select_public"
  ON public.illustrations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "illustrations_insert_authenticated"
  ON public.illustrations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "illustrations_update_authenticated"
  ON public.illustrations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "illustrations_delete_authenticated"
  ON public.illustrations FOR DELETE TO authenticated USING (true);

ALTER TABLE public.illustrations ADD COLUMN IF NOT EXISTS alt_text text;`}</pre>
            </div>
          )}
        </div>
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
              placeholder="Ex. : Illustration aquarelle d'une cafetière fleurie"
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
            <span className="mt-1.5 block text-xs text-foreground/50">
              Si vide, le titre sera utilisé sur le site.
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

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Image actuelle</p>
            <div className="relative mx-auto mb-4 h-56 w-40 overflow-hidden rounded-xl bg-foreground/5">
              <Image
                src={imageUrl}
                alt={illustrationAlt(previewIllustration)}
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

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link
              href="/admin"
              className="inline-flex cursor-pointer items-center rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition hover:border-foreground/30"
            >
              Annuler
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
