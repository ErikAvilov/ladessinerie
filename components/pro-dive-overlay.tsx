'use client'

import {
  CategoryDiveOverlay,
  DIVE_DURATION_MS,
} from '@/components/category-dive-overlay'
import type { ProCategory } from '@/lib/pro-categories'

export { DIVE_DURATION_MS }

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

type ProDiveOverlayProps = {
  category: ProCategory
  color: string
  fondColor: string
  from: Rect
  onComplete: () => void
}

export function ProDiveOverlay({
  category,
  color,
  fondColor,
  from,
  onComplete,
}: ProDiveOverlayProps) {
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
