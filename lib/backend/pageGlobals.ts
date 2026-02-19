import { backendRequest } from '@/lib/backend/client'
import { getBackendUrl } from '@/lib/auth-server'

export type PageHeroV2 = {
  title?: string | null
  description?: string | null
} | null

export type PageSeo = {
  title?: string | null
  description?: string | null
  ogImage?: {
    url?: string | null
  } | null
} | null

type PageGlobalResponse = {
  heroV2?: {
    title?: string | null
    description?: string | null
  } | null
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?:
      | {
          url?: string | null
        }
      | string
      | null
  } | null
}

export type PageGlobalData = {
  heroV2: PageHeroV2
  seo: PageSeo
}

const normalizeMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const backendUrl = getBackendUrl()
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

export const getPageGlobalData = async (slug: string): Promise<PageGlobalData> => {
  const { ok, data } = await backendRequest<PageGlobalResponse>(`/api/globals/${slug}?depth=1`, {
    cache: 'no-store',
  })

  if (!ok || !data) {
    return {
      heroV2: null,
      seo: null,
    }
  }

  const ogImageRaw = data.seo?.ogImage
  const ogImageUrl =
    typeof ogImageRaw === 'string'
      ? normalizeMediaUrl(ogImageRaw)
      : normalizeMediaUrl(ogImageRaw?.url)

  return {
    heroV2: data.heroV2 || null,
    seo: data.seo
      ? {
          title: data.seo.title || null,
          description: data.seo.description || null,
          ogImage: ogImageUrl ? { url: ogImageUrl } : null,
        }
      : null,
  }
}
