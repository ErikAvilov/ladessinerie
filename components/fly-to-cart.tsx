'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export type FlyPayload = {
  id: number
  src: string
  from: DOMRect
  to: DOMRect
}

type FlyToCartProps = {
  flights: FlyPayload[]
  onComplete: (id: number) => void
}

const SIZE = 56

export function FlyToCart({ flights, onComplete }: FlyToCartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {flights.map((flight) => {
        const startX = flight.from.left + flight.from.width / 2 - SIZE / 2
        const startY = flight.from.top + flight.from.height / 2 - SIZE / 2
        const endX = flight.to.left + flight.to.width / 2 - SIZE / 2
        const endY = flight.to.top + flight.to.height / 2 - SIZE / 2

        // Apex: high above the clicked card, slightly toward the cart
        const apexX = startX + (endX - startX) * 0.18
        const apexY = Math.min(startY, endY) - Math.max(120, (startY - endY) * 0.35 + 80)

        return (
          <motion.div
            key={flight.id}
            className="pointer-events-none fixed z-40"
            style={{ width: SIZE, height: SIZE, left: 0, top: 0 }}
            initial={{
              x: startX,
              y: startY,
              scale: 0.35,
              opacity: 0,
            }}
            animate={{
              x: [startX, apexX, endX],
              y: [startY, apexY, endY],
              scale: [0.35, 1, 0.55],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.05,
              x: {
                times: [0, 0.58, 1],
                ease: [
                  [0.2, 0.7, 0.25, 1],
                  [0.85, 0, 0.95, 0.35],
                ],
              },
              y: {
                times: [0, 0.58, 1],
                ease: [
                  [0.2, 0.7, 0.25, 1],
                  [0.85, 0, 0.95, 0.35],
                ],
              },
              scale: {
                times: [0, 0.58, 1],
                ease: [
                  [0.2, 0.7, 0.25, 1],
                  [0.85, 0, 0.95, 0.35],
                ],
              },
              opacity: {
                times: [0, 0.12, 0.88, 1],
                ease: 'linear',
              },
            }}
            onAnimationComplete={() => onComplete(flight.id)}
          >
            <span
              aria-hidden
              className="meteor-glow absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
            <span className="meteor-core relative block size-full overflow-hidden rounded-full">
              <Image
                src={flight.src}
                alt=""
                width={SIZE}
                height={SIZE}
                className="h-full w-full scale-125 object-cover"
              />
            </span>
          </motion.div>
        )
      })}
    </AnimatePresence>,
    document.body,
  )
}
