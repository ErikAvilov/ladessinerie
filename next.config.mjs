const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
