'use client'

import {
  CategoryDiveOverlay,
  DIVE_DURATION_MS,
} from '@/components/category-dive-overlay'
import type { ParticulierCategory } from '@/lib/particulier-categories'

export { DIVE_DURATION_MS }

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

type ParticulierDiveOverlayProps = {
  category: ParticulierCategory
  color: string
  fondColor: string
  from: Rect
  onComplete: () => void
}

export function ParticulierDiveOverlay({
  category,
  color,
  fondColor,
  from,
  onComplete,
}: ParticulierDiveOverlayProps) {
  return (
    <CategoryDiveOverlay
      imageSrc={category.imageSrc}
      color={color}
      fondColor={fondColor}
      from={from}
      onComplete={onComplete}
    />
  )
}
