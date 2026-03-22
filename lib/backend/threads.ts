import { backendRequest } from './client'
import type { SiteLanguage } from '@/lib/i18n'

export type CreateThreadInput = {
  title: string
  category: string | number
  tags: string[]
  content: unknown
}

type GetThreadsParams = {
  page: string
  limit: string
  authorId?: string
  categoryId?: string
  depth?: string
  locale?: SiteLanguage
  sort?: string
}

export const getThreads = ({
  page,
  limit,
  authorId,
  categoryId,
  depth,
  locale,
  sort,
}: GetThreadsParams) => {
  const params = new URLSearchParams({
    page,
    limit,
    sort: sort || '-createdAt',
  })

  if (authorId) {
    params.set('where[author][equals]', authorId)
  }

  if (categoryId) {
    params.set('where[category][equals]', categoryId)
  }

  if (depth) {
    params.set('depth', depth)
  }

  return backendRequest<Record<string, unknown>>(`/api/threads?${params.toString()}`, {
    cache: 'no-store',
    locale,
  })
}

export const getThreadById = (
  threadId: string,
  depth: string = '3',
  locale?: SiteLanguage,
) =>
  backendRequest<Record<string, unknown>>(
    `/api/threads/${encodeURIComponent(threadId)}?depth=${encodeURIComponent(depth)}`,
    {
      cache: 'no-store',
      locale,
    },
  )

export const createThread = (token: string, payload: CreateThreadInput) =>
  backendRequest<Record<string, unknown>>('/api/threads', {
    method: 'POST',
    token,
    data: payload,
  })
