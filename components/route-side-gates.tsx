'use client'

import { SideGate } from '@/components/side-gate'

type Panel = 'home' | 'particulier' | 'pro'

export function RouteSideGates({ panel }: { panel: Panel }) {
  if (panel === 'home') {
    return (
      <>
        <SideGate href="/particulier" side="left" label="Particulier" tone="grass" />
        <SideGate href="/pro" side="right" label="Pro" tone="navy" />
      </>
    )
  }

  if (panel === 'particulier') {
    return <SideGate href="/" side="right" label="Accueil" tone="navy" />
  }

  return <SideGate href="/" side="left" label="Accueil" tone="grass" />
}
