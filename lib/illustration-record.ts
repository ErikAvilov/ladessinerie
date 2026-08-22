import type { IllustrationSize } from '@/lib/supabase'

export type IllustrationFormValues = {
  title: string
  altText: string
  category: 'particulier' | 'pro'
  subcategory: string
  sizes: IllustrationSize[]
  image_url: string
}

export function buildIllustrationRecord(values: IllustrationFormValues) {
  return {
    title: values.title.trim(),
    alt_text: values.altText.trim() || null,
    category: values.category,
    subcategory: values.subcategory.trim() || null,
    sizes: values.sizes,
    image_url: values.image_url,
  }
}

export function formatIllustrationSaveError(message: string) {
  if (message.includes('alt_text')) {
    return (
      'La colonne « alt_text » manque dans Supabase. Ouvrez le SQL Editor et exécutez le fichier supabase/add-alt-text.sql, puis réessayez.'
    )
  }
  if (message.includes('single JSON object')) {
    return 'Supabase n’a pas pu confirmer l’enregistrement. Réessayez ou vérifiez les politiques RLS de la table illustrations.'
  }
  return message
}
