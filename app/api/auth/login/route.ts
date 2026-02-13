import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { loginUser } from '@/lib/backend/users'
import { isValidEmail, isValidPassword } from '@/lib/validators'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email?.toString().trim()
  const password = body?.password?.toString()

  if (!email || !password || !isValidEmail(email) || !isValidPassword(password)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 })
  }

  const { ok, status, data } = await loginUser({ email, password })

  if (!ok) {
    return NextResponse.json(
      {
        error: getBackendErrorMessage(data, 'Invalid email or password.'),
      },
      { status },
    )
  }

  const res = NextResponse.json({ user: data?.user ?? null })
  if (data?.token) {
    setAuthCookie(res, data.token)
  }
  return res
}
