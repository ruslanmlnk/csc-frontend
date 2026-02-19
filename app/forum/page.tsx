import type { Metadata } from 'next'
import ForumHero from '@/app/components/forum/ForumHero'
import ForumFiltersSection from '@/app/components/forum/ForumFiltersSection'
import ForumContentSection from '@/app/components/forum/ForumContentSection'
import type { ForumThreadsColumnSection } from '@/app/components/forum/ForumThreadsColumn'
import type { ForumSidebarThread } from '@/app/components/forum/ForumSidebar'
import { backendRequest } from '@/lib/backend/client'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'

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
  dateLabel: string
  subCategoryId: string
  subCategorySlug?: string
}

const FORUM_BANNER_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'
const SIDEBAR_BANNER_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/1df77007f20fb9ad313a0326ef07f148489cc4a4?width=794'
const FORUM_PAGE_GLOBAL_SLUG = 'forum-page'

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

const formatDateLabel = (value: string | null): string => {
  if (!value) {
    return 'Unknown date'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date'
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const resolveAuthorName = (value: unknown): string => {
  const user = asRecord(value)
  if (!user) {
    return 'SCS Agency'
  }

  const name = asString(user.name)
  if (name) {
    return name
  }

  const email = asString(user.email)
  if (email) {
    return email.split('@')[0]
  }

  return 'SCS Agency'
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

const parseForumSubCategories = (payload: unknown): ForumSubCategoryItem[] => {
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
      description: asString(record.description) || 'We read, delve into, discuss',
      textAboveDate: asString(record.textAboveDate) || 'SCS Agency',
      dateLabel: formatDateLabel(asString(record.date)),
      categoryName: asString(categoryObject?.name) || 'General',
    })

    return acc
  }, [])
}

const parseForumThreads = (payload: unknown): ForumThreadItem[] => {
  const root = asRecord(payload)
  const docs = Array.isArray(root?.docs) ? root.docs : []

  return docs.reduce<ForumThreadItem[]>((acc, item) => {
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

    acc.push({
      id,
      subCategoryId,
      subCategorySlug,
      title: asString(record.title) || 'Untitled thread',
      authorName: resolveAuthorName(record.author),
      dateLabel: formatDateLabel(asString(record.createdAt)),
    })

    return acc
  }, [])
}

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getPageGlobalData(FORUM_PAGE_GLOBAL_SLUG)
  const seo = globalData.seo

  if (!seo) {
    return { title: 'Forum' }
  }

  return {
    title: seo.title || 'Forum',
    description: seo.description || undefined,
    openGraph: {
      title: seo.title || 'Forum',
      description: seo.description || undefined,
      images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
    },
  }
}

export default async function ForumPage() {
  const [categoriesRes, subCategoriesRes, threadsRes, forumPageGlobal] = await Promise.all([
    backendRequest<Record<string, unknown>>('/api/forum-categories?limit=200&sort=name', {
      cache: 'no-store',
    }),
    backendRequest<Record<string, unknown>>('/api/forum-sub-categories?limit=500&sort=name&depth=1', {
      cache: 'no-store',
    }),
    backendRequest<Record<string, unknown>>('/api/threads?limit=500&sort=-createdAt&depth=2', {
      cache: 'no-store',
    }),
    getPageGlobalData(FORUM_PAGE_GLOBAL_SLUG),
  ])

  const forumCategories = categoriesRes.ok ? parseForumCategories(categoriesRes.data) : []
  const forumSubCategories = subCategoriesRes.ok ? parseForumSubCategories(subCategoriesRes.data) : []
  const forumThreads = threadsRes.ok ? parseForumThreads(threadsRes.data) : []

  const latestThreadBySubCategory = new Map<string, ForumThreadItem>()
  for (const thread of forumThreads) {
    if (!latestThreadBySubCategory.has(thread.subCategoryId)) {
      latestThreadBySubCategory.set(thread.subCategoryId, thread)
    }
  }

  const subCategorySlugById = new Map(
    forumSubCategories.map((subCategory) => [subCategory.id, subCategory.slug]),
  )

  const sectionsFromCategories: ForumThreadsColumnSection[] = forumCategories
    .map((category) => {
      const subCategoryCards = forumSubCategories
        .filter((subCategory) => subCategory.categoryId === category.id)
        .map((subCategory) => {
          const latestThread = latestThreadBySubCategory.get(subCategory.id)

          return {
            categoryTitle: subCategory.name,
            categoryDescription: subCategory.description,
            threadTitle: latestThread?.title || subCategory.name,
            authorName: latestThread?.authorName || subCategory.textAboveDate,
            date: latestThread?.dateLabel || subCategory.dateLabel,
            href: `/forum/${encodeURIComponent(subCategory.slug)}`,
          }
        })

      return {
        title: category.name,
        threads: subCategoryCards,
      }
    })
    .filter((section) => section.threads.length > 0)

  const sections: ForumThreadsColumnSection[] =
    sectionsFromCategories.length > 0
      ? sectionsFromCategories
      : [
          {
            title: forumSubCategories[0]?.categoryName || 'General',
            threads: forumSubCategories.map((subCategory) => {
              const latestThread = latestThreadBySubCategory.get(subCategory.id)

              return {
                categoryTitle: subCategory.name,
                categoryDescription: subCategory.description,
                threadTitle: latestThread?.title || subCategory.name,
                authorName: latestThread?.authorName || subCategory.textAboveDate,
                date: latestThread?.dateLabel || subCategory.dateLabel,
                href: `/forum/${encodeURIComponent(subCategory.slug)}`,
              }
            }),
          },
        ].filter((section) => section.threads.length > 0)

  const popularThreads: ForumSidebarThread[] = forumThreads.slice(0, 3).map((thread) => {
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

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden relative">
      <ForumHero
        title={
          heroTitle || (
            <>
              Community
              <br />
              discussions
            </>
          )
        }
        description={
          heroDescription
          || 'A space to share experience, ask questions, and discuss traffic sources, platforms, strategies, and real-world affiliate cases'
        }
      />

      <div className="relative z-10 flex flex-col items-center">
        <ForumFiltersSection
          searchPlaceholder="Search thread"
          searchButtonLabel="Search"
          bannerImage={FORUM_BANNER_IMAGE}
          bannerAlt="Community Banner"
        />
        <ForumContentSection
          sections={sections}
          sidebar={{
            title: 'Popular threads',
            popularThreads,
            bannerImage: SIDEBAR_BANNER_IMAGE,
            bannerAlt: 'Advertisement',
          }}
        />
      </div>
    </main>
  )
}
