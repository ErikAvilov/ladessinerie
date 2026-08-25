'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteSlider } from '@/components/site-slider'
import { panelFromPathname } from '@/lib/site-panels'
import type { Illustration } from '@/lib/supabase'

type PanelsShellProps = {
  children: ReactNode
  initialHome: Illustration[]
  initialPro: Illustration[]
}

export function PanelsShell({
  children,
  initialHome,
  initialPro,
}: PanelsShellProps) {
  const pathname = usePathname()
  const isNestedParticulier =
    pathname.startsWith('/particulier/') && pathname !== '/particulier'

  if (isNestedParticulier) {
    return children
  }

  const panel = panelFromPathname(pathname) ?? 'home'

  return (
    <>
      <SiteSlider
        initialPanel={panel}
        initialHome={initialHome}
        initialPro={initialPro}
      />
      {/* Page RSC (ex. preloads `<link>` home) — hissés vers `<head>` par Next. */}
      {children}
    </>
  )
}
