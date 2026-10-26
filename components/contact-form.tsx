'use client'

import { FormEvent, useState } from 'react'
import { Upload } from 'lucide-react'

type ContactFormProps = {
  /** `pro` = layout côte pro ; `page` = page /contact */
  variant?: 'pro' | 'page'
  source?: string
}

export function ContactForm({ variant = 'page', source = 'contact' }: ContactFormProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSending(true)

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          projectType: data.get('projectType'),
          message: data.get('message'),
          source,
        }),
      })

      const payload = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        setError(payload?.error ?? 'Envoi impossible. Réessayez.')
        setSending(false)
        return
      }

      setSent(true)
      form.reset()
    } catch {
      setError('Envoi impossible. Vérifiez votre connexion.')
    }
    setSending(false)
  }

  const fieldClass =
    variant === 'pro'
      ? 'rounded-xl border border-foreground/15 bg-transparent p-3.5 text-sm outline-none focus:border-[var(--terracotta)] md:p-4'
      : 'w-full rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]'

  const formInner = sent ? (
    <p
      className={
        variant === 'pro'
          ? 'rounded-xl bg-white/92 px-4 py-12 text-center text-sm text-foreground/60 shadow-[0_3px_12px_rgba(43,41,39,0.07)]'
          : 'rounded-2xl border border-[var(--grass)]/40 bg-[var(--grass)]/10 px-5 py-10 text-center text-sm text-[var(--forest)]'
      }
    >
      Merci — votre message est bien parti. Anna vous répondra bientôt.
    </p>
  ) : (
    <form
      className={
        variant === 'pro'
          ? 'flex flex-col gap-3 rounded-xl bg-white/92 p-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:gap-4 md:p-5'
          : 'mt-10 flex flex-col gap-4'
      }
      onSubmit={(event) => void handleSubmit(event)}
    >
      {variant === 'page' ? (
        <>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Votre nom</span>
            <input required name="name" className={fieldClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input required type="email" name="email" className={fieldClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Message</span>
            <textarea required name="message" rows={5} className={fieldClass} />
          </label>
        </>
      ) : (
        <>
          <input required name="name" placeholder="Votre nom" className={fieldClass} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={fieldClass}
          />
          <input name="company" placeholder="Entreprise" className={fieldClass} />
          <select name="projectType" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Type de projet
            </option>
            <option value="Branding">Branding</option>
            <option value="Fresque">Fresque</option>
            <option value="Evenementiel">Evenementiel</option>
          </select>
          <textarea
            required
            name="message"
            placeholder="Quelques mots sur votre idée..."
            rows={4}
            className={fieldClass}
          />
          <p className="flex items-center gap-2 text-sm text-foreground/45">
            <Upload size={16} /> Brief en pièce jointe bientôt disponible
          </p>
        </>
      )}

      {error && (
        <p className="rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:py-4"
      >
        {sending ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  )

  if (variant === 'page') return formInner

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
      {formInner}
    </div>
  )
}
