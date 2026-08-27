import { cache } from 'react'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations, type Illustration } from '@/lib/illustrations'

export type PanelsIllustrations = {
  home: Illustration[]
  particulier: Illustration[]
  pro: Illustration[]
}

/**
 * Données panels (SSR). `cache()` = un seul tirage aléatoire home par requête.
 */
export const getPanelsIllustrations = cache(async (): Promise<PanelsIllustrations> => {
  const [particulier, pro] = await Promise.all([
    getIllustrations('particulier'),
    getIllustrations('pro'),
  ])

  return {
    home: pickHomeScatterIllustrations(particulier),
    particulier,
    pro,
  }
})
