import { SiteSlider } from '@/components/site-slider'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const particulier = await getIllustrations('particulier')
  const scatter = pickHomeScatterIllustrations(particulier)

  return (
    <SiteSlider
      initialPanel="home"
      initialHome={scatter}
      initialParticulier={particulier}
    />
  )
}
