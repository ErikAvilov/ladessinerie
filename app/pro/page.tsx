'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

const projects = {
  Fresques: ['Le mur des possibles', 'Une cour haute en couleur'],
  'Branding / Graphisme': ['Maison Moka', 'La petite épicerie'],
  Illustrations: ['Lettres à la mer', 'Carnet botanique'],
}

export default function ProPage() {
  const [tab, setTab] = useState<keyof typeof projects>('Fresques')

  return (
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-[var(--cobalt)]">
          Pour les pros
        </p>
        <h1 className="display mt-2 text-5xl font-semibold md:text-7xl">
          Des projets qui
          <br />
          <em className="text-[var(--terracotta)]">font sourire.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/65">
          Fresques murales, identités visuelles ou illustrations sur mesure : je mets de la couleur
          dans vos histoires de marque.
        </p>
      </div>
      <div className="mt-16 flex flex-wrap gap-2 border-b border-foreground/10 pb-3">
        {Object.keys(projects).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name as keyof typeof projects)}
            className={`rounded-t-2xl px-5 py-3 font-semibold ${
              tab === name ? 'bg-[var(--mustard)]' : 'bg-foreground/5'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid gap-5 py-8 md:grid-cols-2">
        {projects[tab].map((title, i) => (
          <div
            key={title}
            className="flex aspect-[16/8] items-end rounded-2xl p-6 text-2xl font-semibold"
            style={{
              background: i ? 'var(--sage)' : 'var(--cobalt)',
              color: 'var(--cream)',
            }}
          >
            {title}
          </div>
        ))}
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
