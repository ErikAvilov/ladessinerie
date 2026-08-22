'use client'

import { createContext, useContext } from 'react'
import type { SitePanel } from '@/lib/site-panels'

export type SitePanelContextValue = {
  panel: SitePanel
  goTo: (panel: SitePanel) => void
  isSlider: true
}

export const SitePanelContext = createContext<SitePanelContextValue | null>(null)

export function useSitePanel() {
  return useContext(SitePanelContext)
}
