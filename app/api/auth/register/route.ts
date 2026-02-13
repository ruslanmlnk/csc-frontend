import { NextResponse } from 'next/server'
import { getBackendUrl, setAuthCookie } from '@/lib/auth-server'
import { isValidEmail, isValidPassword } from '@/lib/validators'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email?.toString().trim()
  const password = body?.password?.toString()

  if (!email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  }

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const createResponse = await fetch(`${getBackendUrl()}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const createData = await createResponse.json().catch(() => null)

  if (!createResponse.ok) {
    return NextResponse.json(
      {
        error:
          createData?.errors?.[0]?.message ||
          createData?.message ||
          'Unable to create account.',
      },
      { status: createResponse.status }
    )
  }

  const loginResponse = await fetch(`${getBackendUrl()}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const loginData = await loginResponse.json().catch(() => null)

  if (!loginResponse.ok) {
    return NextResponse.json(
      {
        error: loginData?.errors?.[0]?.message || loginData?.message || 'Login failed after registration.',
      },
      { status: loginResponse.status }
    )
  }

  const res = NextResponse.json({ user: loginData?.user ?? createData?.doc ?? null })
  if (loginData?.token) {
    setAuthCookie(res, loginData.token)
  }

  return res
}
