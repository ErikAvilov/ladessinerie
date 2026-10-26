'use client'

import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const ADMIN_CREAM = '#faf6ee'

function unlockDocumentScroll() {
  document.documentElement.classList.remove('no-scroll')
  document.body.classList.remove('no-scroll')
}

/** Admin : scroll document natif + fond neutre (jamais la couleur boutique). */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    unlockDocumentScroll()
    return unlockDocumentScroll
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement
    const previousCream = root.style.getPropertyValue('--cream')
    root.style.setProperty('--cream', ADMIN_CREAM)
    root.dataset.adminSurface = 'true'
    return () => {
      if (previousCream) root.style.setProperty('--cream', previousCream)
      else root.style.removeProperty('--cream')
      delete root.dataset.adminSurface
    }
  }, [])

  return (
    <div
      className="min-h-dvh"
      style={
        {
          backgroundColor: ADMIN_CREAM,
          '--cream': ADMIN_CREAM,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
