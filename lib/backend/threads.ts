import { backendRequest } from './client'

export type CreateThreadInput = {
  title: string
  category: string
  tags: string[]
  content: string
}

type GetThreadsParams = {
  page: string
  limit: string
  authorId?: string
}

export const getThreads = ({ page, limit, authorId }: GetThreadsParams) => {
  const params = new URLSearchParams({
    page,
    limit,
    sort: '-createdAt',
  })

  if (authorId) {
    params.set('where[author][equals]', authorId)
  }

  return backendRequest<Record<string, unknown>>(`/api/threads?${params.toString()}`, {
    cache: 'no-store',
  })
}

export const createThread = (token: string, payload: CreateThreadInput) =>
  backendRequest<Record<string, unknown>>('/api/threads', {
    method: 'POST',
    token,
    data: payload,
  })
