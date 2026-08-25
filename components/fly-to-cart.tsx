'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useEffect, useMemo, useState } from 'react'

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

/** Durée du vol — le bump panier se déclenche à la fin. */
const METEOR_FLIGHT_MS = 780

const METEOR_SIZE = 76
const PATH_STEPS = 32

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function buildFlightPath(from: DOMRect, to: DOMRect, size: number) {
  const startX = from.left + from.width / 2 - size / 2
  const startY = from.top + from.height / 2 - size / 2
  const endX = to.left + to.width / 2 - size / 2
  const endY = to.top + to.height / 2 - size / 2

  const ctrlX = startX + (endX - startX) * 0.42
  const ctrlY =
    Math.min(startY, endY) -
    Math.max(110, Math.hypot(endX - startX, endY - startY) * 0.38 + 72)

  const xs: number[] = []
  const ys: number[] = []
  const scales: number[] = []
  const rotates: number[] = []
  const opacities: number[] = []
  const times: number[] = []

  for (let i = 0; i <= PATH_STEPS; i += 1) {
    const linear = i / PATH_STEPS
    const t = easeInOutSine(linear)
    const u = 1 - t

    xs.push(u * u * startX + 2 * u * t * ctrlX + t * t * endX)
    ys.push(u * u * startY + 2 * u * t * ctrlY + t * t * endY)

    // Bosse douce au milieu du trajet — pas de pause à l’apex.
    const lift = Math.sin(t * Math.PI)
    scales.push(0.42 + lift * 0.72)

    rotates.push(-10 + t * 22 + lift * 4)

    if (linear < 0.1) opacities.push(linear / 0.1)
    else if (linear > 0.9) opacities.push((1 - linear) / 0.1)
    else opacities.push(1)

    times.push(linear)
  }

  return {
    xs,
    ys,
    scales,
    rotates,
    opacities,
    times,
    startX,
    startY,
  }
}

function MeteorFlight({
  flight,
  onComplete,
  reduceMotion,
}: {
  flight: FlyPayload
  onComplete: (id: number) => void
  reduceMotion: boolean
}) {
  const path = useMemo(
    () => buildFlightPath(flight.from, flight.to, METEOR_SIZE),
    [flight.from, flight.to],
  )

  if (reduceMotion) {
    return (
      <motion.div
        key={flight.id}
        className="pointer-events-none fixed z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.35 }}
        onAnimationComplete={() => onComplete(flight.id)}
      />
    )
  }

  return (
    <motion.div
      key={flight.id}
      className="pointer-events-none fixed z-40"
      style={{ width: METEOR_SIZE, height: METEOR_SIZE, left: 0, top: 0 }}
      initial={{
        x: path.startX,
        y: path.startY,
        scale: path.scales[0],
        rotate: path.rotates[0],
        opacity: 0,
      }}
      animate={{
        x: path.xs,
        y: path.ys,
        scale: path.scales,
        rotate: path.rotates,
        opacity: path.opacities,
      }}
      transition={{
        duration: METEOR_FLIGHT_MS / 1000,
        ease: 'linear',
        times: path.times,
      }}
      onAnimationComplete={() => onComplete(flight.id)}
    >
      <span
        aria-hidden
        className="meteor-glow meteor-glow--flight absolute left-1/2 top-1/2 size-[165%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
      <span className="meteor-trail pointer-events-none absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <span className="relative block size-full overflow-hidden rounded-full bg-white shadow-[0_10px_28px_rgba(43,41,39,0.22)] ring-[3px] ring-white/95">
        <Image
          src={flight.src}
          alt=""
          width={METEOR_SIZE}
          height={METEOR_SIZE}
          className="h-full w-full object-contain p-1.5"
          sizes={`${METEOR_SIZE}px`}
        />
      </span>
    </motion.div>
  )
}

export function FlyToCart({ flights, onComplete }: FlyToCartProps) {
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {flights.map((flight) => (
        <MeteorFlight
          key={flight.id}
          flight={flight}
          onComplete={onComplete}
          reduceMotion={Boolean(reduceMotion)}
        />
      ))}
    </AnimatePresence>,
    document.body,
  )
}
