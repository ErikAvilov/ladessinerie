import { ProPageClient } from '@/components/pro-page-client'
import { getIllustrations } from '@/lib/supabase'

export default async function ProPage() {
  const illustrations = await getIllustrations('pro')
  return <ProPageClient illustrations={illustrations} />
}
