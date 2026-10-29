import 'server-only'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import {
  assertPersistentStorageConfigured,
  readPublicJsonBlob,
  shouldUseBlobStorage,
  writePublicJsonBlob,
} from '@/lib/blob-storage'
import { SITE_THEME_CACHE_TAG } from '@/lib/cache-tags'
import { revalidateSiteThemeData } from '@/lib/revalidate-site-theme'
import {
  coalesceSiteTheme,
  DEFAULT_SITE_THEME,
  type SiteTheme,
} from '@/lib/site-theme-shared'

export * from '@/lib/site-theme-shared'

const THEME_PATH = path.join(process.cwd(), 'data', 'site-theme.json')
const THEME_BLOB_PATH = 'site-data/site-theme.json'

async function readLocalTheme(): Promise<Partial<SiteTheme> | null> {
  const raw = await fs.readFile(THEME_PATH, 'utf8')
  return JSON.parse(raw) as Partial<SiteTheme>
}

/** Thème Blob trop pauvre / ancien schéma → à merger + réécrire. */
function themeLooksIncomplete(row: Partial<SiteTheme> | null): boolean {
  if (!row || Object.keys(row).length === 0) return true
  return (
    !row.background_fond ||
    !row.background_traits ||
    !row.bouton_petit_portraits ||
    !row.fond_petit_portraits
  )
}

async function loadSiteThemeFromStore(): Promise<SiteTheme> {
  if (shouldUseBlobStorage()) {
    try {
      const remote = await readPublicJsonBlob<Partial<SiteTheme>>(THEME_BLOB_PATH)
      const local = await readLocalTheme().catch(() => null)

      if (!themeLooksIncomplete(remote)) {
        return coalesceSiteTheme(remote)
      }

      const merged = coalesceSiteTheme({
        ...DEFAULT_SITE_THEME,
        ...(local ?? {}),
        ...(remote ?? {}),
      })
      await writePublicJsonBlob(THEME_BLOB_PATH, merged)
      return merged
    } catch (error) {
      console.error('Lecture Blob thème — fallback local:', error)
      return coalesceSiteTheme(await readLocalTheme().catch(() => null))
    }
  }

  return coalesceSiteTheme(await readLocalTheme())
}

const getCachedSiteTheme = unstable_cache(
  async () => loadSiteThemeFromStore(),
  ['site-theme'],
  { tags: [SITE_THEME_CACHE_TAG], revalidate: 60 },
)

export const getSiteTheme = cache(async (): Promise<SiteTheme> => {
  try {
    return await getCachedSiteTheme()
  } catch (error) {
    console.error('getSiteTheme:', error)
    return coalesceSiteTheme(null)
  }
})

export async function writeSiteTheme(theme: SiteTheme): Promise<void> {
  if (shouldUseBlobStorage()) {
    await writePublicJsonBlob(THEME_BLOB_PATH, theme)
  } else {
    assertPersistentStorageConfigured()
    await fs.writeFile(THEME_PATH, `${JSON.stringify(theme, null, 2)}\n`, 'utf8')
  }
  revalidateSiteThemeData()
}
