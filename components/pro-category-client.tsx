'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ContactForm } from '@/components/contact-form'
import { InstantLink } from '@/components/instant-link'
import { useSiteTheme } from '@/components/site-theme-context'
import { getProCategoryContent } from '@/lib/pro-content'
import type { ProCategory } from '@/lib/pro-categories'
import { proCategoryPath } from '@/lib/pro-categories'

const CalendlyModal = dynamic(
  () => import('@/components/calendly-modal').then((mod) => mod.CalendlyModal),
  { ssr: false },
)

type ProCategoryClientProps = {
  category: ProCategory
  calendlyUrl?: string | null
}

export function ProCategoryClient({
  category,
  calendlyUrl,
}: ProCategoryClientProps) {
  const theme = useSiteTheme()
  const color = theme.boutonColor(category.slug)
  const isContact = category.filter === 'contact'
  const content = getProCategoryContent(category.slug)
  const contactHref = proCategoryPath('contact')
  const cta = content?.cta
  const useCalendly = cta?.kind === 'calendly' && Boolean(calendlyUrl)
  const [calendlyOpen, setCalendlyOpen] = useState(false)
  const ctaClassName =
    'inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]'

  return (
    <div
      className="content-reveal mx-auto flex min-h-full w-full max-w-6xl flex-col"
      style={{ ['--category-color' as string]: color }}
    >
      <InstantLink
        href="/pro"
        className="display mb-3 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl bg-white/92 px-3.5 py-2 text-sm font-semibold leading-none text-foreground/70 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] transition hover:text-foreground active:scale-[0.98] md:mb-4 md:px-4 md:py-2.5 md:text-base"
      >
        ← Retour aux projets
      </InstantLink>

      <header className="shrink-0 rounded-xl bg-white/92 px-4 py-4 text-center shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
        <h1
          className="display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
          style={{ color: color }}
        >
          {category.label}
        </h1>
        {content ? (
          <p className="display mt-2 text-base font-semibold leading-snug text-foreground/75 md:mt-3 md:text-xl lg:text-2xl">
            {content.headline}
          </p>
        ) : null}
      </header>

      {isContact ? (
        <ContactForm variant="pro" source="pro/contact" />
      ) : content ? (
        <section className="mt-5 space-y-5 md:mt-6 md:space-y-6">
          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <p className="text-base leading-relaxed text-foreground/70 md:text-lg md:leading-8">
              {content.intro}
            </p>
          </div>

          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <h2 className="display text-xl font-semibold md:text-2xl">
              {content.deliverablesTitle}
            </h2>
            <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
              {content.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-foreground/70 md:text-base md:leading-7"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <h2 className="display text-xl font-semibold md:text-2xl">
              {content.stepsTitle}
            </h2>
            <ol className="mt-3 space-y-3 md:mt-4 md:space-y-3.5">
              {content.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex gap-3 text-sm leading-relaxed text-foreground/70 md:text-base md:leading-7"
                >
                  <span
                    className="display flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white md:size-8 md:text-base"
                    style={{ background: color }}
                  >
                    {step.number}
                  </span>
                  <span className="pt-0.5">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-8 flex flex-col gap-3 rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] sm:flex-row sm:items-center sm:justify-between md:mb-10 md:px-6 md:py-5">
            <div>
              <p className="display text-lg font-semibold md:text-xl" style={{ color }}>
                {content.pricing}
              </p>
              <p className="mt-1 text-sm text-foreground/60 md:text-base">
                {content.delay}
              </p>
            </div>
            {useCalendly ? (
              <button
                type="button"
                onClick={() => setCalendlyOpen(true)}
                className={ctaClassName}
                style={{ background: color }}
              >
                {cta.label}
              </button>
            ) : (
              <InstantLink
                href={contactHref}
                className={ctaClassName}
                style={{ background: color }}
              >
                {cta?.label ?? 'En parler'}
              </InstantLink>
            )}
          </div>
        </section>
      ) : null}

      {useCalendly && calendlyUrl && calendlyOpen ? (
        <CalendlyModal
          url={calendlyUrl}
          open={calendlyOpen}
          onClose={() => setCalendlyOpen(false)}
        />
      ) : null}
    </div>
  )
}
