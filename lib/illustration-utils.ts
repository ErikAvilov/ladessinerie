import type { Illustration, IllustrationSize } from '@/lib/supabase'

export function formatEuro(price: number) {
  return `${price.toFixed(2).replace('.', ',')} €`
}

export function getMinPrice(sizes?: IllustrationSize[]) {
  if (!sizes?.length) return null
  return Math.min(...sizes.map((entry) => entry.price))
}

export function formatFromPrice(sizes?: IllustrationSize[]) {
  const min = getMinPrice(sizes)
  return min != null ? `À partir de ${formatEuro(min)}` : ''
}

export function parseSizeFields(
  fields: { size: string; price: string }[],
): IllustrationSize[] {
  return fields
    .filter((field) => field.size.trim() && field.price.trim())
    .map((field) => ({
      size: field.size.trim(),
      price: Number.parseFloat(field.price),
    }))
    .filter((field) => Number.isFinite(field.price) && field.price >= 0)
}

export function sizesToFields(sizes?: IllustrationSize[]) {
  if (!sizes?.length) return [{ size: '', price: '' }]
  return sizes.map((entry) => ({
    size: entry.size,
    price: String(entry.price),
  }))
}

export function illustrationPriceLabel(illustration: Illustration) {
  const min = getMinPrice(illustration.sizes)
  if (min == null) return ''
  return formatFromPrice(illustration.sizes)
}
