import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 grid grid-cols-4 items-center py-4">
      <div className="col-span-1 px-5 md:px-10">
        <Link
          href="/"
          aria-label="La Dessinerie, accueil"
          className="pointer-events-auto flex items-center gap-3"
        >
          <span className="relative block h-10 w-10 shrink-0 md:h-11 md:w-11">
            <Image
              src="/art/logo.png"
              alt=""
              fill
              className="object-contain"
              sizes="44px"
              priority
            />
          </span>
          <span className="display text-lg font-semibold uppercase tracking-[0.04em] text-[var(--forest)] md:text-xl">
            La Dessinerie
          </span>
        </Link>
      </div>
      <div className="col-span-2" aria-hidden />
      <div className="col-span-1 flex justify-end px-5 md:px-10">
        <a
          href="https://instagram.com"
          aria-label="Instagram"
          className="pointer-events-auto rounded-full border border-foreground/15 bg-background/70 p-2 backdrop-blur-sm transition hover:bg-[var(--mustard)]"
        >
          <Camera size={18} />
        </a>
      </div>
    </header>
  )
}
