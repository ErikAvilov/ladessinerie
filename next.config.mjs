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
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
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
    ]
  },
}
export default nextConfig
