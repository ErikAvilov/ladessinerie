export type SitePanel = 'particulier' | 'home' | 'pro'

export const SITE_PANELS: SitePanel[] = ['particulier', 'home', 'pro']

export const SITE_PANEL_PATH: Record<SitePanel, string> = {
  particulier: '/particulier',
  home: '/',
  pro: '/pro',
}

export const SITE_PANEL_TITLE: Record<SitePanel, string> = {
  particulier: 'Tirages d’art & illustrations à accrocher — La Dessinerie',
  home: 'La Dessinerie',
  pro: 'Fresques murales & illustration sur mesure — La Dessinerie',
}

export function panelFromPathname(pathname: string): SitePanel | null {
  if (pathname === '/particulier') return 'particulier'
  if (pathname === '/pro') return 'pro'
  if (pathname === '/') return 'home'
  return null
}

export function isSitePanelPath(pathname: string) {
  return panelFromPathname(pathname) !== null
}

export function panelIndex(panel: SitePanel) {
  return SITE_PANELS.indexOf(panel)
}
