import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createComment, getThreadComments } from '@/lib/backend/comments'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { clearAuthCookie } from '@/lib/auth-server'
import { getThreadById } from '@/lib/backend/threads'

type CommentPayload = {
  comment?: string
}

type RouteContext = {
  params: { threadId?: string } | Promise<{ threadId?: string }>
}

type UnknownRecord = Record<string, unknown>

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const threadId = params.threadId

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID is required.' }, { status: 400 })
  }

  const { searchParams } = new URL(_request.url)
  const limit = searchParams.get('limit') || '100'
  const depth = searchParams.get('depth') || '2'

  const { ok, status, data } = await getThreadComments(threadId, limit, depth)

  if (!ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(data, 'Unable to load comments.') },
      { status },
    )
  }

  return NextResponse.json(data)
}

export async function POST(request: Request, context: RouteContext) {
  const params = await context.params
  const threadId = params.threadId

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID is required.' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('csc_auth')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as CommentPayload | null
  const comment = body?.comment?.trim()

  if (!comment) {
    return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 })
  }

  const numericThreadId = Number(threadId)
  const threadRef = Number.isNaN(numericThreadId) ? threadId : numericThreadId

  const threadResult = await getThreadById(threadId, '1')
  if (threadResult.ok) {
    const threadPayload = asRecord(threadResult.data)
    const threadDoc = asRecord(threadPayload?.doc) || threadPayload
    if (threadDoc?.isLocked === true) {
      return NextResponse.json(
        { error: 'This thread is locked. New comments are disabled.' },
        { status: 403 },
      )
    }
  }

  const { ok, status, data } = await createComment(token, {
    thread: threadRef,
    comment,
  })

  if (!ok) {
    const backendMessage = getBackendErrorMessage(data, 'Unable to publish comment.')
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
