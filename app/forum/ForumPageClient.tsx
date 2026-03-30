'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import ForumHero from '@/app/components/forum/ForumHero'
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard'
import ForumFiltersSection from '@/app/components/forum/ForumFiltersSection'
import ForumSidebar, { type ForumSidebarThread } from '@/app/components/forum/ForumSidebar'
import ForumThreadsColumn, { type ForumThreadsColumnSection } from '@/app/components/forum/ForumThreadsColumn'
import { useLanguage } from '@/app/components/i18n/LanguageProvider'

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

type SearchThreadCardItem = {
  id: string
  title: string
  description: string
  authorName: string
  authorAvatar: string
  date: string
  replyCount: number
  href?: string
}

type SearchThreadSection = {
  title: string
  threads: SearchThreadCardItem[]
}

interface ForumPageClientProps {
  categories: ForumCategoryItem[]
  subCategories: ForumSubCategoryItem[]
  threads: ForumThreadItem[]
  heroTitle?: string
  heroDescription?: string
  heroBannerImage: string
  heroBannerAlt?: string
  heroBannerHref?: string
  sidebar: {
    title: string
    popularThreads: ForumSidebarThread[]
    bannerImage: string
    bannerAlt?: string
    bannerHref?: string
  }
}

const SEARCH_DEBOUNCE_MS = 250
const DEFAULT_AVATAR = '/logo.svg'

const buildThreadHref = (subCategorySlug: string | undefined, threadId: string): string | undefined => {
  if (!subCategorySlug) {
    return undefined
  }

  return `/forum/${encodeURIComponent(subCategorySlug)}/${encodeURIComponent(threadId)}`
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

const ForumPageClient: React.FC<ForumPageClientProps> = ({
  categories,
  subCategories,
  threads,
  heroTitle,
  heroDescription,
  heroBannerImage,
  heroBannerAlt,
  heroBannerHref,
  sidebar,
}) => {
  const { messages: t } = useLanguage()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [replyCountsByThreadId, setReplyCountsByThreadId] = useState<Record<string, number>>({})

  useEffect(() => {
    const normalizedQuery = searchInput.trim()

    if (!normalizedQuery) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSearchQuery(normalizedQuery)
      setIsSearching(false)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchInput])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)

    if (!value.trim()) {
      setSearchQuery('')
      setIsSearching(false)
      return
    }

    setIsSearching(true)
  }

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput.trim())
    setIsSearching(false)
  }

  const orderedCategories = useMemo<ForumCategoryItem[]>(() => {
    if (categories.length > 0) {
      return categories
    }

    return Array.from(
      new Map(
        subCategories.map((subCategory) => [
          subCategory.categoryId,
          {
            id: subCategory.categoryId,
            name: subCategory.categoryName || t.common.general,
          },
        ]),
      ).values(),
    )
  }, [categories, subCategories, t.common.general])

  const subCategoryById = useMemo(
    () => new Map(subCategories.map((subCategory) => [subCategory.id, subCategory])),
    [subCategories],
  )

  const latestThreadBySubCategory = useMemo(() => {
    const latestThreads = new Map<string, ForumThreadItem>()

    for (const thread of threads) {
      if (!latestThreads.has(thread.subCategoryId)) {
        latestThreads.set(thread.subCategoryId, thread)
      }
    }

    return latestThreads
  }, [threads])

  const defaultSections = useMemo<ForumThreadsColumnSection[]>(() => {
    const sectionsFromCategories = orderedCategories
      .map((category) => {
        const subCategoryCards = subCategories
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

    if (sectionsFromCategories.length > 0) {
      return sectionsFromCategories
    }

    return [
      {
        title: subCategories[0]?.categoryName || t.common.general,
        threads: subCategories.map((subCategory) => {
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
  }, [latestThreadBySubCategory, orderedCategories, subCategories, t.common.general])

  const searchedSectionsBase = useMemo<SearchThreadSection[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return orderedCategories
      .map((category) => {
        const matchingThreads = threads
          .filter((thread) => {
            const subCategory = subCategoryById.get(thread.subCategoryId)

            return (
              subCategory?.categoryId === category.id
              && thread.title.toLowerCase().includes(normalizedQuery)
            )
          })
          .map((thread) => {
            const subCategory = subCategoryById.get(thread.subCategoryId)
            const threadHref = buildThreadHref(
              thread.subCategorySlug || subCategory?.slug,
              thread.id,
            )

            return {
              id: thread.id,
              title: thread.title || t.forum.untitledThread,
              description:
                subCategory?.name
                || subCategory?.description
                || t.forum.defaultThreadDescription,
              authorName: thread.authorName || t.forum.defaultAuthorName,
              authorAvatar: thread.authorAvatar || DEFAULT_AVATAR,
              date: thread.dateLabel || t.common.unknownDate,
              replyCount: 0,
              href: threadHref,
            }
          })

        return {
          title: category.name,
          threads: matchingThreads,
        }
      })
      .filter((section) => section.threads.length > 0)
  }, [
    orderedCategories,
    searchQuery,
    subCategoryById,
    t.common.unknownDate,
    t.forum.defaultAuthorName,
    t.forum.defaultThreadDescription,
    t.forum.untitledThread,
    threads,
  ])

  const hasActiveSearch = searchQuery.trim().length > 0

  useEffect(() => {
    if (!hasActiveSearch) {
      return
    }

    const missingThreadIds = searchedSectionsBase
      .flatMap((section) => section.threads.map((thread) => thread.id))
      .filter(
        (threadId, index, allIds) =>
          allIds.indexOf(threadId) === index && replyCountsByThreadId[threadId] === undefined,
      )

    if (missingThreadIds.length === 0) {
      return
    }

    let isActive = true

    Promise.all(
      missingThreadIds.map(async (threadId) => ({
        threadId,
        replyCount: await getRepliesCount(threadId),
      })),
    )
      .then((results) => {
        if (!isActive || results.length === 0) {
          return
        }

        setReplyCountsByThreadId((current) => {
          let hasChanges = false
          const next = { ...current }

          for (const result of results) {
            if (next[result.threadId] !== undefined) {
              continue
            }

            next[result.threadId] = result.replyCount
            hasChanges = true
          }

          return hasChanges ? next : current
        })
      })
      .catch(() => {})

    return () => {
      isActive = false
    }
  }, [hasActiveSearch, replyCountsByThreadId, searchedSectionsBase])

  const searchedSections = useMemo<SearchThreadSection[]>(
    () =>
      searchedSectionsBase.map((section) => ({
        ...section,
        threads: section.threads.map((thread) => ({
          ...thread,
          replyCount: replyCountsByThreadId[thread.id] ?? 0,
        })),
      })),
    [replyCountsByThreadId, searchedSectionsBase],
  )

  const showNoResults = hasActiveSearch && !isSearching && searchedSections.length === 0

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0D0D0D] text-white">
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
        description={heroDescription || t.forum.heroDescription}
      />

      <div className="relative z-10 flex flex-col items-center">
        <ForumFiltersSection
          searchPlaceholder={t.forum.searchThreadPlaceholder}
          searchButtonLabel={t.common.search}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          bannerImage={heroBannerImage}
          bannerAlt={heroBannerAlt}
          bannerHref={heroBannerHref}
        />

        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[24px] px-5 pb-[80px] lg:flex-row">
          <div className="order-1 lg:order-2">
            <ForumSidebar
              title={sidebar.title}
              popularThreads={sidebar.popularThreads}
              bannerImage={sidebar.bannerImage}
              bannerAlt={sidebar.bannerAlt}
              bannerHref={sidebar.bannerHref}
            />
          </div>

          <div className="order-2 min-w-0 flex-1 lg:order-1">
            {isSearching ? (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 font-poppins text-[16px] leading-[26px] text-[#BDBDBD]">
                {t.searchModal.searching}
              </div>
            ) : showNoResults ? (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5">
                <div className="flex flex-col gap-3">
                  <h2 className="font-poppins text-[24px] font-medium leading-[32px] text-white">
                    {t.searchModal.noResultsTitle}
                  </h2>
                  <p className="font-poppins text-[16px] font-normal leading-[26px]">
                    <span className="text-[#BDBDBD]">{t.searchModal.noResultsPrefix}</span>
                    <span className="font-medium text-white">{searchQuery.trim()}</span>
                    <span className="text-[#BDBDBD]">{t.searchModal.noResultsSuffix}</span>
                  </p>
                  <p className="font-poppins text-[14px] font-normal leading-[20px] text-[#757575]">
                    {t.searchModal.noResultsHint}
                  </p>
                </div>
              </div>
            ) : hasActiveSearch ? (
              <div className="flex flex-col gap-[24px] flex-1">
                {searchedSections.map((section, sectionIndex) => (
                  <div key={`${section.title}-${sectionIndex}`} className="flex flex-col gap-[28px]">
                    <div className="relative">
                      <div className="flex h-[58px] w-full items-center rounded-[80px] bg-[#F29F04] px-[24px] text-[16px] font-medium text-[#0D0D0D]">
                        {section.title}
                      </div>
                      <div className="absolute left-[27px] top-[58px]">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L1.04907e-06 0L15.9882 1.39773e-06L9.5929 11.0769Z" fill="#F29F04" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[16px]">
                      {section.threads.map((thread) => {
                        const card = (
                          <ForumCategoryThreadCard
                            title={thread.title}
                            description={thread.description}
                            authorName={thread.authorName}
                            date={thread.date}
                            replyCount={thread.replyCount}
                            authorAvatar={thread.authorAvatar}
                          />
                        )

                        if (!thread.href) {
                          return (
                            <div key={thread.id} className="block">
                              {card}
                            </div>
                          )
                        }

                        return (
                          <Link key={thread.id} href={thread.href} className="block">
                            {card}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ForumThreadsColumn sections={defaultSections} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForumPageClient
