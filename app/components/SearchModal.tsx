"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BlogCard from '@/app/components/BlogCard'
import ConferenceCard from '@/app/components/conferences/ConferenceCard'
import { formatConferenceDate } from '@/app/components/conferences/formatConferenceDate'
import JobVacancyCard from '@/app/components/jobs/JobVacancyCard'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'
import UsefulServiceCard from '@/app/components/services/UsefulServiceCard'
import type {
  SearchResultItem,
  SearchResultType,
} from '@/app/types/search'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

type SearchScope = SearchResultType | 'all'

type SearchApiResponse = {
  query: string
  minQueryLength?: number
  results: SearchResultItem[]
}

type SearchApiError = {
  error: string
}

const MIN_QUERY_LENGTH = 3
const SEARCH_DEBOUNCE_MS = 250
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const scopeOptions: { label: string; value: SearchScope }[] = [
  { label: 'All', value: 'all' },
  { label: 'Blog', value: 'blog' },
  { label: 'Conferences', value: 'conferences' },
  { label: 'Services', value: 'services' },
  { label: 'Partnership', value: 'partnerships' },
  { label: 'Jobs', value: 'jobs' },
]

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const formatBlogDate = (value?: string | null): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const formatJobDate = (value?: string | null): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' })
  return `${day} ${month}, ${year}`
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<SearchScope>('all')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
      setQuery('')
      setScope('all')
      setResults([])
      setIsLoading(false)
      setError('')
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const normalizedQuery = query.trim()

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      setResults([])
      setIsLoading(false)
      setError('')
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({ q: normalizedQuery })
        if (scope !== 'all') {
          params.set('type', scope)
        }

        const response = await fetch(`/api/search?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        })

        const payload = (await response.json().catch(() => null)) as SearchApiResponse | SearchApiError | null

        if (!response.ok) {
          throw new Error((payload as SearchApiError | null)?.error || 'Unable to perform search.')
        }

        const loadedResults = Array.isArray((payload as SearchApiResponse | null)?.results)
          ? (payload as SearchApiResponse).results
          : []

        setResults(loadedResults)
      } catch (searchError) {
        if (controller.signal.aborted) {
          return
        }

        setResults([])
        setError(searchError instanceof Error ? searchError.message : 'Unable to perform search.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [isOpen, query, scope])

  const normalizedQuery = query.trim()
  const typedQueryLength = normalizedQuery.length
  const isQueryShort = normalizedQuery.length < MIN_QUERY_LENGTH
  const isTypingHintState = typedQueryLength > 0 && isQueryShort
  const showNoResults = !isQueryShort && !isLoading && !error && results.length === 0

  const handleClearSearch = () => {
    setQuery('')
    setResults([])
    setError('')
    setIsLoading(false)

    window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  if (!isOpen) return null

  const renderResultCard = (item: SearchResultItem) => {
    if (item.type === 'blog') {
      return (
        <div className="flex h-full w-full">
          <Link href={item.href} className="flex h-full w-full no-underline [&>*]:h-full">
            <BlogCard
              post={{
                id: item.id,
                date: formatBlogDate(item.publishedDate),
                category: item.category,
                title: item.title,
                image: toAbsoluteMediaUrl(item.imageUrl) || '/images/blog-post-1.png',
              }}
            />
          </Link>
        </div>
      )
    }

    if (item.type === 'conferences') {
      return (
        <ConferenceCard
          title={item.title}
          imageSrc={toAbsoluteMediaUrl(item.mainImageUrl)}
          location={item.location}
          dateLabel={formatConferenceDate(item.conferenceDate)}
          topicsLabel={item.vertical}
          detailsHref={item.href}
        />
      )
    }

    if (item.type === 'services') {
      const logoUrl = toAbsoluteMediaUrl(item.logoUrl)

      return (
        <Link href={item.href} className="block h-full">
          <div className="h-full [&>div]:h-full [&>div]:justify-between [&>div]:gap-6 [&>div>div:nth-child(2)]:flex-1 [&>div>div:nth-child(2)]:min-h-[132px] [&>div>div:nth-child(2)>p]:line-clamp-4">
            <UsefulServiceCard
              logo={(
                <div className="relative h-[56px] w-[56px]">
                  {logoUrl ? (
                    <Image src={logoUrl} alt={item.title} fill sizes="56px" className="object-contain" />
                  ) : (
                    <div className="h-full w-full rounded-[14px] bg-[#2A2A2A]" />
                  )}
                </div>
              )}
              category={item.category}
              name={item.title}
              description={item.description}
              pricing={item.priceLabel || '-'}
              offer={item.promoDescription || ''}
              offerBrand={item.promoCode || undefined}
            />
          </div>
        </Link>
      )
    }

    if (item.type === 'partnerships') {
      const logoUrl = toAbsoluteMediaUrl(item.logoUrl)

      return (
        <PartnershipProgramCard
          title={item.title}
          rating={item.rating || '-'}
          foundedYear={item.foundedYear || '-'}
          geo={item.location || undefined}
          logo={(
            <div className="relative h-[56px] w-full max-w-[244px]">
              {logoUrl ? (
                <Image src={logoUrl} alt={item.title} fill sizes="244px" className="object-contain object-left" />
              ) : (
                <div className="h-full w-[120px] rounded-[14px] bg-[#2A2A2A]" />
              )}
            </div>
          )}
          models={item.models}
          minPayment={item.minPayment || '-'}
          offers={item.offers}
          detailsHref={item.href}
        />
      )
    }

    return (
      <JobVacancyCard
        dateLabel={formatJobDate(item.createdAt)}
        badge={item.badge}
        title={item.title}
        location={item.location}
        workFormat={item.format}
        experience={item.experience}
        salary={item.salary}
        salaryInfo={item.salaryInfo}
        detailsHref={item.href}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:p-10 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-[1240px] flex-col items-center gap-[40px] overflow-y-auto rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-8 shadow-2xl no-scrollbar md:p-[32px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-col items-start gap-[24px]">
          <div className="flex w-full items-center gap-[16px]">
            <div className="flex flex-1 flex-col items-start gap-[10px]">
              <div className="flex w-full items-center gap-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#262626] py-[8px] pl-[24px] pr-[24px]">
                <div className="flex flex-1 items-center gap-[16px] py-[8px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M21.5308 20.4694L16.8368 15.7763C18.1973 14.1429 18.8757 12.0478 18.7309 9.92694C18.5861 7.80607 17.6293 5.82268 16.0593 4.38935C14.4894 2.95602 12.4274 2.18311 10.3021 2.23141C8.17663 2.27971 6.15181 3.1455 4.64888 4.64867C3.14571 6.15184 2.27993 8.17666 2.23163 10.3019C2.18333 12.4272 2.95623 14.4892 4.38956 16.0591C5.82289 17.629 7.80629 18.5859 9.92715 18.7307C12.048 18.8755 14.1431 18.1971 15.7765 16.8366L20.4696 21.5306C20.5393 21.6003 20.622 21.6556 20.713 21.6933C20.8041 21.731 20.9017 21.7504 21.0002 21.7504C21.0988 21.7504 21.1963 21.731 21.2874 21.6933C21.3784 21.6556 21.4612 21.6003 21.5308 21.5306C21.6005 21.4609 21.6558 21.3782 21.6935 21.2872C21.7312 21.1961 21.7506 21.0985 21.7506 21C21.7506 20.9015 21.7312 20.8039 21.6935 20.7128C21.6558 20.6218 21.6005 20.5391 21.5308 20.4694ZM3.75021 10.5C3.75021 9.16498 4.14609 7.85993 4.88779 6.7499C5.62949 5.63987 6.6837 4.77471 7.9171 4.26381C9.1505 3.75292 10.5075 3.61925 11.8171 3.8797C13.1264 4.14015 14.3292 4.78303 15.2732 5.72703C16.2172 6.67103 16.8601 7.87377 17.1205 9.18314C17.381 10.4925 17.2473 11.8497 16.7364 13.0831C16.2255 14.3165 15.3603 15.3707 14.2503 16.1124C13.1403 16.8541 11.8352 17.25 10.5002 17.25C8.71061 17.248 6.99488 16.5362 5.72944 15.2708C4.464 14.0053 3.7522 12.2896 3.75021 10.5Z" fill="#9E9E9E" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                    className="w-full border-none bg-transparent font-poppins text-[16px] font-medium leading-[26px] text-white outline-none placeholder-[#9E9E9E]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 transition-all hover:rotate-90 active:scale-95"
              aria-label="Close search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.4853 20.4852C20.2977 20.6727 20.0434 20.7781 19.7782 20.7781C19.513 20.7781 19.2586 20.6727 19.0711 20.4852L12 13.4141L4.92893 20.4852C4.7414 20.6727 4.48704 20.7781 4.22183 20.7781C3.95661 20.7781 3.70226 20.6727 3.51472 20.4852C3.32718 20.2976 3.22183 20.0433 3.22183 19.7781C3.22183 19.5128 3.32718 19.2585 3.51472 19.071L10.5858 11.9999L3.51472 4.92882C3.32718 4.74129 3.22182 4.48693 3.22183 4.22172C3.22183 3.9565 3.32718 3.70215 3.51472 3.51461C3.70225 3.32707 3.95661 3.22172 4.22182 3.22172C4.48704 3.22172 4.7414 3.32707 4.92893 3.51461L12 10.5857L19.0711 3.51461C19.2586 3.32707 19.513 3.22172 19.7782 3.22172C20.0434 3.22172 20.2977 3.32707 20.4853 3.51461C20.6728 3.70215 20.7782 3.9565 20.7782 4.22172C20.7782 4.48693 20.6728 4.74129 20.4853 4.92882L13.4142 11.9999L20.4853 19.071C20.6728 19.2585 20.7782 19.5128 20.7782 19.7781C20.7782 20.0433 20.6728 20.2976 20.4853 20.4852Z" fill="#D9D9D9" />
              </svg>
            </button>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-[20px] md:gap-[40px]">
            {scopeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setScope(option.value)}
                className={`font-poppins text-[16px] leading-[26px] transition-colors ${
                  scope === option.value ? 'text-white' : 'text-[#BDBDBD] hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-8">
          {isQueryShort && (
            <div className="flex flex-1 flex-col items-center justify-center gap-[24px]">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#262626] p-[15px]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                  <path d="M28.943 27.0574L21.7483 19.8627C23.2075 17.9991 24.0004 15.7004 24.0003 13.3334C24.0003 7.45208 19.215 2.66675 13.3337 2.66675C7.45233 2.66675 2.66699 7.45208 2.66699 13.3334C2.66699 19.2147 7.45233 24.0001 13.3337 24.0001C15.7004 24 17.9989 23.2077 19.863 21.7494L27.0577 28.9441C27.3078 29.1941 27.6471 29.3345 28.0008 29.3343C28.3545 29.3342 28.6936 29.1936 28.9437 28.9434C29.1937 28.6932 29.3341 28.354 29.3339 28.0003C29.3338 27.6466 29.1932 27.3074 28.943 27.0574ZM5.33366 13.3334C5.33366 8.92141 8.92166 5.33341 13.3337 5.33341C17.7457 5.33341 21.3337 8.92141 21.3337 13.3334C21.3337 17.7454 17.7457 21.3334 13.3337 21.3334C8.92166 21.3334 5.33366 17.7454 5.33366 13.3334Z" fill="#BDBDBD" />
                </svg>
              </div>

              <div className="flex flex-col items-center gap-[16px]">
                <h2 className="text-center font-poppins text-[24px] font-medium leading-[32px] text-white">
                  {isTypingHintState ? 'Keep Typing...' : 'Start Your Search'}
                </h2>
                <p className="text-center font-poppins text-[16px] font-normal leading-[26px] text-[#BDBDBD]">
                  {isTypingHintState
                    ? `Please enter at least ${MIN_QUERY_LENGTH} characters to start searching.`
                    : `Enter at least ${MIN_QUERY_LENGTH} characters to search through our content`}
                </p>
                {isTypingHintState && (
                  <p className="text-center font-poppins text-[14px] font-normal leading-[16px] text-[#757575]">
                    {typedQueryLength}/{MIN_QUERY_LENGTH} characters
                  </p>
                )}
              </div>
            </div>
          )}

          {!isQueryShort && isLoading && (
            <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#262626] px-6 py-5 font-poppins text-[16px] leading-[26px] text-[#BDBDBD]">
              Searching...
            </div>
          )}

          {!isQueryShort && !isLoading && error && (
            <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 font-poppins text-[16px] leading-[26px] text-[#FF9C9C]">
              {error}
            </div>
          )}

          {showNoResults && (
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
                <rect width="120" height="120" rx="60" fill="#262626" />
                <path
                  d="M59.72 90.72C42.7811 90.72 29 76.9389 29 60C29 43.0611 42.7811 29.28 59.72 29.28C76.6589 29.28 90.44 43.0611 90.44 60C90.44 76.9389 76.6589 90.72 59.72 90.72ZM59.72 33.12C44.8982 33.12 32.84 45.1783 32.84 60C32.84 74.8218 44.8982 86.88 59.72 86.88C74.5418 86.88 86.6 74.8218 86.6 60C86.6 45.1783 74.5418 33.12 59.72 33.12ZM74.0189 73.2378C74.2444 73.125 74.4456 72.969 74.6108 72.7785C74.776 72.588 74.9021 72.3669 74.9819 72.1277C75.0616 71.8885 75.0935 71.6359 75.0756 71.3844C75.0577 71.1329 74.9905 70.8873 74.8778 70.6618C74.6986 70.304 70.3843 61.92 59.72 61.92C49.0557 61.92 44.7414 70.304 44.5622 70.6611C44.3356 71.1148 44.2981 71.6398 44.4579 72.1211C44.6177 72.6024 44.9618 73.0008 45.4147 73.2288C45.8685 73.457 46.3941 73.4966 46.877 73.339C47.3599 73.1813 47.7609 72.8392 47.9926 72.3872C48.1315 72.1165 51.4832 65.76 59.72 65.76C67.9568 65.76 71.3085 72.1165 71.4422 72.3789C71.6016 72.6984 71.8471 72.967 72.1509 73.1545C72.4547 73.342 72.8049 73.4409 73.1619 73.44C73.4499 73.44 73.743 73.3754 74.0189 73.2378ZM69.32 56.16C67.2022 56.16 65.48 54.4378 65.48 52.32C65.48 50.2023 67.2022 48.48 69.32 48.48C71.4378 48.48 73.16 50.2023 73.16 52.32C73.16 54.4378 71.4378 56.16 69.32 56.16ZM50.12 56.16C48.0022 56.16 46.28 54.4378 46.28 52.32C46.28 50.2023 48.0022 48.48 50.12 48.48C52.2378 48.48 53.96 50.2023 53.96 52.32C53.96 54.4378 52.2378 56.16 50.12 56.16Z"
                  fill="#BDBDBD"
                />
              </svg>

              <div className="flex flex-col items-center gap-4">
                <h2 className="text-center font-poppins text-[24px] font-medium leading-[32px] text-white">
                  No Results Found
                </h2>
                <p className="text-center font-poppins text-[16px] font-normal leading-[26px]">
                  <span className="text-[#BDBDBD]">We couldn&apos;t find anything matching &quot;</span>
                  <span className="font-medium text-white">{normalizedQuery}</span>
                  <span className="text-[#BDBDBD]">&quot;</span>
                </p>
                <p className="text-center font-poppins text-[14px] font-normal leading-[16px] text-[#757575]">
                  Try adjusting your search or check for typos
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center justify-center gap-3 rounded-[80px] bg-[#F29F04] px-6 py-3 font-poppins text-[16px] font-medium leading-[26px] text-[#0D0D0D] transition-all hover:brightness-110 active:scale-95"
              >
                Clear Search
              </button>
            </div>
          )}

          {!isQueryShort && !isLoading && !error && results.length > 0 && (
            <div className="grid w-full grid-cols-1 items-stretch gap-6 pb-2 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <div key={item.id} className="h-full [&>*]:h-full [&>*]:w-full">
                  {renderResultCard(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
