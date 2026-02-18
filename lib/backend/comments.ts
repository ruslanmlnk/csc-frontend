import { backendRequest } from './client'

export type CreateCommentInput = {
  thread: string | number
  comment: string
}

export const getThreadComments = (
  threadId: string,
  limit: string = '100',
  depth: string = '2',
) => {
  const params = new URLSearchParams({
    limit,
    sort: 'createdAt',
    depth,
  })

  params.set('where[thread][equals]', threadId)

  return backendRequest<Record<string, unknown>>(`/api/comments?${params.toString()}`, {
    cache: 'no-store',
  })
}

export const createComment = (token: string, payload: CreateCommentInput) =>
  backendRequest<Record<string, unknown>>('/api/comments?depth=2', {
    method: 'POST',
    token,
    data: payload,
  })
