import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'anna@ladessinerie.fr'
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'La Dessinerie <onboarding@resend.dev>'

type ContactBody = {
  name?: string
  email?: string
  company?: string
  projectType?: string
  message?: string
  source?: string
}

function clean(value: unknown, max = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY manquante. Ajoutez-la dans .env.local et sur Vercel.' },
      { status: 500 },
    )
  }

  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 180)
  const company = clean(body.company, 160)
  const projectType = clean(body.projectType, 80)
  const message = clean(body.message, 5000)
  const source = clean(body.source, 80) || 'site'

  if (!name || !message) {
    return NextResponse.json(
      { error: 'Nom et message sont obligatoires.' },
      { status: 400 },
    )
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
  }

  const resend = new Resend(apiKey)

  const lines = [
    `Nouveau message — La Dessinerie`,
    ``,
    `Source : ${source}`,
    `Nom : ${name}`,
    email ? `Email : ${email}` : null,
    company ? `Entreprise : ${company}` : null,
    projectType ? `Type de projet : ${projectType}` : null,
    ``,
    `Message :`,
    message,
  ].filter((line): line is string => line !== null)

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email || undefined,
      subject: projectType
        ? `[Contact] ${projectType} — ${name}`
        : `[Contact] Message de ${name}`,
      text: lines.join('\n'),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: error.message || 'Envoi impossible pour le moment.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API:', error)
    return NextResponse.json(
      { error: 'Envoi impossible pour le moment.' },
      { status: 500 },
    )
  }
}
