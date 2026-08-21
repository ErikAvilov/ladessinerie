'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useRef, type ReactNode } from 'react'

function slideX(pathname: string) {
  if (pathname.startsWith('/particulier')) return -80
  if (pathname.startsWith('/pro')) return 80
  return 0
}

function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context)

  if (!frozen.current) {
    return children
  }

  return (
    <LayoutRouterContext.Provider value={frozen.current}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const x = slideX(pathname)
  const isHome = pathname === '/'

  useEffect(() => {
    const root = document.documentElement
    if (isHome) {
      root.classList.add('no-scroll')
      document.body.classList.add('no-scroll')
    } else {
      root.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
    return () => {
      root.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
  }, [isHome])

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={pathname}
        initial={{ opacity: 0, x }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={
          isHome
            ? 'h-dvh overflow-hidden px-5 pt-24 pb-10 md:px-10'
            : 'h-dvh overflow-y-auto px-5 pb-24 pt-28 md:px-10'
        }
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.section>
    </AnimatePresence>
  )
}
