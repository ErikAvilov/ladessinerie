import { revalidateTag } from 'next/cache'
import { SITE_THEME_CACHE_TAG } from '@/lib/cache-tags'

export function revalidateSiteThemeData() {
  revalidateTag(SITE_THEME_CACHE_TAG, 'max')
}
