import Link from 'next/link'

type SideGateProps = {
  href: string
  side: 'left' | 'right'
  label: string
  tone: 'grass' | 'navy'
}

function ArchedArrow({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right'
  return (
    <svg
      viewBox="0 0 72 36"
      className="h-7 w-14 md:h-8 md:w-16"
      aria-hidden
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
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

export function SideGate({ href, side, label, tone }: SideGateProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`side-gate side-gate--${side} side-gate--${tone}`}
    >
      <span className="side-gate__glow" aria-hidden />
      <span className="side-gate__content">
        {side === 'left' ? (
          <>
            <ArchedArrow side="left" />
            <span className="side-gate__label">{label}</span>
          </>
        ) : (
          <>
            <span className="side-gate__label">{label}</span>
            <ArchedArrow side="right" />
          </>
        )}
      </span>
    </Link>
  )
}
