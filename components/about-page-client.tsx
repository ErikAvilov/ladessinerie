'use client'

import Image from 'next/image'

export function AboutPageClient() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain pb-4 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-10 md:overflow-hidden md:pb-0 lg:gap-14">
        <div className="min-w-0 shrink-0 md:min-h-0 md:overflow-hidden">
          <h1 className="display text-3xl font-semibold leading-tight text-[var(--text-titre-a-propos)] sm:text-4xl md:text-4xl lg:text-5xl">
            Salut, moi c’est{' '}
            <em className="text-[var(--terracotta)]">Anna.</em>
          </h1>

          <div className="mt-5 flex justify-center md:hidden">
            <div className="relative aspect-[3/4] w-full max-w-[14.5rem] overflow-hidden rounded-2xl sm:max-w-[16rem]">
              <Image
                src="/images/photo-anna.jpeg"
                alt="Anna, illustratrice de La Dessinerie"
                width={1200}
                height={1600}
                className="h-full w-full object-cover object-center"
                sizes="16rem"
                priority
              />
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-a-propos)] opacity-70 sm:text-[15px] sm:leading-7 md:mt-6 md:space-y-4 md:text-sm md:leading-7 lg:text-base lg:leading-8">
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

        <div className="hidden min-h-0 items-center justify-end self-stretch md:flex">
          <div className="relative aspect-[3/4] h-[min(58dvh,28rem)] w-auto max-w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/photo-anna.jpeg"
              alt="Anna, illustratrice de La Dessinerie"
              width={1200}
              height={1600}
              className="h-full w-full object-cover object-center"
              sizes="28rem"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
