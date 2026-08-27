'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      setError(data?.error ?? 'Mot de passe incorrect.')
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 paper-shadow">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
          Administration
        </p>
        <h1 className="display mt-2 text-3xl font-semibold text-[var(--forest)]">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-foreground/55">
          Accès réservé à la gestion des illustrations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Mot de passe</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 outline-none transition focus:border-[var(--terracotta)]"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-[var(--terracotta)]/10 px-4 py-3 text-sm text-[var(--terracotta)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
