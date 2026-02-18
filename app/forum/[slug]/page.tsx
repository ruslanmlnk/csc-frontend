'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import ForumCategoryHero from '@/app/components/forum/ForumCategoryHero'
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard'
import ForumPagination from '@/app/components/forum/ForumPagination'
import CreateThreadModal from '@/app/profile/CreateThreadModal'

type UnknownRecord = Record<string, unknown>

type SubCategoryData = {
  id: string
  name: string
  description: string
}

type ThreadCardData = {
  id: string
  title: string
  description: string
  authorName: string
  date: string
  replyCount: number
  authorAvatar: string
}

const THREADS_PER_PAGE = 12
const DEFAULT_AVATAR = '/images/logo.png'
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
const CATEGORY_BANNER_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/320fdcece1f77a65a87ca9821ec5eac14d2d2e21?width=1545'

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

const formatDate = (value: string | null): string => {
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
  const author = asRecord(value)
  if (!author) {
    return 'SCS Agency'
  }

  const name = asString(author.name)
  if (name) {
    return name
  }

  const email = asString(author.email)
  if (email) {
    return email.split('@')[0]
  }

  return 'SCS Agency'
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

const toThreadId = (value: unknown): string | null => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return null
}

const getRepliesCount = async (threadId: string): Promise<number> => {
  try {
    const response = await fetch(
      `/api/threads/${encodeURIComponent(threadId)}/comments?limit=1&depth=0`,
      { cache: 'no-store' },
    )
    const payload = (await response.json().catch(() => null)) as
      | {
          totalDocs?: number
          docs?: unknown[]
        }
      | null

    if (!response.ok) {
      return 0
    }

    if (typeof payload?.totalDocs === 'number') {
      return payload.totalDocs
    }

    return Array.isArray(payload?.docs) ? payload.docs.length : 0
  } catch {
    return 0
  }
}

export default function ForumCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slugParam = params.slug
  const slug = useMemo(
    () => (Array.isArray(slugParam) ? slugParam[0] : slugParam) || '',
    [slugParam],
  )

  const [subCategory, setSubCategory] = useState<SubCategoryData | null>(null)
  const [threads, setThreads] = useState<ThreadCardData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isActive = true

    const loadAuthState = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' })
        const payload = (await response.json().catch(() => null)) as { user?: unknown } | null

        if (isActive) {
          setIsAuthenticated(Boolean(payload?.user))
        }
      } catch {
        if (isActive) {
          setIsAuthenticated(false)
        }
      }
    }

    loadAuthState()

    return () => {
      isActive = false
    }
  }, [])

  const handleCreateThreadClick = async () => {
    if (isAuthenticated === true) {
      setIsCreateModalOpen(true)
      return
    }

    if (isAuthenticated === false) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const payload = (await response.json().catch(() => null)) as { user?: unknown } | null
      const authenticated = Boolean(payload?.user)
      setIsAuthenticated(authenticated)

      if (authenticated) {
        setIsCreateModalOpen(true)
      } else {
        router.push('/login')
      }
    } catch {
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [slug])

  useEffect(() => {
    if (!slug) {
      setSubCategory(null)
      setError('Category slug is missing.')
      setIsLoading(false)
      return
    }

    let isActive = true

    const loadSubCategory = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/forum-sub-categories?slug=${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        })
        const payload = (await response.json().catch(() => null)) as
          | {
              error?: string
              subCategories?: Array<{
                id?: string
                name?: string
                description?: string
              }>
            }
          | null

        if (!response.ok) {
          throw new Error(payload?.error || 'Unable to load category.')
        }

        const item = payload?.subCategories?.[0]
        if (!item?.id || !item.name) {
          throw new Error('Category not found.')
        }

        if (isActive) {
          setSubCategory({
            id: item.id,
            name: item.name,
            description: item.description || 'All threads in this category',
          })
        }
      } catch (loadError) {
        if (isActive) {
          setSubCategory(null)
          setThreads([])
          setTotalDocs(0)
          setTotalPages(1)
          setError(loadError instanceof Error ? loadError.message : 'Unable to load category.')
          setIsLoading(false)
        }
      }
    }

    loadSubCategory()

    return () => {
      isActive = false
    }
  }, [slug])

  useEffect(() => {
    if (!subCategory?.id) {
      return
    }

    let isActive = true

    const loadThreads = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/threads?page=${currentPage}&limit=${THREADS_PER_PAGE}&depth=2&sort=-createdAt&categoryId=${encodeURIComponent(subCategory.id)}`,
          { cache: 'no-store' },
        )
        const payload = (await response.json().catch(() => null)) as
          | {
              error?: string
              docs?: unknown[]
              totalDocs?: number
              totalPages?: number
              page?: number
            }
          | null

        if (!response.ok) {
          throw new Error(payload?.error || 'Unable to load threads.')
        }

        const docs = Array.isArray(payload?.docs) ? payload.docs : []
        const cardsBase = docs
          .map((doc) => asRecord(doc))
          .filter((doc): doc is UnknownRecord => Boolean(doc))
          .map((doc) => {
            const threadId = toThreadId(doc.id)
            if (!threadId) {
              return null
            }

            return {
              id: threadId,
              title: asString(doc.title) || 'Untitled thread',
              description: subCategory.description || 'We read, delve into, discuss',
              authorName: resolveAuthorName(doc.author),
              date: formatDate(asString(doc.createdAt)),
              authorAvatar: resolveAuthorAvatar(doc.author),
            }
          })
          .filter(
            (
              item,
            ): item is Omit<ThreadCardData, 'replyCount'> => Boolean(item),
          )

        const counts = await Promise.all(
          cardsBase.map(async (item) => ({
            id: item.id,
            replyCount: await getRepliesCount(item.id),
          })),
        )
        const countsMap = new Map(counts.map((item) => [item.id, item.replyCount]))

        const cards: ThreadCardData[] = cardsBase.map((item) => ({
          ...item,
          replyCount: countsMap.get(item.id) || 0,
        }))

        if (isActive) {
          setThreads(cards)
          setTotalDocs(typeof payload?.totalDocs === 'number' ? payload.totalDocs : cards.length)
          setTotalPages(
            typeof payload?.totalPages === 'number' && payload.totalPages > 0
              ? payload.totalPages
              : 1,
          )
          const responsePage = typeof payload?.page === 'number' ? payload.page : currentPage
          if (responsePage !== currentPage) {
            setCurrentPage(responsePage)
          }
          setIsLoading(false)
        }
      } catch (loadError) {
        if (isActive) {
          setThreads([])
          setTotalDocs(0)
          setTotalPages(1)
          setError(loadError instanceof Error ? loadError.message : 'Unable to load threads.')
          setIsLoading(false)
        }
      }
    }

    loadThreads()

    return () => {
      isActive = false
    }
  }, [currentPage, subCategory?.description, subCategory?.id, refreshKey])

  const showingFrom = totalDocs === 0 ? 0 : (currentPage - 1) * THREADS_PER_PAGE + 1
  const showingTo = totalDocs === 0 ? 0 : Math.min(currentPage * THREADS_PER_PAGE, totalDocs)

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center">
      <ForumCategoryHero
        title={subCategory?.name || 'Category'}
        subtitle={subCategory?.description || 'All threads in this category'}
        backLink="/forum"
        backText="Back to Forum"
        backgroundImage={CATEGORY_BANNER_IMAGE}
      />

      <div className="flex flex-col items-center w-full max-w-[1280px] px-5 gap-16 pb-20">
        <div className="w-full flex justify-start">
          <button
            type="button"
            onClick={handleCreateThreadClick}
            className="h-[50px] lg:h-[58px] inline-flex items-center justify-center gap-[12px] lg:gap-[5px] border border-[#FCC660] text-[#FCC660] rounded-[80px] px-[24px] font-medium text-[16px] leading-[26px] whitespace-nowrap hover:bg-[#FCC660]/10 transition-all"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H12.75V20.25C12.75 20.4489 12.671 20.6397 12.5303 20.7803C12.3897 20.921 12.1989 21 12 21C11.8011 21 11.6103 20.921 11.4697 20.7803C11.329 20.6397 11.25 20.4489 11.25 20.25V12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H11.25V3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3C12.1989 3 12.3897 3.07902 12.5303 3.21967C12.671 3.36032 12.75 3.55109 12.75 3.75V11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12Z" fill="#FCC660" />
            </svg>
            Create a thread
          </button>
        </div>

        {isLoading ? (
          <div className="w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
            Loading threads...
          </div>
        ) : error ? (
          <div className="w-full rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[#FF9C9C] text-[16px] leading-[26px]">
            {error}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {threads.length === 0 ? (
                <div className="w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
                  No threads in this category yet.
                </div>
              ) : (
                threads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/forum/${encodeURIComponent(slug)}/${encodeURIComponent(thread.id)}`}
                    className="block"
                  >
                    <ForumCategoryThreadCard
                      title={thread.title}
                      description={thread.description}
                      authorName={thread.authorName}
                      date={thread.date}
                      replyCount={thread.replyCount}
                      authorAvatar={thread.authorAvatar}
                    />
                  </Link>
                ))
              )}
            </div>

            <ForumPagination
              showingFrom={showingFrom}
              showingTo={showingTo}
              total={totalDocs}
              currentPage={currentPage}
              totalPages={Math.max(totalPages, 1)}
              itemLabel="threads"
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialSubCategoryId={subCategory?.id}
        initialSubCategorySlug={slug}
        onSuccess={async () => {
          setCurrentPage(1)
          setRefreshKey((prev) => prev + 1)
        }}
      />
    </main>
  )
}
