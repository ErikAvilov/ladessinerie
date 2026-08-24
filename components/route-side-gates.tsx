'use client'

import { SideGate } from '@/components/side-gate'
import type { SitePanel } from '@/lib/site-panels'

type RouteSideGatesProps = {
  panel: SitePanel
  onNavigate?: (panel: SitePanel) => void
}

export function RouteSideGates({ panel, onNavigate }: RouteSideGatesProps) {
  if (panel === 'about') {
    return (
      <SideGate
        href="/"
        side="top"
        label="Accueil"
        tone="grass"
        onNavigate={onNavigate ? () => onNavigate('home') : undefined}
      />
    )
  }

  if (panel === 'home') {
    return (
      <>
        <SideGate
          href="/particulier"
          side="left"
          label="Particulier"
          tone="grass"
          onNavigate={onNavigate ? () => onNavigate('particulier') : undefined}
        />
        <SideGate
          href="/pro"
          side="right"
          label="Pro"
          tone="navy"
          onNavigate={onNavigate ? () => onNavigate('pro') : undefined}
        />
      </>
    )
  }

  if (panel === 'particulier') {
    return (
      <SideGate
        href="/"
        side="right"
        label="Accueil"
        tone="navy"
        onNavigate={onNavigate ? () => onNavigate('home') : undefined}
      />
    )
  }

  return (
    <SideGate
      href="/"
      side="left"
      label="Accueil"
      tone="grass"
      onNavigate={onNavigate ? () => onNavigate('home') : undefined}
    />
  )
}
