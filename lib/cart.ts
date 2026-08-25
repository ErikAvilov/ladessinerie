export type CartItem = {
  key: string
  illustrationId: string
  title: string
  size: string
  price: number
  quantity: number
  image_url: string
}

export const CART_STORAGE_KEY = 'ladessinerie.cart.v1'

export function cartItemKey(illustrationId: string, size: string) {
  return `${illustrationId}-${size}`
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function mergeCartItem(
  items: CartItem[],
  incoming: CartItem,
  quantity: number,
): CartItem[] {
  const existing = items.find((entry) => entry.key === incoming.key)
  if (existing) {
    return items.map((entry) =>
      entry.key === incoming.key
        ? { ...entry, quantity: entry.quantity + quantity }
        : entry,
    )
  }
  return [...items, { ...incoming, quantity }]
}

export function readCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((entry): entry is CartItem => {
        if (!entry || typeof entry !== 'object') return false
        const item = entry as CartItem
        return (
          typeof item.key === 'string' &&
          typeof item.illustrationId === 'string' &&
          typeof item.title === 'string' &&
          typeof item.size === 'string' &&
          typeof item.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0 &&
          typeof item.image_url === 'string'
        )
      })
      .map((item) => ({
        ...item,
        quantity: Math.min(99, Math.max(1, Math.round(item.quantity))),
      }))
  } catch {
    return []
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}
