import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { createUser, loginUser } from '@/lib/backend/users'
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

  const createResult = await createUser({
    email,
    password,
  })

  if (!createResult.ok) {
    return NextResponse.json(
      {
        error: getBackendErrorMessage(createResult.data, 'Unable to create account.'),
      },
      { status: createResult.status },
    )
  }

  const loginResult = await loginUser({ email, password })

  if (!loginResult.ok) {
    return NextResponse.json(
      {
        error: getBackendErrorMessage(loginResult.data, 'Login failed after registration.'),
      },
      { status: loginResult.status },
    )
  }

  const res = NextResponse.json({ user: loginResult.data?.user ?? createResult.data?.doc ?? null })
  if (loginResult.data?.token) {
    setAuthCookie(res, loginResult.data.token)
  }

  return res
}
