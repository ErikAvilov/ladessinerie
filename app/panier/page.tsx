import type { Metadata } from 'next'
import { PanierPageClient } from '@/components/panier-page-client'

export const metadata: Metadata = {
  title: 'Panier',
  description: 'Votre panier La Dessinerie — tirages, stickers et illustrations.',
  robots: { index: false, follow: false },
}

export default function PanierPage() {
  return <PanierPageClient />
}
