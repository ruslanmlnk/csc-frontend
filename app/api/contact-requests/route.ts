import { NextResponse } from 'next/server'
import { backendRequest } from '@/lib/backend/client'
import { getBackendErrorMessage } from '@/lib/backend/errors'

type ContactRequestPayload = {
  firstName?: string
  lastName?: string
  email?: string
  subject?: string
  message?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalize = (value: string | undefined) => (typeof value === 'string' ? value.trim() : '')

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactRequestPayload | null

  const firstName = normalize(body?.firstName)
  const lastName = normalize(body?.lastName)
  const email = normalize(body?.email).toLowerCase()
  const subject = normalize(body?.subject)
  const message = normalize(body?.message)

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
  }

  const { ok, status, data } = await backendRequest<Record<string, unknown>>('/api/contact-requests', {
    method: 'POST',
    data: {
      firstName,
      lastName,
      email,
      subject: subject || undefined,
      message,
    },
  })

  if (!ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(data, 'Unable to submit contact request.') },
      { status },
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

