'use server'

import { getIllustrations, type Illustration } from '@/lib/supabase'

export async function refreshIllustrations(): Promise<Illustration[]> {
  return getIllustrations()
}
