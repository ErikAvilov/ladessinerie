'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { IllustrationImage } from '@/components/illustration-image'
import { InstantLink } from '@/components/instant-link'
import { useSiteTheme } from '@/components/site-theme-context'
import { illustrationAlt } from '@/lib/illustration-utils'
import type { ProCategory } from '@/lib/pro-categories'
import { proProjectPath } from '@/lib/pro-routes'
import { usePrefetchOnIntent } from '@/lib/use-prefetch-on-intent'
import type { Illustration } from '@/lib/illustrations'

type ProCategoryClientProps = {
  category: ProCategory
  illustrations: Illustration[]
}

function ProjectCard({
  item,
  index,
}: {
  item: Illustration
  index: number
}) {
  const { onIntent, cancelIntent } = usePrefetchOnIntent()
  const href = proProjectPath(item.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col rounded-xl bg-white/92 p-2 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:p-2.5"
    >
      <InstantLink
        href={href}
        onPointerEnter={() => onIntent(href)}
        onFocus={() => onIntent(href)}
        onPointerLeave={cancelIntent}
        className="block"
      >
        <div className="relative aspect-[5/6] w-full overflow-hidden rounded-lg bg-white">
          <IllustrationImage
            src={item.image}
            alt={illustrationAlt(item)}
            dominantColor="#ffffff"
            fill
            rounded="lg"
            priority={index < 3}
            className="object-contain object-center"
            sizes="(max-width: 640px) 45vw, 22vw"
          />
        </div>
      </InstantLink>

      <div className="mt-1.5 min-w-0 px-0.5">
        <h2 className="truncate text-[11px] font-semibold leading-tight md:text-xs">
          {item.title}
        </h2>
        {item.subcategory ? (
          <p className="mt-0.5 text-[10px] text-foreground/55">{item.subcategory}</p>
        ) : null}
      </div>

      <InstantLink
        href={href}
        onPointerEnter={() => onIntent(href)}
        className="mt-1.5 inline-flex cursor-pointer px-0.5 text-[10px] text-foreground/55 underline-offset-2 transition hover:text-foreground hover:underline"
      >
        Détails
      </InstantLink>
    </motion.article>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)

  return (
    <div className="mt-5 grid gap-8 md:mt-6 md:grid-cols-2 md:gap-10">
      <div className="rounded-xl bg-white/92 px-4 py-5 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-5 md:py-6">
        <h2 className="display text-2xl font-semibold md:text-3xl">
          On imagine quelque chose ?
        </h2>
        <p className="mt-3 text-sm leading-6 text-foreground/60 md:text-base md:leading-7">
          Parlez-moi de votre projet, même s&apos;il n&apos;est pas encore très précis.
        </p>
      </div>

      {sent ? (
        <p className="rounded-xl bg-white/92 px-4 py-12 text-center text-sm text-foreground/60 shadow-[0_3px_12px_rgba(43,41,39,0.07)]">
          Merci — votre message est prêt à partir (formulaire démo).
        </p>
      ) : (
        <form
          className="flex flex-col gap-3 rounded-xl bg-white/92 p-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:gap-4 md:p-5"
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
        >
          <input
            required
            name="name"
            placeholder="Votre nom"
            className="rounded-xl border border-foreground/15 bg-transparent p-3.5 text-sm outline-none focus:border-[var(--terracotta)] md:p-4"
          />
          <input
            name="company"
            placeholder="Entreprise"
            className="rounded-xl border border-foreground/15 bg-transparent p-3.5 text-sm outline-none focus:border-[var(--terracotta)] md:p-4"
          />
          <select
            name="type"
            className="rounded-xl border border-foreground/15 bg-transparent p-3.5 text-sm md:p-4"
            defaultValue=""
          >
            <option value="" disabled>
              Type de projet
            </option>
            <option>Branding</option>
            <option>Fresque</option>
            <option>Evenementiel</option>
          </select>
          <textarea
            name="message"
            placeholder="Quelques mots sur votre idée..."
            rows={4}
            className="rounded-xl border border-foreground/15 bg-transparent p-3.5 text-sm outline-none focus:border-[var(--terracotta)] md:p-4"
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/60">
            <Upload size={16} /> Joindre un brief <input type="file" className="sr-only" />
          </label>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Envoyer le message
          </button>
        </form>
      )}
    </div>
  )
}

export function ProCategoryClient({
  category,
  illustrations,
}: ProCategoryClientProps) {
  const theme = useSiteTheme()
  const color = theme.boutonColor(category.slug)
  const isContact = category.filter === 'contact'

  return (
    <div
      className="content-reveal mx-auto flex min-h-full w-full max-w-6xl flex-col pb-40 md:pb-52"
      style={{ ['--category-color' as string]: color }}
    >
      <header className="shrink-0 rounded-xl bg-white/92 px-3 py-2.5 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-4 md:py-3">
        <InstantLink
          href="/pro"
          className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-foreground/60 transition hover:text-foreground active:scale-[0.98]"
        >
          ← Retour aux projets
        </InstantLink>

        <div className="mt-2 text-center md:mt-2.5">
          <h1
            className="display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
            style={{ color: color }}
          >
            {category.label}
          </h1>
        </div>
      </header>

      {isContact ? (
        <ContactForm />
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:mt-6 md:gap-x-5 md:gap-y-6 lg:gap-x-6 lg:gap-y-7">
          {illustrations.length === 0 ? (
            <p className="col-span-full rounded-xl bg-white/92 px-4 py-12 text-center text-sm text-foreground/50 shadow-[0_3px_12px_rgba(43,41,39,0.07)]">
              Aucun projet dans cette collection pour le moment.
            </p>
          ) : (
            illustrations.map((item, index) => (
              <ProjectCard key={item.id} item={item} index={index} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
