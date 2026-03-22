'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import ForumPagination from '@/app/components/forum/ForumPagination'
import ConferenceCard from '@/app/components/conferences/ConferenceCard'
import ConferenceFilters from '@/app/components/conferences/ConferenceFilters'
import { formatConferenceDate } from '@/app/components/conferences/formatConferenceDate'
import type { ConferenceItem } from '@/app/types/conferences'
import type { PageHeroV2 } from '@/lib/backend/pageGlobals'
import { useLanguage } from '@/app/components/i18n/LanguageProvider'

type ConferencesApiResponse = {
  conferences?: ConferenceItem[]
  error?: string
}

type ConferenceFiltersApiResponse = {
  locations?: string[]
  verticals?: string[]
  error?: string
}

interface ConferencesPageClientProps {
  initialHeroV2?: PageHeroV2
}

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'
const CONFERENCES_PER_PAGE = 6

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/')
    ? BACKEND_BASE_URL.slice(0, -1)
    : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const ALL_VALUE = '__all__'

const ConferencesPageClient: React.FC<ConferencesPageClientProps> = ({ initialHeroV2 }) => {
  const { language, messages: t } = useLanguage()
  const [conferences, setConferences] = useState<ConferenceItem[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [verticalOptions, setVerticalOptions] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<string>(ALL_VALUE)
  const [locationFilter, setLocationFilter] = useState<string>(ALL_VALUE)
  const [verticalFilter, setVerticalFilter] = useState<string>(ALL_VALUE)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [conferencesResponse, filtersResponse] = await Promise.all([
          fetch('/api/conferences', { cache: 'no-store' }),
          fetch('/api/conferences/filters', { cache: 'no-store' }),
        ])

        const conferencesData = (await conferencesResponse.json().catch(() => null)) as ConferencesApiResponse | null
        const filtersData = (await filtersResponse.json().catch(() => null)) as ConferenceFiltersApiResponse | null

        if (!conferencesResponse.ok) {
          throw new Error(conferencesData?.error || t.conferences.loading)
        }

        if (!filtersResponse.ok) {
          throw new Error(filtersData?.error || t.conferences.loading)
        }

        if (!active) {
          return
        }

        const loadedConferences = Array.isArray(conferencesData?.conferences) ? conferencesData.conferences : []
        const loadedLocations = Array.isArray(filtersData?.locations) ? filtersData.locations : []
        const loadedVerticals = Array.isArray(filtersData?.verticals) ? filtersData.verticals : []

        setConferences(loadedConferences)
        setLocationOptions(loadedLocations)
        setVerticalOptions(loadedVerticals)
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof Error ? loadError.message : t.conferences.loading)
        setConferences([])
        setLocationOptions([])
        setVerticalOptions([])
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [t.conferences.loading])

  const dateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          conferences
            .map((conference) => formatConferenceDate(conference.conferenceDate, language))
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [conferences, language],
  )

  const filteredConferences = useMemo(() => {
    return conferences.filter((conference) => {
      const conferenceDateLabel = formatConferenceDate(conference.conferenceDate, language)
      const dateMatch = dateFilter === ALL_VALUE || conferenceDateLabel === dateFilter
      const locationMatch = locationFilter === ALL_VALUE || (conference.location?.name || '').trim() === locationFilter
      const verticalMatch = verticalFilter === ALL_VALUE || (conference.vertical?.name || '').trim() === verticalFilter
      return dateMatch && locationMatch && verticalMatch
    })
  }, [conferences, dateFilter, language, locationFilter, verticalFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [dateFilter, locationFilter, verticalFilter])

  const totalPages = Math.max(1, Math.ceil(filteredConferences.length / CONFERENCES_PER_PAGE))
  const normalizedPage = Math.min(currentPage, totalPages)
  const from = (normalizedPage - 1) * CONFERENCES_PER_PAGE
  const paginatedConferences = filteredConferences.slice(from, from + CONFERENCES_PER_PAGE)
  const showingFrom = filteredConferences.length === 0 ? 0 : from + 1
  const showingTo = filteredConferences.length === 0 ? 0 : from + paginatedConferences.length
  const heroTitle = initialHeroV2?.title?.trim()
  const heroDescription = initialHeroV2?.description?.trim()
  const heroBannerSrc = initialHeroV2?.banner?.image?.url || promoBannerSrc
  const heroBannerAlt = initialHeroV2?.banner?.caption?.trim() || (language === 'uk' ? '\u0411\u0430\u043d\u0435\u0440 \u043a\u043e\u043d\u0444\u0435\u0440\u0435\u043d\u0446\u0456\u0439' : 'Conferences banner')
  const heroBannerHref = initialHeroV2?.banner?.link?.trim()

  return (
    <div className="relative flex flex-col items-start overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <ForumHero
        title={
          heroTitle || (
            <>
              {t.conferences.heroTitle}
            </>
          )
        }
        description={
          heroDescription || t.conferences.heroDescription
        }
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-20">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
          <Banner
            src={heroBannerSrc}
            alt={heroBannerAlt}
            href={heroBannerHref}
            className="hidden md:block"
          />

          {!isLoading && !error && conferences.length > 0 ? (
            <ConferenceFilters
              dateValue={dateFilter}
              locationValue={locationFilter}
              verticalValue={verticalFilter}
              dateOptions={dateOptions}
              locationOptions={locationOptions}
              verticalOptions={verticalOptions}
              onDateChange={setDateFilter}
              onLocationChange={setLocationFilter}
              onVerticalChange={setVerticalFilter}
            />
          ) : null}

          <div className="flex w-full flex-col gap-6">
            {isLoading && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                {t.conferences.loading}
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredConferences.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                {t.conferences.noResults}
              </div>
            )}

            {!isLoading && !error && paginatedConferences.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                {paginatedConferences.map((conference) => {
                  const mainImageUrl = toAbsoluteMediaUrl(conference.mainImage?.url)
                  const detailsHref = conference.slug ? `/conferences/${conference.slug}` : '/conferences'

                  return (
                    <ConferenceCard
                      key={conference.id}
                      title={conference.title}
                      imageSrc={mainImageUrl}
                      location={conference.location?.name}
                      dateLabel={formatConferenceDate(conference.conferenceDate, language)}
                      topicsLabel={conference.vertical?.name}
                      detailsHref={detailsHref}
                      detailsLabel={t.common.moreDetails}
                    />
                  )
                })}
              </div>
            )}

            {!isLoading && !error && filteredConferences.length > 0 && (
              <div className="md:mt-10">
                <ForumPagination
                  showingFrom={showingFrom}
                  showingTo={showingTo}
                  total={filteredConferences.length}
                  currentPage={normalizedPage}
                  totalPages={totalPages}
                  itemLabel={t.conferences.itemLabel}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ConferencesPageClient
