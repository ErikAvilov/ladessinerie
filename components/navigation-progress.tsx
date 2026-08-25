'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

type NavigationProgressValue = {
  pending: boolean
  /** Déclenche le feedback tout de suite (router.push, boutons, dive…). */
  start: (href?: string) => void
}

const NavigationProgressContext = createContext<NavigationProgressValue | null>(null)

function sameDestination(href: string, pathname: string) {
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return true
    return url.pathname === pathname
  } catch {
    return true
  }
}

function isInternalNavAnchor(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      return new URL(href).origin === window.location.origin
    } catch {
      return false
    }
  }
  return href.startsWith('/')
}

function NavChrome({ pending }: { pending: boolean }) {
  return (
    <>
      <div
        className={`nav-progress ${pending ? 'nav-progress--active' : ''}`}
        aria-hidden
      >
        <span className="nav-progress__bar" />
      </div>
      <div
        className={`nav-veil ${pending ? 'nav-veil--active' : ''}`}
        aria-hidden
      />
    </>
  )
}

export function NavigationProgressProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)

  const clear = useCallback(() => setPending(false), [])

  useEffect(() => {
    clear()
  }, [pathname, clear])

  const start = useCallback(
    (href?: string) => {
      if (href && sameDestination(href, pathname)) return
      setPending(true)
    },
    [pathname],
  )

  // Feedback au clic (pas au pointerdown : le voile ne doit pas avaler le click du lien).
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (event.defaultPrevented) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isInternalNavAnchor(anchor)) return
      const href = anchor.getAttribute('href')
      if (!href) return
      start(href)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [start])

  // Sécurité : ne jamais rester bloqué en pending.
  useEffect(() => {
    if (!pending) return
    const timer = window.setTimeout(clear, 4000)
    return () => window.clearTimeout(timer)
  }, [pending, clear])

  const value = useMemo(() => ({ pending, start }), [pending, start])

  return (
    <NavigationProgressContext.Provider value={value}>
      {children}
      <NavChrome pending={pending} />
    </NavigationProgressContext.Provider>
  )
}

export function useNavigationProgress() {
  const ctx = useContext(NavigationProgressContext)
  if (!ctx) {
    return {
      pending: false,
      start: (_href?: string) => {},
    }
  }
  return ctx
}
