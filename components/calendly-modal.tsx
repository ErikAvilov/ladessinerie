'use client'

import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

type CalendlyModalProps = {
  url: string
  open: boolean
  onClose: () => void
}

function calendlyEmbedSrc(url: string) {
  const parsed = new URL(url)
  parsed.searchParams.set('embed_type', 'Inline')
  parsed.searchParams.set('hide_gdpr_banner', '1')
  return parsed.toString()
}

export function CalendlyModal({ url, open, onClose }: CalendlyModalProps) {
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 cursor-pointer bg-foreground/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,860px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_rgba(43,41,39,0.28)]"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-foreground/8 px-4 py-3 md:px-5">
          <h2 id={titleId} className="display text-lg font-semibold md:text-xl">
            Réserver une date
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground/55 transition hover:bg-foreground/5 hover:text-foreground active:scale-[0.98]"
            aria-label="Fermer la réservation"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <iframe
            title="Calendly — réserver une date"
            src={calendlyEmbedSrc(url)}
            className="block h-[min(70dvh,720px)] w-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
