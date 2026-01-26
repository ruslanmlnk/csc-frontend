import { NextResponse } from 'next/server'
import { getBackendUrl, setAuthCookie } from '@/lib/auth-server'
import { isValidEmail, isValidPassword } from '@/lib/validators'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email?.toString().trim()
  const password = body?.password?.toString()

  if (!email || !password || !isValidEmail(email) || !isValidPassword(password)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 })
  }

  const response = await fetch(`${getBackendUrl()}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          data?.errors?.[0]?.message ||
          data?.message ||
          'Invalid email or password.',
      },
      { status: response.status }
    )
  }

  const res = NextResponse.json({ user: data?.user ?? null })
  if (data?.token) {
    setAuthCookie(res, data.token)
  }
  return res
}
