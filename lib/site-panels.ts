export type SitePanel = 'particulier' | 'home' | 'pro' | 'about'

export const SITE_PANELS: SitePanel[] = ['particulier', 'home', 'pro']

export const HORIZONTAL_PANELS = ['particulier', 'home', 'pro'] as const
export type HorizontalPanel = (typeof HORIZONTAL_PANELS)[number]

export const SITE_PANEL_PATH: Record<SitePanel, string> = {
  particulier: '/particulier',
  home: '/',
  pro: '/pro',
  about: '/a-propos',
}

export const SITE_PANEL_TITLE: Record<SitePanel, string> = {
  particulier: 'Tirages d’art & illustrations à accrocher — La Dessinerie',
  home: 'La Dessinerie',
  pro: 'Fresques murales & illustration sur mesure — La Dessinerie',
  about: 'Anna — La Dessinerie',
}

export function panelFromPathname(pathname: string): SitePanel | null {
  if (pathname === '/particulier') return 'particulier'
  if (pathname === '/pro') return 'pro'
  if (pathname === '/a-propos') return 'about'
  if (pathname === '/') return 'home'
  return null
}

export function isSitePanelPath(pathname: string) {
  return panelFromPathname(pathname) !== null
}

export function horizontalPanel(panel: SitePanel): HorizontalPanel {
  return panel === 'about' ? 'home' : panel
}

export function panelIndex(panel: SitePanel) {
  return HORIZONTAL_PANELS.indexOf(horizontalPanel(panel))
}
