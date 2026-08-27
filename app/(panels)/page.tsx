import { getImageProps } from 'next/image'
import {
  HOME_LOGO_HEIGHT,
  HOME_LOGO_SIZES,
  HOME_LOGO_WIDTH,
  HOME_SCATTER_INTRINSIC_PX,
  HOME_SCATTER_PRELOAD_COUNT,
  HOME_SCATTER_SIZES,
} from '@/lib/home-image'
import { getPanelsIllustrations } from '@/lib/panels-data'

export const dynamic = 'force-dynamic'

function PreloadImage({
  src,
  width,
  height,
  sizes,
  fetchPriority,
}: {
  src: string
  width: number
  height: number
  sizes: string
  fetchPriority?: 'high' | 'low' | 'auto'
}) {
  const { props } = getImageProps({
    src,
    alt: '',
    width,
    height,
    sizes,
  })

  return (
    <link
      rel="preload"
      as="image"
      href={props.src}
      imageSrcSet={props.srcSet}
      imageSizes={props.sizes}
      fetchPriority={fetchPriority}
    />
  )
}

/**
 * Sélection aléatoire SSR des bulles d’accueil (via getPanelsIllustrations /
 * pickHomeScatterIllustrations) + preloads head pour le FCP.
 * L’UI panels est rendue par le layout → PanelsShell → SiteSlider.
 */
export default async function HomePage() {
  const { home } = await getPanelsIllustrations()
  const criticalScatter = home.slice(0, HOME_SCATTER_PRELOAD_COUNT)

  return (
    <>
      <PreloadImage
        src="/images/logo.webp"
        width={HOME_LOGO_WIDTH}
        height={HOME_LOGO_HEIGHT}
        sizes={HOME_LOGO_SIZES}
        fetchPriority="high"
      />
      {criticalScatter.map((item) =>
        item.image ? (
          <PreloadImage
            key={item.id}
            src={item.image}
            width={HOME_SCATTER_INTRINSIC_PX}
            height={HOME_SCATTER_INTRINSIC_PX}
            sizes={HOME_SCATTER_SIZES}
          />
        ) : null,
      )}
    </>
  )
}
