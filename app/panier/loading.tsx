import { PanierSkeleton } from '@/components/perf-skeleton'

export default function PanierLoading() {
  return (
    <div className="min-h-dvh bg-background px-4 pb-16 pt-28 md:px-10">
      <PanierSkeleton />
    </div>
  )
}
