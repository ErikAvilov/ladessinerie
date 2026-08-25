'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

function PendingPulse() {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={`link-pending-pulse ${pending ? 'link-pending-pulse--on' : ''}`}
    />
  )
}

type InstantLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode
  /** Affiche un pulse sur le lien pendant la nav (défaut true). */
  showPulse?: boolean
}

/**
 * Link avec feedback immédiat (useLinkStatus) — à utiliser sur les CTA de navigation.
 * Le progress global est déjà déclenché par NavigationProgressProvider.
 */
export function InstantLink({
  children,
  className,
  showPulse = true,
  ...props
}: InstantLinkProps) {
  return (
    <Link
      {...props}
      className={['instant-link', className].filter(Boolean).join(' ')}
    >
      {showPulse ? <PendingPulse /> : null}
      {children}
    </Link>
  )
}
