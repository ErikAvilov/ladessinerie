/** Blocs squelette / shimmer réutilisables — illusions de perf. */

type ShimmerProps = {
  className?: string
  rounded?: 'none' | 'md' | 'lg' | 'xl' | 'full'
}

const ROUND = {
  none: '',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const

export function Shimmer({ className = '', rounded = 'md' }: ShimmerProps) {
  return (
    <span
      aria-hidden
      className={`image-load-shimmer block ${ROUND[rounded]} ${className}`}
    />
  )
}

/** Grille collection — miroir du layout réel. */
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-6xl flex-col pb-40 md:pb-52"
      aria-busy
      aria-label="Chargement de la collection"
    >
      <header className="shrink-0 rounded-xl bg-white/92 px-3 py-2.5 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-4 md:py-3">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="mt-3 h-2 w-16" />
        <Shimmer className="mt-2 h-7 w-48 md:h-8 md:w-56" />
      </header>

      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:mt-6 md:gap-x-5 md:gap-y-6">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl bg-white/92 p-2 shadow-[0_3px_12px_rgba(43,41,39,0.07)] md:p-2.5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Shimmer className="aspect-[5/6] w-full" rounded="lg" />
            <Shimmer className="mt-2 h-2.5 w-3/4 max-w-[8rem]" />
            <Shimmer className="mt-1.5 h-2 w-12" />
            <div className="mt-2 flex gap-1">
              <Shimmer className="h-5 w-10" rounded="full" />
              <Shimmer className="h-5 w-10" rounded="full" />
            </div>
            <Shimmer className="mt-2 h-6 w-full" rounded="full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Fiche art — miroir du split image / panneau. */
export function ArtDetailSkeleton() {
  return (
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col"
      aria-busy
      aria-label="Chargement de l’illustration"
    >
      <Shimmer className="h-6 w-20 self-start" rounded="lg" />
      <div className="mt-1.5 flex min-h-0 flex-1 overflow-hidden rounded-2xl bg-white/92 shadow-[0_4px_18px_rgba(43,41,39,0.08)]">
        <div className="grid min-h-0 w-full flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
          <Shimmer className="min-h-[42dvh] w-full md:min-h-0 md:h-full" rounded="none" />
          <div className="flex flex-col justify-center gap-3 border-t border-foreground/5 px-4 py-4 md:border-l md:border-t-0">
            <Shimmer className="h-2 w-20" />
            <Shimmer className="h-5 w-40" />
            <Shimmer className="h-2 w-28" />
            <div className="mt-2 flex gap-1.5">
              <Shimmer className="h-7 w-14" rounded="full" />
              <Shimmer className="h-7 w-14" rounded="full" />
              <Shimmer className="h-7 w-14" rounded="full" />
            </div>
            <Shimmer className="mt-1 h-9 w-full" rounded="full" />
            <Shimmer className="h-9 w-full" rounded="full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PanierSkeleton() {
  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-3xl flex-col pb-10"
      aria-busy
      aria-label="Chargement du panier"
    >
      <Shimmer className="h-2.5 w-16" />
      <Shimmer className="mt-3 h-9 w-48 md:h-12 md:w-64" />
      <Shimmer className="mt-3 h-3 w-56" />
      <ul className="mt-8 space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-foreground/10 bg-background/70 p-3 md:p-4"
          >
            <Shimmer className="size-20 shrink-0 md:size-24" rounded="xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
              <Shimmer className="h-3 w-2/3 max-w-[12rem]" />
              <Shimmer className="h-2.5 w-24" />
              <Shimmer className="mt-auto h-7 w-28" rounded="full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
