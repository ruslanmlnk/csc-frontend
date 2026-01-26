import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/auth-server'

export async function GET() {
  const token = cookies().get('csc_auth')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const response = await fetch(`${getBackendUrl()}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json({ user: null }, { status: response.status })
  }

  return NextResponse.json({ user: data?.user ?? data ?? null })
}
