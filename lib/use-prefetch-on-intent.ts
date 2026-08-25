'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

const prefetched = new Set<string>()

/** Prefetch route on pointer intent (hover / focus) — une seule fois par href. */
export function usePrefetchOnIntent() {
  const router = useRouter()
  const timerRef = useRef<number | undefined>(undefined)

  const prefetch = useCallback(
    (href: string) => {
      if (!href || prefetched.has(href)) return
      prefetched.add(href)
      router.prefetch(href)
    },
    [router],
  )

  const onIntent = useCallback(
    (href: string) => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current)
      // Léger délai : ignore un survol accidentel de 40ms.
      timerRef.current = window.setTimeout(() => prefetch(href), 40)
    },
    [prefetch],
  )

  const cancelIntent = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  return { prefetch, onIntent, cancelIntent }
}
