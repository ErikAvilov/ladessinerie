'use client'

/**
 * Entrée Framer Motion allégée : utiliser `motion` / helpers d’ici
 * (pas `framer-motion` directement) sous `LazyMotionProvider` + `domAnimation`.
 */
export {
  m as motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion'
