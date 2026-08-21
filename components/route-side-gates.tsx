'use client'

import { usePathname } from 'next/navigation'
import { SideGate } from '@/components/side-gate'

export function RouteSideGates() {
  const pathname = usePathname()

  if (pathname === '/') {
    return (
      <>
        <SideGate href="/particulier" side="left" label="Particulier" tone="grass" />
        <SideGate href="/pro" side="right" label="Pro" tone="navy" />
      </>
    )
  }

  if (pathname.startsWith('/particulier')) {
    return <SideGate href="/" side="right" label="Accueil" tone="navy" />
  }

  if (pathname.startsWith('/pro')) {
    return <SideGate href="/" side="left" label="Accueil" tone="grass" />
  }

  return null
}
