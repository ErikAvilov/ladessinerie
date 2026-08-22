'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Upload } from 'lucide-react'
import { illustrationAlt } from '@/lib/illustration-utils'
import type { Illustration } from '@/lib/supabase'

type ProPageClientProps = {
  illustrations: Illustration[]
}

export function ProPageClient({ illustrations }: ProPageClientProps) {
  const tabs = useMemo(() => {
    const subs = [
      ...new Set(illustrations.map((item) => item.subcategory).filter(Boolean)),
    ] as string[]
    return subs.length > 0 ? subs : ['Projets']
  }, [illustrations])

  const [tab, setTab] = useState(tabs[0])

  const shown =
    tabs.length === 1 && tabs[0] === 'Projets'
      ? illustrations
      : illustrations.filter((item) => item.subcategory === tab)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-[var(--cobalt)]">
          Pour les pros
        </p>
        <h1 className="display mt-2 text-4xl font-semibold leading-tight md:text-7xl">
          Des projets qui
          <br />
          <em className="text-[var(--terracotta)]">font sourire.</em>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-foreground/65 md:mt-6 md:text-lg md:leading-8">
          Fresques murales, identités visuelles ou illustrations sur mesure : je mets de la couleur
          dans vos histoires de marque.
        </p>
      </div>

      {tabs.length > 1 && (
        <div className="mt-16 flex flex-wrap gap-2 border-b border-foreground/10 pb-3">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={`rounded-t-2xl px-5 py-3 font-semibold ${
                tab === name ? 'bg-[var(--mustard)]' : 'bg-foreground/5'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 py-8 md:grid-cols-2">
        {shown.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-foreground/50">
            Aucun projet disponible pour le moment.
          </p>
        ) : (
          shown.map((item) => (
            <article
              key={item.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl"
            >
              <Image
                src={item.image_url}
                alt={illustrationAlt(item)}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-[var(--ink)]/20 to-transparent" />
              <h2 className="absolute inset-x-0 bottom-0 p-6 text-2xl font-semibold text-[var(--cream)]">
                {item.title}
              </h2>
            </article>
          ))
        )}
      </div>

      <div className="my-14 h-12 overflow-hidden">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="h-full w-full fill-[var(--mustard)]">
          <path d="M0 35 Q150 80 300 35 T600 35 T900 35 T1200 35 V80 H0Z" />
        </svg>
      </div>
      <div className="grid gap-10 pb-12 md:grid-cols-2">
        <div>
          <h2 className="display text-4xl">On imagine quelque chose ?</h2>
          <p className="mt-4 leading-7 text-foreground/60">
            Parlez-moi de votre projet, même s&apos;il n&apos;est pas encore très précis.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <input
            required
            placeholder="Votre nom"
            className="rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
          <input
            placeholder="Entreprise"
            className="rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
          <select className="rounded-xl border border-foreground/15 bg-transparent p-4">
            <option>Type de projet</option>
            <option>Fresque</option>
            <option>Illustration</option>
            <option>Branding</option>
          </select>
          <textarea
            placeholder="Quelques mots sur votre idée..."
            rows={4}
            className="rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/60">
            <Upload size={16} /> Joindre un brief <input type="file" className="sr-only" />
          </label>
          <button className="rounded-full bg-[var(--terracotta)] px-5 py-4 font-semibold text-white">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  )
}
