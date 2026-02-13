import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { createThread, getThreads } from '@/lib/backend/threads'

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

  const { ok, status, data } = await getThreads({ page, limit })

  if (!ok) {
    return NextResponse.json({ error: getBackendErrorMessage(data, 'Unable to load threads.') }, { status })
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

  const { ok, status, data } = await createThread(token, {
    title: body.title,
    category: body.category,
    tags: body.tags || [],
    content: body.content,
  })

  if (!ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(data, 'Unable to create thread.') },
      { status },
    )
  }

  return NextResponse.json(data)
}
