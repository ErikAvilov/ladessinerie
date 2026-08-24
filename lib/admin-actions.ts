'use server'

import { revalidatePath } from 'next/cache'
import {
  buildIllustrationRecord,
  formatIllustrationSaveError,
  type IllustrationFormValues,
} from '@/lib/illustration-record'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getIllustrations, type Illustration } from '@/lib/supabase'
import { parseSiteThemeInput, type SiteTheme } from '@/lib/site-theme'

const RLS_FIX_HINT =
  'Les droits Supabase bloquent l’écriture. Exécute le SQL affiché ci-dessous (ou le fichier supabase/rls-illustrations.sql), puis déconnecte/reconnecte-toi sur /admin.'

async function requireAdminSupabase() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase: null, error: 'Session expirée. Reconnectez-vous sur /admin/login.' as const }
  }

  return { supabase, error: null }
}

function revalidateIllustrationPaths(id?: string) {
  revalidatePath('/admin')
  revalidatePath('/particulier')
  revalidatePath('/')
  if (id) {
    revalidatePath(`/admin/${id}/edit`)
    revalidatePath(`/particulier/art/${id}`)
  }
}

export async function refreshIllustrations(): Promise<Illustration[]> {
  return getIllustrations()
}

export async function updateIllustration(
  id: string,
  values: IllustrationFormValues,
): Promise<{ error?: string }> {
  const { supabase, error: authError } = await requireAdminSupabase()
  if (!supabase) return { error: authError ?? 'Non authentifié.' }

  const payload = buildIllustrationRecord(values)

  // select('id') force PostgREST à renvoyer les lignes réellement mises à jour
  // (0 ligne = RLS / droits, même sans message d'erreur)
  const { data, error } = await supabase
    .from('illustrations')
    .update(payload)
    .eq('id', id)
    .select('id')

  if (error) {
    return { error: formatIllustrationSaveError(error.message) }
  }

  if (!data?.length) {
    return { error: RLS_FIX_HINT }
  }

  revalidateIllustrationPaths(id)
  return {}
}

export async function insertIllustration(
  values: IllustrationFormValues,
): Promise<{ error?: string }> {
  const { supabase, error: authError } = await requireAdminSupabase()
  if (!supabase) return { error: authError ?? 'Non authentifié.' }

  const payload = buildIllustrationRecord(values)

  const { data, error } = await supabase.from('illustrations').insert(payload).select('id')

  if (error) {
    return { error: formatIllustrationSaveError(error.message) }
  }

  if (!data?.length) {
    return { error: RLS_FIX_HINT }
  }

  revalidateIllustrationPaths()
  return {}
}

export async function updateSiteTheme(
  input: SiteTheme,
): Promise<{ error?: string; theme?: SiteTheme }> {
  const { supabase, error: authError } = await requireAdminSupabase()
  if (!supabase) return { error: authError ?? 'Non authentifié.' }

  const parsed = parseSiteThemeInput(input)
  if ('error' in parsed) return { error: parsed.error }

  const { data, error } = await supabase
    .from('site_theme')
    .update({
      panier_fond: parsed.panier_fond,
      panier_traits: parsed.panier_traits,
      background_fond: parsed.background_fond,
      background_traits: parsed.background_traits,
      bouton_petit_portraits: parsed.bouton_petit_portraits,
      bouton_grand_portraits: parsed.bouton_grand_portraits,
      bouton_stickers: parsed.bouton_stickers,
      bouton_milklab: parsed.bouton_milklab,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
    .select(
      'panier_fond, panier_traits, background_fond, background_traits, bouton_petit_portraits, bouton_grand_portraits, bouton_stickers, bouton_milklab',
    )

  if (error) {
    const missingColumn =
      /bouton_|column|schema/i.test(error.message) || error.code === 'PGRST204'
    return {
      error: missingColumn
        ? 'Colonnes boutons manquantes. Exécute supabase/site-theme-boutons.sql dans Supabase, puis reconnecte-toi.'
        : error.message,
    }
  }

  if (!data?.length) {
    return {
      error:
        'Mise à jour impossible. Exécute supabase/site-theme-boutons.sql dans Supabase, puis reconnecte-toi.',
    }
  }

  revalidatePath('/')
  revalidatePath('/particulier')
  revalidatePath('/pro')
  revalidatePath('/a-propos')
  revalidatePath('/admin')

  return { theme: parsed }
}

export async function deleteIllustration(id: string): Promise<{ error?: string }> {
  const { supabase, error: authError } = await requireAdminSupabase()
  if (!supabase) return { error: authError ?? 'Non authentifié.' }

  const { data, error } = await supabase
    .from('illustrations')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) {
    return { error: error.message }
  }

  if (!data?.length) {
    return { error: RLS_FIX_HINT }
  }

  revalidateIllustrationPaths(id)
  return {}
}
