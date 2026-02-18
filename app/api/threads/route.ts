import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { createThread, getThreads } from '@/lib/backend/threads'
import { clearAuthCookie } from '@/lib/auth-server'

type ThreadPayload = {
  title: string
  category: string | number
  tags?: string[]
  content: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '12'
  const authorId = searchParams.get('authorId') || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const depth = searchParams.get('depth') || undefined
  const sort = searchParams.get('sort') || undefined

  const { ok, status, data } = await getThreads({ page, limit, authorId, categoryId, depth, sort })

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

  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const content = typeof body?.content === 'string' ? body.content.trim() : ''
  const rawCategory = body?.category

  const category =
    typeof rawCategory === 'number'
      ? rawCategory
      : typeof rawCategory === 'string'
        ? rawCategory.trim()
        : ''

  if (!title || !category || !content) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
  }

  const normalizedCategory =
    typeof category === 'string' && /^\d+$/.test(category)
      ? Number(category)
      : category
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((item): item is string => typeof item === 'string')
    : []

  const { ok, status, data } = await createThread(token, {
    title,
    category: normalizedCategory,
    tags,
    content,
  })

  if (!ok) {
    const backendMessage = getBackendErrorMessage(data, 'Unable to create thread.')
    const isInvalidSession =
      status === 401 ||
      (status === 403 &&
        backendMessage.toLowerCase().includes('not allowed to perform this action'))

    if (isInvalidSession) {
      const res = NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 },
      )
      clearAuthCookie(res)
      return res
    }

    return NextResponse.json(
      { error: backendMessage },
      { status },
    )
  }

  return NextResponse.json(data)
}
