import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 md:px-10">
      <Link href="/" aria-label="La Dessinerie, accueil" className="relative block h-11 w-11 md:h-12 md:w-12">
        <Image
          src="/art/logo.png"
          alt="La Dessinerie"
          fill
          className="object-contain"
          sizes="48px"
          priority
        />
      </Link>
      <a
        href="https://instagram.com"
        aria-label="Instagram"
        className="rounded-full border border-foreground/15 p-2 transition hover:bg-[var(--mustard)]"
      >
        <Camera size={18} />
      </a>
    </header>
  )
}
