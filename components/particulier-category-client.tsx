'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { IllustrationImage } from '@/components/illustration-image'
import { formatFromPrice, illustrationAlt } from '@/lib/illustration-utils'
import type { ParticulierCategory } from '@/lib/particulier-categories'
import { particulierArtPath } from '@/lib/particulier-routes'
import type { Illustration } from '@/lib/supabase'

type ParticulierCategoryClientProps = {
  category: ParticulierCategory
  illustrations: Illustration[]
}

export function ParticulierCategoryClient({
  category,
  illustrations,
}: ParticulierCategoryClientProps) {
  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-5xl flex-col pb-24 md:pb-28"
      style={{ ['--category-color' as string]: category.color }}
    >
      <Link
        href="/particulier"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs text-foreground/60 transition hover:text-foreground md:text-sm"
      >
        ← Retour à la boutique
      </Link>

      <div className="mt-4 md:mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/45">
          Collection
        </p>
        <h1 className="display mt-1.5 text-[1.65rem] font-semibold leading-tight md:text-4xl">
          {category.label}
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {illustrations.length === 0 ? (
          <p className="col-span-full py-16 text-center text-sm text-foreground/50">
            Aucune illustration dans cette collection pour le moment.
          </p>
        ) : (
          illustrations.map((item, index) => {
            const priceLabel = formatFromPrice(item.sizes)
            const href = particulierArtPath(item.id)
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.3 }}
                className="group"
              >
                <Link
                  href={href}
                  className="relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl transition group-hover:-rotate-1 group-hover:shadow-lg"
                >
                  <IllustrationImage
                    src={item.image_url}
                    alt={illustrationAlt(item)}
                    fill
                    rounded="xl"
                    priority={index < 4}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </Link>
                <div className="flex justify-between gap-2 pt-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">{item.title}</h2>
                  </div>
                  <div className="shrink-0 text-right">
                    {priceLabel && (
                      <p className="text-xs font-semibold leading-tight md:text-sm">
                        {priceLabel}
                      </p>
                    )}
                    <Link
                      href={href}
                      className="mt-0.5 inline-block cursor-pointer text-xs underline"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })
        )}
      </div>
    </div>
  )
}
