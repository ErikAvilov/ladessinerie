import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

/** Redirects plats → sous-dossiers (ancien catalogue Blob / caches). */
function illustrationFolderRedirects() {
  try {
    const raw = readFileSync(join(rootDir, 'data/illustrations.json'), 'utf8')
    const items = JSON.parse(raw)
    if (!Array.isArray(items)) return []

    return items.flatMap((item) => {
      const image = typeof item?.image === 'string' ? item.image : ''
      if (!image.startsWith('/illustrations/')) return []
      const relative = image.slice('/illustrations/'.length)
      const slash = relative.indexOf('/')
      if (slash <= 0) return []
      const fileName = relative.slice(slash + 1)
      if (!fileName || fileName.includes('/')) return []
      return [
        {
          source: `/illustrations/${fileName}`,
          destination: image,
          permanent: true,
        },
      ]
    })
  } catch {
    return []
  }
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Cap utile pour bulles home (~120px CSS) et miniatures — évite les 2560px+.
    imageSizes: [32, 48, 64, 72, 96, 128, 256, 360, 600],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/particulier/petit-portraits',
        destination: '/particulier/illustrations',
        permanent: true,
      },
      {
        source: '/particulier/grand-portraits',
        destination: '/particulier/personnalisees',
        permanent: true,
      },
      ...illustrationFolderRedirects(),
    ]
  },
}
export default nextConfig
