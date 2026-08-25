import type { WheelEvent } from 'react'

/** Cible de scroll pour le pass-through molette (ex. panier flottant). */
export const SCROLL_ROOT_ATTR = 'data-scroll-root'

export function getScrollRoot(): HTMLElement {
  for (const node of document.querySelectorAll(`[${SCROLL_ROOT_ATTR}]`)) {
    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 2) {
      return node
    }
  }

  const doc = document.scrollingElement
  return doc instanceof HTMLElement ? doc : document.documentElement
}

/** Relaye la molette vers la zone scrollable sous le panier. */
export function forwardWheelToScroll(event: WheelEvent) {
  const root = getScrollRoot()
  root.scrollTop += event.deltaY
  if (event.deltaX) root.scrollLeft += event.deltaX
  event.preventDefault()
}
