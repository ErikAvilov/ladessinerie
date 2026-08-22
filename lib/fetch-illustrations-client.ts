'use client'

import { supabase } from '@/lib/supabase-browser'
import type { Illustration } from '@/lib/supabase'

export async function fetchIllustrationsClient(
  category?: 'particulier' | 'pro',
): Promise<Illustration[]> {
  let query = supabase.from('illustrations').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) {
    console.error('Erreur Supabase (client):', error)
    return []
  }
  return (data as Illustration[]) ?? []
}

export function preloadIllustrationImages(illustrations: Illustration[]) {
  if (typeof window === 'undefined') return

  for (const item of illustrations) {
    if (!item.image_url) continue
    const img = new window.Image()
    img.decoding = 'async'
    img.src = item.image_url
  }
}
