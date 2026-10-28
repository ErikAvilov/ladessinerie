import type { ParticulierCategorySlug } from '@/lib/particulier-categories'

export type ParticulierCategoryContent = {
  headline: string
  intro: string
  deliverablesTitle: string
  deliverables: string[]
  stepsTitle: string
  steps: { number: number; text: string }[]
  pricing: string
  delay: string
  ctaLabel: string
  /** Lien CTA — ici /pro/contact pour le sur-mesure. */
  ctaHref: string
  seoDescription: string
}

const PERSONNALISEES_CONTENT: ParticulierCategoryContent = {
  headline: 'Un cadeau dessiné rien que pour eux',
  intro:
    'Un anniversaire, une naissance, un mariage, un couple, une famille, un animal adoré : je transforme vos souvenirs en illustration originale, imaginée pour la personne à qui vous l’offrez.',
  deliverablesTitle: 'Ce que vous recevrez',
  deliverables: [
    'Une illustration originale en couleur, par exemple : un portrait de famille ou de couple, un cadeau de naissance ou de mariage, une scène de vie, un voyage ou un lieu qui compte pour vous, ou encore votre maison.',
    'L’illustration en version numérique et en version imprimée.',
  ],
  stepsTitle: 'Comment ça se passe',
  steps: [
    {
      number: 1,
      text: 'Un court échange pour définir les éléments que vous souhaitez voir apparaître, avec quelques photos si nécessaire.',
    },
    {
      number: 2,
      text: 'Un croquis proposé pour validation.',
    },
    {
      number: 3,
      text: 'La finalisation de l’illustration en couleur.',
    },
    {
      number: 4,
      text: 'La livraison en version numérique et imprimée sous 1 semaine.',
    },
  ],
  pricing: 'À partir de 80 €',
  delay: 'Délai : à commander 4 semaines avant la date du cadeau',
  ctaLabel: 'Me raconter votre projet',
  ctaHref: '/pro/contact',
  seoDescription:
    'Illustration sur mesure : portraits, famille, naissance, mariage… À partir de 80 € — La Dessinerie.',
}

const PARTICULIER_CONTENT: Partial<
  Record<ParticulierCategorySlug, ParticulierCategoryContent>
> = {
  personnalisees: PERSONNALISEES_CONTENT,
}

export function getParticulierCategoryContent(
  slug: ParticulierCategorySlug,
): ParticulierCategoryContent | undefined {
  return PARTICULIER_CONTENT[slug]
}
