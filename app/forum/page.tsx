import type { Metadata } from 'next'
import ForumPageClient from './ForumPageClient'
import { backendRequest } from '@/lib/backend/client'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'
import { formatDateValue } from '@/lib/i18n'
import { getServerI18n } from '@/lib/i18n/server'

type UnknownRecord = Record<string, unknown>

type ForumCategoryItem = {
  id: string
  name: string
}

type ForumSubCategoryItem = {
  id: string
  name: string
  slug: string
  description: string
  textAboveDate: string
  dateLabel: string
  categoryId: string
  categoryName: string
}

type ForumThreadItem = {
  id: string
  title: string
  authorName: string
  authorAvatar: string
  dateLabel: string
  subCategoryId: string
  subCategorySlug?: string
  orderId: number
  createdAtTimestamp: number
}

const FORUM_BANNER_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'
const SIDEBAR_BANNER_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/1df77007f20fb9ad313a0326ef07f148489cc4a4?width=794'
const FORUM_PAGE_GLOBAL_SLUG = 'forum-page'
const DEFAULT_AVATAR = '/logo.svg'
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return null
}

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const resolveEntityId = (value: unknown): string | null => {
  const primitive = asString(value)
  if (primitive) {
    return primitive
  }

  const objectValue = asRecord(value)
  if (!objectValue) {
    return null
  }

  return asString(objectValue.id)
}

const parsePinnedThreadIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const unique = new Set<string>()
  const orderedIds: string[] = []

  for (const item of value) {
    const id = resolveEntityId(item)
    if (!id || unique.has(id)) {
      continue
    }

    unique.add(id)
    orderedIds.push(id)
  }

  return orderedIds
}

const formatDateLabel = (
  value: string | null,
  language: 'en' | 'uk',
  unknownDateLabel: string,
): string => {
  if (!value) {
    return unknownDateLabel
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return unknownDateLabel
  }

  return formatDateValue(parsed, language, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const normalizedBase = BACKEND_BASE_URL.endsWith('/')
    ? BACKEND_BASE_URL.slice(0, -1)
    : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const resolveAuthorName = (value: unknown, fallbackAuthorName: string): string => {
  const user = asRecord(value)
  if (!user) {
    return fallbackAuthorName
  }

  const name = asString(user.name)
  if (name) {
    return name
  }

  const email = asString(user.email)
  if (email) {
    return email.split('@')[0]
  }

  return fallbackAuthorName
}

const resolveAuthorAvatar = (value: unknown): string => {
  const author = asRecord(value)
  if (!author) {
    return DEFAULT_AVATAR
  }

  const avatar = author.avatar
  if (typeof avatar === 'string') {
    return toAbsoluteMediaUrl(avatar) || DEFAULT_AVATAR
  }

  const avatarObject = asRecord(avatar)
  if (!avatarObject) {
    return DEFAULT_AVATAR
  }

  const avatarUrl = asString(avatarObject.url)
  return toAbsoluteMediaUrl(avatarUrl) || DEFAULT_AVATAR
}

const parseForumCategories = (payload: unknown): ForumCategoryItem[] => {
  const root = asRecord(payload)
  const docs = Array.isArray(root?.docs) ? root.docs : []

  return docs.reduce<ForumCategoryItem[]>((acc, item) => {
    const record = asRecord(item)
    if (!record) {
      return acc
    }

    const id = asString(record.id)
    const name = asString(record.name)

    if (!id || !name) {
      return acc
    }

    acc.push({ id, name })
    return acc
  }, [])
}

const parseForumSubCategories = (
  payload: unknown,
  options: {
    defaultDescription: string
    defaultAuthorName: string
    defaultCategoryName: string
    unknownDateLabel: string
    language: 'en' | 'uk'
  },
): ForumSubCategoryItem[] => {
  const root = asRecord(payload)
  const docs = Array.isArray(root?.docs) ? root.docs : []

  return docs.reduce<ForumSubCategoryItem[]>((acc, item) => {
    const record = asRecord(item)
    if (!record) {
      return acc
    }

    const id = asString(record.id)
    const name = asString(record.name)
    const categoryValue = record.category
    const categoryId = resolveEntityId(categoryValue)
    const categoryObject = asRecord(categoryValue)

    if (!id || !name || !categoryId) {
      return acc
    }

    acc.push({
      id,
      name,
      slug: asString(record.slug) || toSlug(name),
      categoryId,
      description: asString(record.description) || options.defaultDescription,
      textAboveDate: asString(record.textAboveDate) || options.defaultAuthorName,
      dateLabel: formatDateLabel(asString(record.date), options.language, options.unknownDateLabel),
      categoryName: asString(categoryObject?.name) || options.defaultCategoryName,
    })

    return acc
  }, [])
}

const parseForumThreads = (
  payload: unknown,
  options: {
    untitledThreadLabel: string
    defaultAuthorName: string
    unknownDateLabel: string
    language: 'en' | 'uk'
  },
): ForumThreadItem[] => {
  const root = asRecord(payload)
  const docs = Array.isArray(root?.docs) ? root.docs : []

  const parsedThreads = docs.reduce<ForumThreadItem[]>((acc, item) => {
    const record = asRecord(item)
    if (!record) {
      return acc
    }

    const id = asString(record.id)
    if (!id) {
      return acc
    }

    const subCategoryId = resolveEntityId(record.category)
    if (!subCategoryId) {
      return acc
    }

    const subCategoryValue = asRecord(record.category)
    const subCategorySlug = asString(subCategoryValue?.slug) || undefined
    const createdAtRaw = asString(record.createdAt)
    const createdAtTimestamp = createdAtRaw ? new Date(createdAtRaw).getTime() : NaN

    acc.push({
      id,
      subCategoryId,
      subCategorySlug,
      title: asString(record.title) || options.untitledThreadLabel,
      authorName: resolveAuthorName(record.author, options.defaultAuthorName),
      authorAvatar: resolveAuthorAvatar(record.author),
      dateLabel: formatDateLabel(createdAtRaw, options.language, options.unknownDateLabel),
      orderId: asNumber(record.orderId) || 0,
      createdAtTimestamp: Number.isFinite(createdAtTimestamp) ? createdAtTimestamp : 0,
    })

    return acc
  }, [])

  return parsedThreads.sort((a, b) => {
    if (b.orderId !== a.orderId) {
      return b.orderId - a.orderId
    }

    return b.createdAtTimestamp - a.createdAtTimestamp
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const { language, messages: t } = await getServerI18n()
  const globalData = await getPageGlobalData(FORUM_PAGE_GLOBAL_SLUG, language)
  const seo = globalData.seo

  if (!seo) {
    return { title: t.navigation.forum }
  }

  return {
    title: seo.title || t.navigation.forum,
    description: seo.description || undefined,
    openGraph: {
      title: seo.title || t.navigation.forum,
      description: seo.description || undefined,
      images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
    },
  }
}

export default async function ForumPage() {
  const { language, messages: t } = await getServerI18n()
  const [categoriesRes, subCategoriesRes, threadsRes, forumPageGlobal] = await Promise.all([
    backendRequest<Record<string, unknown>>('/api/forum-categories?limit=200&sort=name', {
      cache: 'no-store',
      locale: language,
    }),
    backendRequest<Record<string, unknown>>('/api/forum-sub-categories?limit=500&sort=name&depth=1', {
      cache: 'no-store',
      locale: language,
    }),
    backendRequest<Record<string, unknown>>('/api/threads?limit=500&sort=-orderId,-createdAt&depth=2', {
      cache: 'no-store',
      locale: language,
    }),
    getPageGlobalData(FORUM_PAGE_GLOBAL_SLUG, language),
  ])

  const forumCategories = categoriesRes.ok ? parseForumCategories(categoriesRes.data) : []
  const forumSubCategories = subCategoriesRes.ok
    ? parseForumSubCategories(subCategoriesRes.data, {
        defaultDescription: t.forum.defaultThreadDescription,
        defaultAuthorName: t.forum.defaultAuthorName,
        defaultCategoryName: t.common.general,
        unknownDateLabel: t.common.unknownDate,
        language,
      })
    : []
  const forumThreads = threadsRes.ok
    ? parseForumThreads(threadsRes.data, {
        untitledThreadLabel: t.forum.untitledThread,
        defaultAuthorName: t.forum.defaultAuthorName,
        unknownDateLabel: t.common.unknownDate,
        language,
      })
    : []

  const subCategorySlugById = new Map(
    forumSubCategories.map((subCategory) => [subCategory.id, subCategory.slug]),
  )

  const threadById = new Map(forumThreads.map((thread) => [thread.id, thread]))
  const pinnedThreadIds = parsePinnedThreadIds(forumPageGlobal.pins)
  const pinnedThreads = pinnedThreadIds
    .map((threadId) => threadById.get(threadId))
    .filter((thread): thread is ForumThreadItem => Boolean(thread))

  const popularThreadsSource = pinnedThreads.length > 0 ? pinnedThreads : forumThreads
  const popularThreads = popularThreadsSource.slice(0, 3).map((thread) => {
    const subCategorySlug = thread.subCategorySlug || subCategorySlugById.get(thread.subCategoryId)
    const href = subCategorySlug
      ? `/forum/${encodeURIComponent(subCategorySlug)}/${encodeURIComponent(thread.id)}`
      : undefined

    return {
      title: thread.title,
      authorName: thread.authorName,
      date: thread.dateLabel,
      href,
    }
  })
  const heroTitle = forumPageGlobal.heroV2?.title?.trim()
  const heroDescription = forumPageGlobal.heroV2?.description?.trim()
  const heroBannerImage = forumPageGlobal.heroV2?.banner?.image?.url || FORUM_BANNER_IMAGE
  const heroBannerAlt = forumPageGlobal.heroV2?.banner?.caption?.trim() || t.forum.communityBannerAlt
  const heroBannerHref = forumPageGlobal.heroV2?.banner?.link?.trim()
  const sidebarBannerImage = forumPageGlobal.sidebarBanner?.image?.url || SIDEBAR_BANNER_IMAGE
  const sidebarBannerAlt = forumPageGlobal.sidebarBanner?.caption?.trim() || t.blog.promoBannerAlt
  const sidebarBannerHref = forumPageGlobal.sidebarBanner?.link?.trim()

  return (
    <ForumPageClient
      categories={forumCategories}
      subCategories={forumSubCategories}
      threads={forumThreads}
      heroTitle={heroTitle}
      heroDescription={heroDescription}
      heroBannerImage={heroBannerImage}
      heroBannerAlt={heroBannerAlt}
      heroBannerHref={heroBannerHref}
      sidebar={{
        title: t.forum.popularThreads,
        popularThreads,
        bannerImage: sidebarBannerImage,
        bannerAlt: sidebarBannerAlt,
        bannerHref: sidebarBannerHref,
      }}
    />
  )
}
