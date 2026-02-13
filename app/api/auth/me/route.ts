import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCurrentUser, normalizeMeUser } from '@/lib/backend/users'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('csc_auth')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const { ok, status, data } = await getCurrentUser(token)

  if (!ok) {
    return NextResponse.json({ user: null }, { status })
  }

  return NextResponse.json({ user: normalizeMeUser(data) })
}
