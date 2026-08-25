'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { saveShoppingReturn } from '@/lib/shopping-return'

/** Met à jour la page « retour achats » pendant la navigation boutique. */
export function ShoppingReturnTracker() {
  const pathname = usePathname()

  useEffect(() => {
    saveShoppingReturn(pathname)
  }, [pathname])

  return null
}
