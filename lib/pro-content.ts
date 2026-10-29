import type { ProCategorySlug } from '@/lib/pro-categories'

export type ProCategoryCta = {
  label: string
  /** `contact` → /pro/contact ; `calendly` → URL Calendly (env). */
  kind: 'contact' | 'calendly'
}

export type ProCategoryContent = {
  headline: string
  intro: string
  deliverablesTitle: string
  deliverables: string[]
  stepsTitle: string
  steps: { number: number; text: string }[]
  pricing: string
  delay: string
  cta: ProCategoryCta
  /** Visuel d’exemple, affiché avant les livrables. */
  showcaseImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
  /** Description SEO. */
  seoDescription: string
}

const BRANDING_CONTENT: ProCategoryContent = {
  headline: 'Une identité visuelle qui vous ressemble',
  intro:
    'Vous créez votre entreprise et vous cherchez une image qui donne envie dès le premier regard ? Ou votre activité existe déjà et mérite une identité plus claire ? Dans les deux cas, je construis avec vous un univers graphique cohérent, prêt à être utilisé partout : enseigne, cartes de visite, site web, réseaux sociaux, packaging…',
  deliverablesTitle: 'Ce que vous recevrez',
  deliverables: [
    'Un logo décliné en plusieurs versions (couleur, noir et blanc, horizontal, vertical) pour s’adapter à tous vos supports.',
    'Une palette de couleurs de 3 à 5 teintes, avec leurs codes pour l’impression et l’écran.',
    'Un duo de typographies pour vos titres et vos textes.',
    'Des icônes et motifs dessinés pour votre marque.',
    'Une charte graphique qui explique les règles d’utilisation pour respecter au mieux votre identité.',
  ],
  stepsTitle: 'Comment ça se passe',
  steps: [
    {
      number: 1,
      text: 'Un échange pour comprendre votre projet, vos valeurs, votre clientèle et ce qui vous distingue de la concurrence.',
    },
    {
      number: 2,
      text: '2 à 3 pistes graphiques proposées sous forme de planches d’inspiration.',
    },
    {
      number: 3,
      text: 'Le développement de la piste choisie.',
    },
    {
      number: 4,
      text: 'La livraison de tous vos fichiers (PNG, PDF, SVG), prêts pour le papier et le digital.',
    },
  ],
  pricing: 'À partir de 1 000 € TTC',
  delay: 'Délai : de 3 à 6 semaines à compter de la signature du devis',
  cta: { label: 'En parler', kind: 'contact' },
  showcaseImage: {
    src: '/images/branding.png',
    alt: 'Exemple d’identité visuelle — logo, lettering et illustrations pour un coffee shop',
    width: 1120,
    height: 480,
  },
  seoDescription:
    'Identité visuelle sur mesure : logo, palette, typographies, motifs et charte graphique. À partir de 1 000 € TTC — La Dessinerie.',
}

const FRESQUE_CONTENT: ProCategoryContent = {
  headline: 'Une vitrine qui attire les regards !',
  intro:
    'Une vitrine illustrée, c’est le premier support de communication physique de votre commerce. Je dessine et je réalise directement sur votre vitrine, pour les fêtes, un événement, une saison ou pour le plaisir des yeux.',
  deliverablesTitle: 'Ce que vous recevrez',
  deliverables: [
    'Une création éphémère sur mesure, adaptée à votre univers et à la taille de votre vitrine.',
    'Une réalisation peinte à la main sur place, directement sur la vitrine, au Posca.',
    'Un thème au choix, toute l’année : fêtes de fin d’année, soldes, rentrée, Halloween, ouverture, anniversaire du commerce…',
  ],
  stepsTitle: 'Comment ça se passe',
  steps: [
    {
      number: 1,
      text: 'Un échange pour définir l’occasion, le thème et vos envies.',
    },
    {
      number: 2,
      text: 'Une esquisse adaptée à votre univers et à la taille de votre vitrine, présentée avant de commencer.',
    },
    {
      number: 3,
      text: 'La réalisation sur place, en 2 à 6 heures selon la surface.',
    },
  ],
  pricing: 'À partir de 250 € · Intervention dans la région lyonnaise',
  delay: 'Délai : à réserver 2 semaines avant la date souhaitée',
  cta: { label: 'En parler', kind: 'contact' },
  seoDescription:
    'Fresque de vitrine peinte à la main au Posca, sur mesure pour votre commerce. À partir de 250 € — La Dessinerie.',
}

const EVENEMENTIEL_CONTENT: ProCategoryContent = {
  headline: 'Votre portrait dessiné en quelques minutes',
  intro:
    'Mariage, fête d’entreprise, salon, inauguration… Remplacez le photomaton par un stand de portraits dessinés en direct. Chaque invité s’installe, pose quelques minutes, et repart avec un portrait illustré, unique et personnalisé.',
  deliverablesTitle: 'Ce que vous recevrez',
  deliverables: [
    'Un stand en bois inspiré des photomatons d’autrefois, installé dans votre lieu et prêt à l’emploi.',
    'Un portrait par invité, dessiné en direct en 5 minutes, au format carte postale.',
    'Environ 10 portraits par heure.',
    'La possibilité d’ajouter votre logo, des photos ou des flyers sur la structure en bois.',
  ],
  stepsTitle: 'Comment ça se passe',
  steps: [
    {
      number: 1,
      text: 'Un échange pour connaître votre événement, le lieu et le nombre d’invités.',
    },
    {
      number: 2,
      text: 'L’installation du stand dans votre lieu (espace nécessaire : 2 m²).',
    },
    {
      number: 3,
      text: 'Les portraits dessinés en direct pendant toute la durée de l’intervention.',
    },
  ],
  pricing: 'À partir de 500 € · Déplacement possible dans la région lyonnaise',
  delay: 'Durée d’intervention : à partir de 3 heures',
  cta: { label: 'Réserver une date', kind: 'calendly' },
  seoDescription:
    'Stand de portraits dessinés en direct pour mariages, entreprises et salons. À partir de 500 € — La Dessinerie.',
}

const PRO_CONTENT: Partial<Record<ProCategorySlug, ProCategoryContent>> = {
  branding: BRANDING_CONTENT,
  fresque: FRESQUE_CONTENT,
  evenementiel: EVENEMENTIEL_CONTENT,
}

export function getProCategoryContent(
  slug: ProCategorySlug,
): ProCategoryContent | undefined {
  return PRO_CONTENT[slug]
}
