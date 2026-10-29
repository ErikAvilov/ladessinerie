import { revalidatePath, revalidateTag } from 'next/cache'
import { ILLUSTRATIONS_CACHE_TAG } from '@/lib/cache-tags'

/** Invalide le Data Cache catalogue (Blob). */
export function revalidateIllustrationData() {
  revalidateTag(ILLUSTRATIONS_CACHE_TAG, 'max')
}

/** Invalide ISR home + hubs + catégories + fiches après mutation catalogue. */
export function revalidateIllustrationPaths(id?: string) {
  revalidateIllustrationData()
  revalidatePath('/', 'layout')
  revalidatePath('/particulier', 'layout')
  revalidatePath('/pro', 'layout')
  revalidatePath('/admin', 'layout')
  if (id) {
    revalidatePath(`/admin/${id}/edit`)
    revalidatePath(`/particulier/art/${id}`)
    revalidatePath(`/pro/projet/${id}`)
  }
}
