export default function ProjectLoading() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl animate-pulse flex-col gap-4 self-center">
      <div className="h-6 w-20 rounded-lg bg-foreground/10" />
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <div className="min-h-[40vh] flex-1 rounded-2xl bg-foreground/5" />
        <div className="h-48 w-full shrink-0 rounded-2xl bg-foreground/5 md:h-auto md:w-80" />
      </div>
    </div>
  )
}
