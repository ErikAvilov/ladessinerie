import { HomePageClient } from '@/components/home-page-client'
import { getIllustrations } from '@/lib/supabase'

export default async function HomePage() {
  const illustrations = await getIllustrations()
  return <HomePageClient illustrations={illustrations} />
}
