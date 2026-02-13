import { backendRequest } from './client'

export type CreateThreadInput = {
  title: string
  category: string
  tags: string[]
  content: string
}

export const getThreads = ({ page, limit }: { page: string; limit: string }) => {
  const params = new URLSearchParams({
    page,
    limit,
    sort: '-createdAt',
  })

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
