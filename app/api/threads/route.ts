import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/auth-server'

type ThreadPayload = {
  title: string
  category: string
  tags?: string[]
  content: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '12'

  const response = await fetch(`${getBackendUrl()}/api/threads?page=${page}&limit=${limit}&sort=-createdAt`, {
    cache: 'no-store',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json({ error: data?.message || 'Unable to load threads.' }, { status: response.status })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('csc_auth')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as ThreadPayload | null

  if (!body?.title || !body?.category || !body?.content) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
  }

  const response = await fetch(`${getBackendUrl()}/api/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      title: body.title,
      category: body.category,
      tags: body.tags || [],
      content: body.content,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    return NextResponse.json({ error: data?.errors?.[0]?.message || data?.message || 'Unable to create thread.' }, { status: response.status })
  }

  return NextResponse.json(data)
}
