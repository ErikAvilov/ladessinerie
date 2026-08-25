'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLinkStatus } from 'next/link'

type SideGateProps = {
  href: string
  side: 'left' | 'right' | 'top'
  label: string
  tone: 'grass' | 'navy'
  onNavigate?: () => void
}

function ArchedArrow({ side }: { side: 'left' | 'right' | 'top' }) {
  const transform =
    side === 'right' ? 'scaleX(-1)' : side === 'top' ? 'rotate(90deg)' : undefined

  return (
    <svg
      viewBox="0 0 72 36"
      className={
        side === 'top'
          ? 'h-7 w-14 md:h-8 md:w-16'
          : 'h-7 w-14 md:h-8 md:w-16'
      }
      aria-hidden
      style={{ transform }}
    >
      <path
        d="M64 18 C48 6 28 6 12 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M12 18 L22 12 M12 18 L22 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GatePendingPulse() {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={`link-pending-pulse ${pending ? 'link-pending-pulse--on' : ''}`}
    />
  )
}

export function SideGate({ href, side, label, tone, onNavigate }: SideGateProps) {
  const [pressed, setPressed] = useState(false)

  const content = (
    <>
      <span className="side-gate__glow" aria-hidden />
      <span className="side-gate__content">
        {side === 'right' ? (
          <>
            <span className="side-gate__label">{label}</span>
            <ArchedArrow side="right" />
          </>
        ) : side === 'top' ? (
          <>
            <ArchedArrow side="top" />
            <span className="side-gate__label">{label}</span>
          </>
        ) : (
          <>
            <ArchedArrow side="left" />
            <span className="side-gate__label">{label}</span>
          </>
        )}
      </span>
    </>
  )

  const className = [
    `side-gate side-gate--${side} side-gate--${tone}`,
    pressed ? 'side-gate--pending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (onNavigate) {
    return (
      <button
        type="button"
        aria-label={label}
        className={className}
        onPointerDown={() => setPressed(true)}
        onClick={() => {
          setPressed(true)
          onNavigate()
          // Le slide est instantané ; relâche le feedback après l’anim.
          window.setTimeout(() => setPressed(false), 420)
        }}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={`instant-link ${className}`}
      onPointerDown={() => setPressed(true)}
    >
      <GatePendingPulse />
      {content}
    </Link>
  )
}
