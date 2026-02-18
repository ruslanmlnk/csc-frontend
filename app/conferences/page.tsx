'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import ForumPagination from '@/app/components/forum/ForumPagination'
import ConferenceCard from '@/app/components/conferences/ConferenceCard'
import ConferenceFilters from '@/app/components/conferences/ConferenceFilters'
import { formatConferenceDate } from '@/app/components/conferences/formatConferenceDate'
import type { ConferenceItem } from '@/app/types/conferences'

type ConferencesApiResponse = {
  conferences?: ConferenceItem[]
  error?: string
}

type ConferenceFiltersApiResponse = {
  locations?: string[]
  verticals?: string[]
  error?: string
}

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'

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

const ConferencesPage: React.FC = () => {
  const [conferences, setConferences] = useState<ConferenceItem[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [verticalOptions, setVerticalOptions] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<string>(ALL_VALUE)
  const [locationFilter, setLocationFilter] = useState<string>(ALL_VALUE)
  const [verticalFilter, setVerticalFilter] = useState<string>(ALL_VALUE)
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
          throw new Error(conferencesData?.error || 'Unable to load conferences.')
        }

        if (!filtersResponse.ok) {
          throw new Error(filtersData?.error || 'Unable to load conference filters.')
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
        setError(loadError instanceof Error ? loadError.message : 'Unable to load conferences.')
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
  }, [])

  const dateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          conferences
            .map((conference) => formatConferenceDate(conference.conferenceDate))
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [conferences],
  )

  const filteredConferences = useMemo(() => {
    return conferences.filter((conference) => {
      const conferenceDateLabel = formatConferenceDate(conference.conferenceDate)
      const dateMatch = dateFilter === ALL_VALUE || conferenceDateLabel === dateFilter
      const locationMatch = locationFilter === ALL_VALUE || (conference.location?.name || '').trim() === locationFilter
      const verticalMatch = verticalFilter === ALL_VALUE || (conference.vertical?.name || '').trim() === verticalFilter
      return dateMatch && locationMatch && verticalMatch
    })
  }, [conferences, dateFilter, locationFilter, verticalFilter])

  return (
    <div className="relative flex flex-col items-start overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <ForumHero
        title={(
          <>
            Sharing experience <br className="hidden md:block" /> with the industry
          </>
        )}
        description="We participate in and speak at major affiliate and marketing conferences, sharing insights, strategies, and real case studies from active campaigns"
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-20">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
          <Banner src={promoBannerSrc} alt="Promo banner" className="hidden md:block" />

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
                Loading conferences...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredConferences.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                No conferences found.
              </div>
            )}

            {!isLoading && !error && filteredConferences.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                {filteredConferences.map((conference) => {
                  const mainImageUrl = toAbsoluteMediaUrl(conference.mainImage?.url)
                  const detailsHref = conference.slug ? `/conferences/${conference.slug}` : '/conferences'

                  return (
                    <ConferenceCard
                      key={conference.id}
                      title={conference.title}
                      imageSrc={mainImageUrl}
                      location={conference.location?.name}
                      dateLabel={formatConferenceDate(conference.conferenceDate)}
                      topicsLabel={conference.vertical?.name}
                      detailsHref={detailsHref}
                    />
                  )
                })}
              </div>
            )}

            {!isLoading && !error && filteredConferences.length > 0 && (
              <div className="md:mt-10">
                <ForumPagination
                  showingFrom={1}
                  showingTo={filteredConferences.length}
                  total={filteredConferences.length}
                  currentPage={1}
                  totalPages={1}
                  itemLabel="conferences"
                  onPageChange={() => undefined}
                />
              </div>
            )}
          </div>

          <Banner src={promoBannerSrc} alt="Promo banner" className="mt-6" />
        </div>
      </main>
    </div>
  )
}

export default ConferencesPage
