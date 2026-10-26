'use client'

import { InstantLink } from '@/components/instant-link'
import { illustrationAlt } from '@/lib/illustration-utils'
import type { Illustration } from '@/lib/illustrations'

type ProProjectDetailProps = {
  illustration: Illustration
}

export function ProProjectDetail({ illustration }: ProProjectDetailProps) {
  return (
    <div className="content-reveal flex h-full min-h-0 w-full max-w-5xl flex-col self-center">
      <InstantLink
        href="/pro"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-start rounded-lg bg-white/92 px-2.5 py-1 text-[10px] text-foreground/60 shadow-[0_2px_8px_rgba(43,41,39,0.06)] transition hover:text-foreground active:scale-[0.98] md:text-[11px]"
      >
        ← Retour
      </InstantLink>

      <div className="mt-1.5 flex min-h-0 w-full flex-1 flex-col gap-4 overflow-auto md:flex-row md:items-center md:gap-6 md:overflow-hidden">
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center md:h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={illustration.image}
            alt={illustrationAlt(illustration)}
            className="max-h-[min(72dvh,36rem)] w-auto max-w-full object-contain drop-shadow-[0_8px_24px_rgba(43,41,39,0.12)]"
          />
        </div>

        <div className="flex w-full shrink-0 flex-col justify-center gap-2 rounded-2xl bg-white/92 px-3.5 py-3 shadow-[0_4px_18px_rgba(43,41,39,0.08)] backdrop-blur-[2px] md:w-[min(100%,20rem)] md:px-4 md:py-5 lg:w-[22rem] lg:px-5">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[.18em] text-[var(--cobalt)]">
              Projet pro
            </p>
            <h1 className="display mt-0.5 text-sm font-semibold leading-snug md:text-base lg:text-lg">
              {illustration.title}
            </h1>
            {illustration.subcategory ? (
              <p className="mt-0.5 text-[10px] text-foreground/50">
                {illustration.subcategory}
              </p>
            ) : null}
          </div>

          {illustration.alt_text ? (
            <p className="text-[11px] leading-relaxed text-foreground/65 md:text-xs">
              {illustration.alt_text}
            </p>
          ) : null}

          <InstantLink
            href="/pro/contact"
            className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--terracotta)] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:opacity-90 md:text-xs"
          >
            Discuter de ce projet
          </InstantLink>
        </div>
      </div>
    </div>
  )
}
