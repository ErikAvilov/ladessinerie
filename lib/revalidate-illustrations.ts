import { revalidatePath } from 'next/cache'

/** Invalide ISR home + hubs + catégories + fiches après mutation catalogue. */
export function revalidateIllustrationPaths(id?: string) {
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
