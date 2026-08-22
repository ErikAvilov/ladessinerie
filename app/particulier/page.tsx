import { ParticulierPageClient } from '@/components/particulier-page-client'
import { getIllustrations } from '@/lib/supabase'

export default async function ParticulierPage() {
  const illustrations = await getIllustrations('particulier')
  return <ParticulierPageClient illustrations={illustrations} />
}
