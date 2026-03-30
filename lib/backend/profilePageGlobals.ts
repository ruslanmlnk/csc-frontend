import { backendRequest } from '@/lib/backend/client'
import { getBackendUrl } from '@/lib/auth-server'
import type { SiteLanguage } from '@/lib/i18n'

type UnknownRecord = Record<string, unknown>

type MediaRelationRaw =
  | {
      id?: string | number | null
      url?: string | null
      doc?:
        | {
            id?: string | number | null
            url?: string | null
          }
        | null
    }
  | string
  | number
  | null

type BannerRelationRaw =
  | {
      id?: string | number | null
      caption?: string | null
      link?: string | null
      image?: MediaRelationRaw
      doc?:
        | {
            id?: string | number | null
            caption?: string | null
            link?: string | null
            image?: MediaRelationRaw
          }
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

const asEntityId = (value: unknown): string | null => {
  if (typeof value === 'string' || typeof value === 'number') {
    const normalized = String(value).trim()
    return normalized || null
  }

  const recordValue = asRecord(value)
  if (!recordValue) {
    return null
  }

  return asEntityId(recordValue.id)
}

const normalizeMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const backendUrl = getBackendUrl()
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const resolveMediaUrl = (value: MediaRelationRaw): string | null => {
  const directUrl = asString(value)
  if (directUrl) {
    return normalizeMediaUrl(directUrl)
  }

  const recordValue = asRecord(value)
  if (!recordValue) {
    return null
  }

  const nestedDoc = asRecord(recordValue.doc)
  return normalizeMediaUrl(asString(recordValue.url) || asString(nestedDoc?.url))
}

const extractBannerRecord = (value: BannerRelationRaw): UnknownRecord | null => {
  const bannerRecord = asRecord(value)
  if (!bannerRecord) {
    return null
  }

  return asRecord(bannerRecord.doc) || bannerRecord
}

const fetchBannerById = async (
  id: string,
  locale?: SiteLanguage,
): Promise<UnknownRecord | null> => {
  const { ok, data } = await backendRequest<BannerRelationRaw>(`/api/banners/${id}?depth=1`, {
    cache: 'no-store',
    locale,
  })

  if (!ok || !data) {
    return null
  }

  return extractBannerRecord(data)
}

const fetchMediaUrlById = async (
  id: string,
  locale?: SiteLanguage,
): Promise<string | null> => {
  const { ok, data } = await backendRequest<MediaRelationRaw>(`/api/media/${id}`, {
    cache: 'no-store',
    locale,
  })

  if (!ok || !data) {
    return null
  }

  return resolveMediaUrl(data)
}

const resolveBanner = async (
  value: BannerRelationRaw,
  locale?: SiteLanguage,
): Promise<ProfilePageBanner | null> => {
  const initialBannerId = asEntityId(value)
  let bannerRecord = extractBannerRecord(value)

  if (!bannerRecord && initialBannerId) {
    bannerRecord = await fetchBannerById(initialBannerId, locale)
  }

  if (!bannerRecord) {
    return null
  }

  const imageValue = bannerRecord.image as MediaRelationRaw
  let imageUrl = resolveMediaUrl(imageValue)

  if (!imageUrl) {
    const imageId = asEntityId(imageValue)
    if (imageId) {
      imageUrl = await fetchMediaUrlById(imageId, locale)
    }
  }

  if (!imageUrl) {
    const bannerId = asEntityId(bannerRecord.id) || initialBannerId
    if (bannerId) {
      const hydratedBannerRecord = await fetchBannerById(bannerId, locale)
      if (hydratedBannerRecord) {
        bannerRecord = hydratedBannerRecord
        imageUrl = resolveMediaUrl(bannerRecord.image as MediaRelationRaw)

        if (!imageUrl) {
          const imageId = asEntityId(bannerRecord.image)
          if (imageId) {
            imageUrl = await fetchMediaUrlById(imageId, locale)
          }
        }
      }
    }
  }

  if (!imageUrl) {
    return null
  }

  return {
    src: imageUrl,
    alt: asString(bannerRecord.caption) || 'Profile banner',
    href: asString(bannerRecord.link),
  }
}

export const getProfilePageGlobals = async (locale?: SiteLanguage): Promise<ProfilePageGlobals> => {
  const { ok, data } = await backendRequest<ProfilePageGlobalResponse>('/api/globals/profile?depth=2', {
    cache: 'no-store',
    locale,
  })

  if (!ok || !data) {
    return {
      banner: null,
    }
  }

  return {
    banner: await resolveBanner(data.banner || null, locale),
  }
}
