import { HomePageClient } from '@/components/home-page-client'
import { getIllustrations } from '@/lib/supabase'

export const revalidate = 60

export default async function HomePage() {
  const illustrations = await getIllustrations()
  return <HomePageClient illustrations={illustrations} />
}
