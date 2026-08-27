import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { processIllustrationUpload } from '@/lib/illustration-image-process'
import {
  getIllustrations,
  type Illustration,
  type IllustrationSize,
  uniqueSlug,
  upsertIllustration,
} from '@/lib/illustrations'

export const runtime = 'nodejs'

function parseSizes(raw: FormDataEntryValue | null): IllustrationSize[] {
  if (typeof raw !== 'string' || !raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null
        const size = String((entry as { size?: unknown }).size ?? '').trim()
        const price = Number((entry as { price?: unknown }).price)
        if (!size || !Number.isFinite(price) || price < 0) return null
        return { size, price }
      })
      .filter((entry): entry is IllustrationSize => entry !== null)
  } catch {
    return []
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get('file')
  const title = String(form.get('title') ?? '').trim()
  const category = String(form.get('category') ?? '').trim()
  const subcategory = String(form.get('subcategory') ?? '').trim()
  const altText = String(form.get('alt_text') ?? '').trim()
  const sizes = parseSizes(form.get('sizes'))

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Image manquante.' }, { status: 400 })
  }
  if (!title) {
    return NextResponse.json({ error: 'Titre requis.' }, { status: 400 })
  }
  if (category !== 'particulier' && category !== 'pro') {
    return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 })
  }
  if (category === 'particulier' && sizes.length === 0) {
    return NextResponse.json(
      { error: 'Ajoutez au moins un format avec son prix.' },
      { status: 400 },
    )
  }

  const type = file.type || ''
  if (
    !/^image\/(png|jpeg|jpg|webp)$/i.test(type) &&
    !/\.(png|jpe?g|webp)$/i.test(file.name)
  ) {
    return NextResponse.json(
      { error: 'Formats acceptés : PNG, JPG ou WebP.' },
      { status: 400 },
    )
  }

  try {
    const processed = await processIllustrationUpload(file, title)
    const existing = await getIllustrations()
    const illustration: Illustration = {
      id: randomUUID(),
      title,
      slug: uniqueSlug(title, existing),
      image: processed.publicPath,
      dominantColor: processed.dominantColor,
      category,
      subcategory: subcategory || undefined,
      alt_text: altText || undefined,
      sizes,
      created_at: new Date().toISOString(),
    }

    await upsertIllustration(illustration)

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/particulier')
    revalidatePath('/pro')

    return NextResponse.json({ illustration })
  } catch (error) {
    console.error('POST /api/admin/illustrations:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Traitement image impossible.',
      },
      { status: 500 },
    )
  }
}
