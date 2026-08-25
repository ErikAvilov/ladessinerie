const STORAGE_KEY = 'ladessinerie.shopping-return.v1'
const DEFAULT_RETURN = '/particulier'

function isStorableShoppingPath(pathname: string) {
  if (!pathname.startsWith('/')) return false
  if (pathname === '/panier' || pathname === '/succes') return false
  if (pathname.startsWith('/admin')) return false
  return pathname === '/particulier' || pathname.startsWith('/particulier/')
}

/** Mémorise la dernière page boutique (hors panier). */
export function saveShoppingReturn(pathname: string) {
  if (typeof window === 'undefined') return
  if (!isStorableShoppingPath(pathname)) return
  sessionStorage.setItem(STORAGE_KEY, pathname)
}

/** URL de retour après le panier — fallback hub boutique. */
export function getShoppingReturn(): string {
  if (typeof window === 'undefined') return DEFAULT_RETURN
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved && isStorableShoppingPath(saved)) return saved
  return DEFAULT_RETURN
}

export { DEFAULT_RETURN as SHOPPING_RETURN_DEFAULT }
