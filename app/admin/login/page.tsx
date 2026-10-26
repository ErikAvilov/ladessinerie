'use client'

import { FormEvent, useState } from 'react'

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/admin'
  if (!value.startsWith('/admin')) return '/admin'
  return value
}

function nextPathFromLocation() {
  const next = new URLSearchParams(window.location.search).get('next')
  return safeNextPath(next)
}

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'Mot de passe incorrect.')
        setLoading(false)
        return
      }

      // Redirection hard : le cookie de session est pris en compte immédiatement
      // (router.replace soft-nav échoue souvent juste après Set-Cookie).
      window.location.assign(nextPathFromLocation())
    } catch {
      setError('Impossible de se connecter. Réessayez.')
      setLoading(false)
    }
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
