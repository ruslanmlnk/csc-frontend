import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/backend/blog'
import { getConferences } from '@/lib/backend/conferences'
import { getJobs } from '@/lib/backend/jobs'
import { getPartnerships } from '@/lib/backend/partnerships'
import { getServices } from '@/lib/backend/services'
import { backendRequest } from '@/lib/backend/client'
import { getSiteUrl } from '@/lib/site-url'

type UnknownRecord = Record<string, unknown>

type ForumThread = {
  id: string
  categorySlug: string
  createdAt?: string | null
  updatedAt?: string | null
  noindex?: boolean | null
}

const STATIC_ROUTES = ['/', '/blog', '/conferences', '/services', '/partnerships', '/jobs', '/forum', '/login', '/register', '/pagetest']

export const revalidate = 3600

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

const asBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value
  }
  return false
}

const toDate = (value?: string | null): Date | undefined => {
  if (!value) return undefined

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}

const toCategorySlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const resolveThreadCategorySlug = (value: unknown): string | null => {
  const stringValue = asString(value)
  if (stringValue) {
    return toCategorySlug(stringValue)
  }

  const recordValue = asRecord(value)
  if (!recordValue) {
    return null
  }

  const slug = asString(recordValue.slug)
  if (slug) {
    return toCategorySlug(slug)
  }

  const name = asString(recordValue.name)
  if (name) {
    return toCategorySlug(name)
  }

  return null
}

const appendRoute = (
  entries: MetadataRoute.Sitemap,
  siteUrl: string,
  route: string,
  lastModified?: Date,
) => {
  entries.push({
    url: `${siteUrl}${route}`,
    lastModified,
  })
}

const getForumThreads = async (): Promise<ForumThread[]> => {
  const response = await backendRequest<Record<string, unknown>>(
    '/api/threads?page=1&limit=1000&sort=-updatedAt&depth=1',
    {
      cache: 'no-store',
    },
  )

  if (!response.ok || !response.data) {
    return []
  }

  const payload = asRecord(response.data)
  if (!payload || !Array.isArray(payload.docs)) {
    return []
  }

  return payload.docs.reduce<ForumThread[]>((acc, item) => {
    const record = asRecord(item)
    if (!record) {
      return acc
    }

    const id = asString(record.id)
    const categorySlug = resolveThreadCategorySlug(record.category)

    if (!id || !categorySlug) {
      return acc
    }

    acc.push({
      id,
      categorySlug,
      createdAt: asString(record.createdAt),
      updatedAt: asString(record.updatedAt),
      noindex: asBoolean(record.noindex),
    })

    return acc
  }, [])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const [articlesRes, conferencesRes, servicesRes, partnershipsRes, jobsRes, forumThreadsRes] =
    await Promise.allSettled([
      getArticles(),
      getConferences(),
      getServices(),
      getPartnerships(),
      getJobs(),
      getForumThreads(),
    ])

  const articles = articlesRes.status === 'fulfilled' ? articlesRes.value : []
  const conferences = conferencesRes.status === 'fulfilled' ? conferencesRes.value : []
  const services = servicesRes.status === 'fulfilled' ? servicesRes.value : []
  const partnerships = partnershipsRes.status === 'fulfilled' ? partnershipsRes.value : []
  const jobs = jobsRes.status === 'fulfilled' ? jobsRes.value : []
  const forumThreads = forumThreadsRes.status === 'fulfilled' ? forumThreadsRes.value : []

  const entries: MetadataRoute.Sitemap = []

  // Note: For static routes, we could fetch their respective Globals to check for noindex
  // but for now we follow the user requirement for items first.
  for (const route of STATIC_ROUTES) {
    appendRoute(entries, siteUrl, route, now)
  }

  for (const article of articles) {
    if (!article.slug || article.noindex) continue
    appendRoute(entries, siteUrl, `/blog/${encodeURIComponent(article.slug)}`, toDate(article.publishedDate) || now)
  }

  for (const conference of conferences) {
    if (!conference.slug || conference.noindex) continue
    appendRoute(entries, siteUrl, `/conferences/${encodeURIComponent(conference.slug)}`, toDate(conference.conferenceDate) || now)
  }

  for (const service of services) {
    if (!service.slug || service.noindex) continue
    appendRoute(entries, siteUrl, `/services/${encodeURIComponent(service.slug)}`, now)
  }

  for (const partnership of partnerships) {
    if (!partnership.slug || partnership.noindex) continue
    appendRoute(entries, siteUrl, `/partnerships/${encodeURIComponent(partnership.slug)}`, now)
  }

  for (const job of jobs) {
    if (!job.slug || job.noindex) continue
    appendRoute(entries, siteUrl, `/jobs/${encodeURIComponent(job.slug)}`, toDate(job.createdAt) || now)
  }

  const categoryDates = new Map<string, Date>()

  for (const thread of forumThreads) {
    if (thread.noindex) continue
    const categorySlug = thread.categorySlug
    if (!categorySlug) continue

    const threadDate = toDate(thread.updatedAt) || toDate(thread.createdAt) || now

    const existingCategoryDate = categoryDates.get(categorySlug)
    if (!existingCategoryDate || threadDate > existingCategoryDate) {
      categoryDates.set(categorySlug, threadDate)
    }

    appendRoute(
      entries,
      siteUrl,
      `/forum/${encodeURIComponent(categorySlug)}/${encodeURIComponent(thread.id)}`,
      threadDate,
    )
  }

  for (const [categorySlug, categoryDate] of categoryDates) {
    appendRoute(entries, siteUrl, `/forum/${encodeURIComponent(categorySlug)}`, categoryDate)
  }

  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>()

  for (const entry of entries) {
    const existing = uniqueEntries.get(entry.url)
    if (!existing) {
      uniqueEntries.set(entry.url, entry)
      continue
    }

    const existingDate = existing.lastModified instanceof Date ? existing.lastModified.getTime() : 0
    const newDate = entry.lastModified instanceof Date ? entry.lastModified.getTime() : 0

    if (newDate > existingDate) {
      uniqueEntries.set(entry.url, entry)
    }
  }

  return Array.from(uniqueEntries.values())
}
