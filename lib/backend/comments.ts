import { backendRequest } from './client'
import type { SiteLanguage } from '@/lib/i18n'

export type CreateCommentInput = {
  thread: string | number
  comment: unknown
}

export const getThreadComments = (
  threadId: string,
  limit: string = '100',
  depth: string = '2',
  locale?: SiteLanguage,
) => {
  const params = new URLSearchParams({
    limit,
    sort: 'createdAt',
    depth,
  })

  params.set('where[thread][equals]', threadId)

  return backendRequest<Record<string, unknown>>(`/api/comments?${params.toString()}`, {
    cache: 'no-store',
    locale,
  })
}

export const createComment = (token: string, payload: CreateCommentInput) =>
  backendRequest<Record<string, unknown>>('/api/comments?depth=2', {
    method: 'POST',
    token,
    data: payload,
  })
