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

type ProfilePageGlobalResponse = {
  banner?: BannerRelationRaw
}

export type ProfilePageBanner = {
  src: string
  alt: string
  href?: string | null
}

export type ProfilePageGlobals = {
  banner: ProfilePageBanner | null
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

const resolveBanner = (value: BannerRelationRaw): ProfilePageBanner | null => {
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

  return {
    src: imageUrl,
    alt: asString(bannerRecord.caption) || 'Profile banner',
    href: asString(bannerRecord.link),
  }
}

export const getProfilePageGlobals = async (): Promise<ProfilePageGlobals> => {
  const { ok, data } = await backendRequest<ProfilePageGlobalResponse>('/api/globals/profile?depth=2', {
    cache: 'no-store',
  })

  if (!ok || !data) {
    return {
      banner: null,
    }
  }

  return {
    banner: resolveBanner(data.banner || null),
  }
}
