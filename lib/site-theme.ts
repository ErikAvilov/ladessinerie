import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'
import {
  assertPersistentStorageConfigured,
  readPublicJsonBlob,
  shouldUseBlobStorage,
  writePublicJsonBlob,
} from '@/lib/blob-storage'
import {
  coalesceSiteTheme,
  type SiteTheme,
} from '@/lib/site-theme-shared'

export * from '@/lib/site-theme-shared'

const THEME_PATH = path.join(process.cwd(), 'data', 'site-theme.json')
const THEME_BLOB_PATH = 'site-data/site-theme.json'

async function readLocalTheme(): Promise<Partial<SiteTheme> | null> {
  const raw = await fs.readFile(THEME_PATH, 'utf8')
  return JSON.parse(raw) as Partial<SiteTheme>
}

export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    if (shouldUseBlobStorage()) {
      const remote = await readPublicJsonBlob<Partial<SiteTheme>>(THEME_BLOB_PATH)
      if (remote !== null) return coalesceSiteTheme(remote)

      // Premier démarrage : seed depuis le thème embarqué au build.
      const local = await readLocalTheme().catch(() => null)
      if (local) {
        const theme = coalesceSiteTheme(local)
        await writePublicJsonBlob(THEME_BLOB_PATH, theme)
        return theme
      }
      return coalesceSiteTheme(null)
    }

    return coalesceSiteTheme(await readLocalTheme())
  } catch (error) {
    console.error('getSiteTheme:', error)
    return coalesceSiteTheme(null)
  }
}

export async function writeSiteTheme(theme: SiteTheme): Promise<void> {
  if (shouldUseBlobStorage()) {
    await writePublicJsonBlob(THEME_BLOB_PATH, theme)
    return
  }

  assertPersistentStorageConfigured()
  await fs.writeFile(THEME_PATH, `${JSON.stringify(theme, null, 2)}\n`, 'utf8')
}
