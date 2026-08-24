'use client'

import Link from 'next/link'
import { Camera } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSitePanel } from '@/components/site-panel-context'

export function SiteHeader() {
  const sitePanel = useSitePanel()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined

    void import('@/lib/supabase-browser').then(({ supabase }) => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session)
      })

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
      })

      subscription = authSubscription
    })

    return () => subscription?.unsubscribe()
  }, [])

  const brandClassName =
    'pointer-events-auto display text-lg font-semibold uppercase tracking-[0.04em] text-[var(--forest)] md:text-xl'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between py-4">
      <div className="px-5 md:px-10">
        {sitePanel ? (
          <button
            type="button"
            aria-label="La Dessinerie, accueil"
            className={brandClassName}
            onClick={() => sitePanel.goTo('home')}
          >
            La Dessinerie
          </button>
        ) : (
          <Link href="/" aria-label="La Dessinerie, accueil" className={brandClassName}>
            La Dessinerie
          </Link>
        )}
      </div>

      <div className="flex gap-2 px-5 md:px-10">
        {isAuthenticated && (
          <Link
            href="/admin"
            className="pointer-events-auto cursor-pointer rounded-full border border-foreground/15 bg-background/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--forest)] backdrop-blur-sm transition hover:border-[var(--forest)] md:text-sm"
          >
            Admin
          </Link>
        )}
        <a
          href="https://instagram.com"
          aria-label="Instagram"
          className="pointer-events-auto cursor-pointer rounded-full border border-foreground/15 bg-background/70 p-2 backdrop-blur-sm transition hover:bg-[var(--mustard)]"
        >
          <Camera size={18} />
        </a>
      </div>
    </header>
  )
}
