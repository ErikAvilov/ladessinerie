'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

function unlockDocumentScroll() {
  document.documentElement.classList.remove('no-scroll')
  document.body.classList.remove('no-scroll')
}

/** Admin : scroll document natif, sans piège overflow du shell boutique. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    unlockDocumentScroll()
    return unlockDocumentScroll
  }, [pathname])

  return <div className="min-h-dvh bg-background">{children}</div>
}
