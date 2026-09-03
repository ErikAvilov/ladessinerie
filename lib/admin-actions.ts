'use server'

import { revalidatePath } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  deleteIllustrationFile,
  processIllustrationUpload,
} from '@/lib/illustration-image-process'
import {
  getIllustrationById,
  getIllustrations,
  removeIllustration,
  type Illustration,
  type IllustrationSize,
  uniqueSlug,
  upsertIllustration,
} from '@/lib/illustrations'
import { parseSiteThemeInput, writeSiteTheme, type SiteTheme } from '@/lib/site-theme'

export type IllustrationFormValues = {
  title: string
  altText: string
  category: 'particulier' | 'pro'
  subcategory: string
  sizes: IllustrationSize[]
  image?: string
  dominantColor?: string
}

function revalidateIllustrationPaths(id?: string) {
  revalidatePath('/admin')
  revalidatePath('/particulier')
  revalidatePath('/pro')
  revalidatePath('/')
  if (id) {
    revalidatePath(`/admin/${id}/edit`)
    revalidatePath(`/particulier/art/${id}`)
  }
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return 'Session expirée. Reconnectez-vous sur /admin/login.'
  }
  return null
}

export async function refreshIllustrations(): Promise<Illustration[]> {
  return getIllustrations()
}

export async function updateIllustration(
  id: string,
  values: IllustrationFormValues,
): Promise<{ error?: string }> {
  const authError = await requireAdmin()
  if (authError) return { error: authError }

  const current = await getIllustrationById(id)
  if (!current) return { error: 'Illustration introuvable.' }

  const title = values.title.trim()
  if (!title) return { error: 'Titre requis.' }

  const all = await getIllustrations()
  const next: Illustration = {
    ...current,
    title,
    slug: uniqueSlug(title, all, id),
    alt_text: values.altText.trim() || undefined,
    category: values.category,
    subcategory: values.subcategory.trim() || undefined,
    sizes: values.sizes,
    image: values.image?.trim() || current.image,
    dominantColor: values.dominantColor?.trim() || current.dominantColor,
  }

  try {
    await upsertIllustration(next)
    revalidateIllustrationPaths(id)
    return {}
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Enregistrement impossible.',
    }
  }
}

export async function updateIllustrationImage(
  id: string,
  formData: FormData,
): Promise<{ error?: string; image?: string; dominantColor?: string }> {
  const authError = await requireAdmin()
  if (authError) return { error: authError }

  const current = await getIllustrationById(id)
  if (!current) return { error: 'Illustration introuvable.' }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Image manquante.' }
  }

  try {
    const processed = await processIllustrationUpload(file, current.title)
    await deleteIllustrationFile(current.image)
    await upsertIllustration({
      ...current,
      image: processed.publicPath,
      dominantColor: processed.dominantColor,
    })
    revalidateIllustrationPaths(id)
    return {
      image: processed.publicPath,
      dominantColor: processed.dominantColor,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Traitement image impossible.',
    }
  }
}

export async function updateSiteTheme(
  input: SiteTheme,
): Promise<{ error?: string; theme?: SiteTheme }> {
  const authError = await requireAdmin()
  if (authError) return { error: authError }

  const parsed = parseSiteThemeInput(input)
  if ('error' in parsed) return { error: parsed.error }

  try {
    await writeSiteTheme(parsed)
    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/particulier')
    revalidatePath('/pro')
    revalidatePath('/a-propos')
    revalidatePath('/contact')
    revalidatePath('/panier')
    revalidatePath('/succes')
    revalidatePath('/admin')
    return { theme: parsed }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Enregistrement du theme impossible.',
    }
  }
}

export async function deleteIllustration(id: string): Promise<{ error?: string }> {
  const authError = await requireAdmin()
  if (authError) return { error: authError }

  try {
    const removed = await removeIllustration(id)
    if (!removed) return { error: 'Illustration introuvable.' }

    await deleteIllustrationFile(removed.image)
    revalidateIllustrationPaths(id)
    return {}
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Suppression impossible.',
    }
  }
}
