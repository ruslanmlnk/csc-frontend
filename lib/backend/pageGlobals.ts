import { backendRequest } from '@/lib/backend/client'
import { getBackendUrl } from '@/lib/auth-server'

type UnknownRecord = Record<string, unknown>

export type PageHeroBanner = {
  caption?: string | null
  link?: string | null
  image?: {
    url?: string | null
  } | null
} | null

export type PageHeroV2 = {
  title?: string | null
  description?: string | null
  banner?: PageHeroBanner
} | null

export type PageSidebarBanner = PageHeroBanner

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
    banner?:
      | {
          caption?: string | null
          link?: string | null
          image?:
            | {
                url?: string | null
              }
            | string
            | null
        }
      | string
      | number
      | null
  } | null
  sidebarBanner?:
    | {
        caption?: string | null
        link?: string | null
        image?:
          | {
              url?: string | null
            }
          | string
          | null
      }
    | string
    | number
    | null
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
  sidebarBanner: PageSidebarBanner
  seo: PageSeo
}

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const normalizeMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const backendUrl = getBackendUrl()
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const resolveMediaUrl = (value: unknown): string | null => {
  const directUrl = asString(value)
  if (directUrl) {
    return normalizeMediaUrl(directUrl)
  }

  const recordValue = asRecord(value)
  return normalizeMediaUrl(asString(recordValue?.url))
}

export const getPageGlobalData = async (slug: string): Promise<PageGlobalData> => {
  const { ok, data } = await backendRequest<PageGlobalResponse>(`/api/globals/${slug}?depth=2`, {
    cache: 'no-store',
  })

  if (!ok || !data) {
    return {
      heroV2: null,
      sidebarBanner: null,
      seo: null,
    }
  }

  const ogImageRaw = data.seo?.ogImage
  const ogImageUrl =
    typeof ogImageRaw === 'string'
      ? normalizeMediaUrl(ogImageRaw)
      : normalizeMediaUrl(ogImageRaw?.url)
  const heroV2Record = asRecord(data.heroV2)
  const heroBannerRecord = asRecord(heroV2Record?.banner)
  const heroBannerImageUrl = resolveMediaUrl(heroBannerRecord?.image)

  const heroV2: PageHeroV2 = heroV2Record
    ? {
        title: asString(heroV2Record.title),
        description: asString(heroV2Record.description),
        banner: heroBannerRecord
          ? {
              caption: asString(heroBannerRecord.caption),
              link: asString(heroBannerRecord.link),
              image: heroBannerImageUrl ? { url: heroBannerImageUrl } : null,
            }
          : null,
      }
    : null
  const sidebarBannerRecord = asRecord(data.sidebarBanner)
  const sidebarBannerImageUrl = resolveMediaUrl(sidebarBannerRecord?.image)
  const sidebarBanner: PageSidebarBanner = sidebarBannerRecord
    ? {
        caption: asString(sidebarBannerRecord.caption),
        link: asString(sidebarBannerRecord.link),
        image: sidebarBannerImageUrl ? { url: sidebarBannerImageUrl } : null,
      }
    : null

  return {
    heroV2,
    sidebarBanner,
    seo: data.seo
      ? {
          title: data.seo.title || null,
          description: data.seo.description || null,
          ogImage: ogImageUrl ? { url: ogImageUrl } : null,
        }
      : null,
  }
}
