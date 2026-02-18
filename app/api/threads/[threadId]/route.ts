import { NextResponse } from 'next/server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { getThreadById } from '@/lib/backend/threads'
import { getThreadComments } from '@/lib/backend/comments'

type UnknownRecord = Record<string, unknown>

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asRecordArray = (value: unknown): UnknownRecord[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => asRecord(item))
    .filter((item): item is UnknownRecord => Boolean(item))
}

export async function GET(
  _request: Request,
  context: { params: { threadId?: string } | Promise<{ threadId?: string }> },
) {
  const params = await context.params
  const threadId = params.threadId

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID is required.' }, { status: 400 })
  }

  const [threadResult, commentsResult] = await Promise.all([
    getThreadById(threadId),
    getThreadComments(threadId),
  ])

  if (!threadResult.ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(threadResult.data, 'Unable to load thread.') },
      { status: threadResult.status },
    )
  }

  const threadPayload = asRecord(threadResult.data)
  const commentsPayload = asRecord(commentsResult.data)
  const commentsDocs = asRecordArray(commentsPayload?.docs)

  if (!threadPayload || commentsDocs.length === 0) {
    return NextResponse.json(threadResult.data)
  }

  const nestedDoc = asRecord(threadPayload.doc)
  if (nestedDoc) {
    return NextResponse.json({
      ...threadPayload,
      doc: {
        ...nestedDoc,
        comments: commentsDocs,
      },
    })
  }

  return NextResponse.json({
    ...threadPayload,
    comments: commentsDocs,
  })
}
