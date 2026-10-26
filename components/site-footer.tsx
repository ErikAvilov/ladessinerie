export function SiteFooter({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 py-2.5 md:px-10 md:py-3">
      {showTagline && (
        <p className="mb-2.5 text-center text-xs leading-relaxed text-foreground/50 md:text-sm">
          Illustrations uniques &amp; branding créatif pour marques et particuliers
        </p>
      )}
      <div className="pointer-events-auto flex justify-between gap-3 text-[10px] text-foreground/50 md:text-xs">
        <span>© 2026 La Dessinerie</span>
        <span className="truncate text-right">Mentions légales · Confidentialité</span>
      </div>
    </footer>
  )
}
