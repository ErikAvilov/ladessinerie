import { createClient } from '@supabase/supabase-js'

export type IllustrationSize = {
  size: string
  price: number
}

export type Illustration = {
  id: string
  title: string
  alt_text?: string
  category: 'particulier' | 'pro'
  subcategory?: string
  image_url: string
  sizes?: IllustrationSize[]
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
  )
}

/** Lectures publiques côté serveur (pages vitrine). */
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

export async function getIllustrations(category?: 'particulier' | 'pro'): Promise<Illustration[]> {
  let query = supabaseAnon.from('illustrations').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) {
    console.error('Erreur Supabase:', error)
    return []
  }
  return (data as Illustration[]) ?? []
}

export async function getIllustrationById(id: string): Promise<Illustration | null> {
  const { data, error } = await supabaseAnon
    .from('illustrations')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    console.error('Erreur Supabase:', error)
    return null
  }
  return data as Illustration
}
