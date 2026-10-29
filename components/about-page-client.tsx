'use client'

import Image from 'next/image'

export function AboutPageClient() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] items-center gap-4 md:grid-cols-[1.2fr_0.8fr] md:gap-10 lg:gap-14">
        <div className="min-h-0 overflow-hidden">
          <h1 className="display text-2xl font-semibold leading-tight text-[var(--text-titre-a-propos)] md:text-4xl lg:text-5xl">
            Salut, moi c’est{' '}
            <em className="text-[var(--terracotta)]">Anna.</em>
          </h1>

          <div className="mt-3 space-y-3 text-[11px] leading-relaxed text-[var(--text-a-propos)] opacity-70 sm:text-xs md:mt-6 md:space-y-4 md:text-sm md:leading-7 lg:text-base lg:leading-8">
            <p>
              Entrer dans mon univers, c’est mettre les pieds dans des fleurs par
              centaines, mes petites obsessions du quotidien que j’essaie
              d’embellir. Tout commence par une idée, une phrase, un sentiment ou
              un ressenti qui me marque, me touche, me fait changer. Les
              illustrations naissent grâce à cette envie de vouloir garder une
              trace du moment présent. Cultiver les petits riens qui font du
              bien, mettre un peu plus de couleurs dans un monde qui
              s’assombrit, et surtout créer, pour moi, pour vous et pour se
              souvenir.
            </p>
            <p>
              J’aime illustrer et découvrir de nouvelles manières de penser, de
              communiquer et de vous faire ressentir des émotions. Alors,
              bienvenue dans mon jardin pas si secret.
            </p>
          </div>
        </div>

        <div className="flex min-h-0 items-center justify-end self-stretch">
          <div className="relative aspect-[3/4] h-[min(52dvh,22rem)] w-auto max-w-full overflow-hidden rounded-2xl md:h-[min(58dvh,28rem)]">
            <Image
              src="/images/photo-anna.jpeg"
              alt="Anna, illustratrice de La Dessinerie"
              width={1200}
              height={1600}
              className="h-full w-full object-cover object-center"
              sizes="(max-width: 768px) 42vw, 28rem"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
