'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { artworks } from '@/lib/artworks'

const scatter = [
  { art: artworks[0], x: -300, y: -40, rotate: -12, width: 120 },
  { art: artworks[1], x: 310, y: -20, rotate: 9, width: 128 },
  { art: artworks[2], x: -360, y: 80, rotate: 5, width: 100 },
  { art: artworks[3], x: 370, y: 90, rotate: -8, width: 104 },
  { art: artworks[4], x: -210, y: -200, rotate: 13, width: 92 },
  { art: artworks[5], x: 195, y: -210, rotate: -7, width: 98 },
  { art: artworks[6], x: -145, y: -240, rotate: -4, width: 82 },
  { art: artworks[7], x: 130, y: -250, rotate: 11, width: 86 },
]

const ART_RATIO = 509 / 360

export default function HomePage() {
  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-20 text-center sm:px-28 md:px-36">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden>
        {scatter.map((card, i) => (
          <motion.div
            key={card.art.src}
            initial={{ x: 0, y: 0, rotate: 0, scale: 0.35, opacity: 0 }}
            animate={{ x: card.x, y: card.y, rotate: card.rotate, scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 90, damping: 14 }}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-sm paper-shadow"
            style={{
              width: card.width,
              height: card.width * ART_RATIO,
              marginLeft: -card.width / 2,
              marginTop: -(card.width * ART_RATIO) / 2,
            }}
          >
            <Image
              src={card.art.src}
              alt=""
              width={360}
              height={509}
              className="h-full w-full object-cover"
              sizes="160px"
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="relative z-10 size-28 shrink-0 md:size-36"
      >
        <Image
          src="/art/logo.png"
          alt="La Dessinerie"
          width={150}
          height={150}
          className="h-full w-full object-contain"
          priority
        />
      </motion.div>
      <h1 className="display relative z-10 mt-5 shrink-0 text-4xl font-semibold md:mt-7 md:text-6xl lg:text-7xl">
        Anna dessine
        <br />
        <em className="text-[var(--terracotta)]">des histoires.</em>
      </h1>
      <p className="relative z-10 mt-4 max-w-md shrink-0 text-sm leading-6 text-foreground/65 md:mt-5 md:text-base md:leading-7">
        Illustratrice optimiste, amoureuse des couleurs, des mots doux et des idées un peu grandes.
      </p>
    </div>
  )
}
