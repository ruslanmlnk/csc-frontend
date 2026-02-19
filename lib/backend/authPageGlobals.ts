import { backendRequest } from '@/lib/backend/client'
import { getBackendUrl } from '@/lib/auth-server'

type UnknownRecord = Record<string, unknown>

type BannerRelationRaw =
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

type AuthPageGlobalResponse = {
  leftBanner?: BannerRelationRaw
  rightBanner?: BannerRelationRaw
}

export type AuthPageBanner = {
  src: string
  alt: string
  href?: string | null
}

export type AuthPageGlobals = {
  leftBanner: AuthPageBanner | null
  rightBanner: AuthPageBanner | null
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
  return trimmed || null
}

const normalizeMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const backendUrl = getBackendUrl()
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const resolveBanner = (value: BannerRelationRaw): AuthPageBanner | null => {
  const bannerRecord = asRecord(value)
  if (!bannerRecord) {
    return null
  }

  const imageValue = bannerRecord.image
  const imageRecord = asRecord(imageValue)
  const imageUrl = normalizeMediaUrl(asString(imageValue) || asString(imageRecord?.url))

  if (!imageUrl) {
    return null
  }

  const caption = asString(bannerRecord.caption) || 'Banner'
  const link = asString(bannerRecord.link)

  return {
    src: imageUrl,
    alt: caption,
    href: link,
  }
}

export const getAuthPageGlobals = async (slug: 'login-page' | 'register-page'): Promise<AuthPageGlobals> => {
  const { ok, data } = await backendRequest<AuthPageGlobalResponse>(`/api/globals/${slug}?depth=2`, {
    cache: 'no-store',
  })

  if (!ok || !data) {
    return {
      leftBanner: null,
      rightBanner: null,
    }
  }

  return {
    leftBanner: resolveBanner(data.leftBanner || null),
    rightBanner: resolveBanner(data.rightBanner || null),
  }
}
