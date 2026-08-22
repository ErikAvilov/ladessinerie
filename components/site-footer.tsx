export function SiteFooter({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 py-3 md:px-10">
      {showTagline && (
        <p className="mb-2.5 text-center text-xs leading-relaxed text-foreground/50 md:text-sm">
          Illustrations uniques &amp; branding créatif pour marques et particuliers
        </p>
      )}
      <div className="flex justify-between text-xs text-foreground/50">
        <span>© 2026 La Dessinerie</span>
        <span>Mentions légales · Confidentialité</span>
      </div>
    </footer>
  )
}
