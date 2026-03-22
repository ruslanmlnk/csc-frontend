'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import ForumPagination from '@/app/components/forum/ForumPagination'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'
import PartnershipsFilters from '@/app/components/partnerships/PartnershipsFilters'
import type { PartnershipCategory, PartnershipItem } from '@/app/types/partnerships'
import type { PageHeroV2 } from '@/lib/backend/pageGlobals'
import { useLanguage } from '@/app/components/i18n/LanguageProvider'

type PartnershipsApiResponse = {
  partnerships?: PartnershipItem[]
  error?: string
}

type PartnershipCategoriesApiResponse = {
  categories?: PartnershipCategory[]
  error?: string
}

interface PartnershipsPageClientProps {
  initialHeroV2?: PageHeroV2
}

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const PartnershipsPageClient: React.FC<PartnershipsPageClientProps> = ({ initialHeroV2 }) => {
  const { language, messages: t } = useLanguage()
  const allCategories = t.partnerships.allCategories
  const allLocations = t.partnerships.allLocations
  const allVerticals = t.partnerships.allVerticals
  const allPaymentModels = t.partnerships.allPaymentModels
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([])
  const [categories, setCategories] = useState<string[]>([allCategories])
  const [activeCategory, setActiveCategory] = useState<string>(allCategories)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState<string>(allLocations)
  const [verticalFilter, setVerticalFilter] = useState<string>(allVerticals)
  const [paymentModelFilter, setPaymentModelFilter] = useState<string>(allPaymentModels)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const heroTitle = initialHeroV2?.title?.trim()
  const heroDescription = initialHeroV2?.description?.trim()
  const heroBannerSrc = initialHeroV2?.banner?.image?.url || promoBannerSrc
  const heroBannerAlt = initialHeroV2?.banner?.caption?.trim() || (language === 'uk' ? '\u0411\u0430\u043d\u0435\u0440 \u043f\u0430\u0440\u0442\u043d\u0435\u0440\u043e\u043a' : 'Partnerships banner')
  const heroBannerHref = initialHeroV2?.banner?.link?.trim()

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [partnershipsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/partnerships', { cache: 'no-store' }),
          fetch('/api/partnerships/categories', { cache: 'no-store' }),
        ])

        const partnershipsData = (await partnershipsResponse.json().catch(() => null)) as PartnershipsApiResponse | null
        const categoriesData = (await categoriesResponse.json().catch(() => null)) as PartnershipCategoriesApiResponse | null

        if (!partnershipsResponse.ok) {
          throw new Error(partnershipsData?.error || t.partnerships.loading)
        }

        if (!categoriesResponse.ok) {
          throw new Error(categoriesData?.error || t.partnerships.loading)
        }

        if (!active) return

        const loadedPartnerships = Array.isArray(partnershipsData?.partnerships) ? partnershipsData.partnerships : []
        const loadedCategories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : []

        setPartnerships(loadedPartnerships)
        setCategories([allCategories, ...loadedCategories.map((item) => item.name)])
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : t.partnerships.loading)
        setPartnerships([])
        setCategories([allCategories])
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [allCategories, t.partnerships.loading])

  const locationOptions = useMemo(
    () =>
      [
        allLocations,
        ...Array.from(
          new Set(partnerships.map((item) => item.location?.name?.trim()).filter((value): value is string => Boolean(value))),
        ),
      ],
    [allLocations, partnerships],
  )

  const verticalOptions = useMemo(
    () =>
      [
        allVerticals,
        ...Array.from(
          new Set(
            partnerships.flatMap((item) =>
              (item.offers || []).map((offer) => offer.offer?.trim()).filter((value): value is string => Boolean(value)),
            ),
          ),
        ),
      ],
    [allVerticals, partnerships],
  )

  const paymentModelOptions = useMemo(
    () =>
      [
        allPaymentModels,
        ...Array.from(
          new Set(
            partnerships.flatMap((item) =>
              (item.models || []).map((model) => model.model?.trim()).filter((value): value is string => Boolean(value)),
            ),
          ),
        ),
      ],
    [allPaymentModels, partnerships],
  )

  const filteredPartnerships = useMemo(() => {
    return partnerships.filter((partnership) => {
      const categoryName = partnership.category?.name || ''
      const locationName = partnership.location?.name || ''
      const models = (partnership.models || []).map((item) => item.model).filter(Boolean)
      const offers = (partnership.offers || []).map((item) => item.offer).filter(Boolean)
      const loweredQuery = searchQuery.toLowerCase().trim()

      const searchMatch =
        !loweredQuery ||
        partnership.title.toLowerCase().includes(loweredQuery) ||
        categoryName.toLowerCase().includes(loweredQuery) ||
        locationName.toLowerCase().includes(loweredQuery) ||
        partnership.rating.toLowerCase().includes(loweredQuery) ||
        partnership.foundedYear.toLowerCase().includes(loweredQuery) ||
        partnership.minPayment.toLowerCase().includes(loweredQuery) ||
        models.some((value) => value.toLowerCase().includes(loweredQuery)) ||
        offers.some((value) => value.toLowerCase().includes(loweredQuery))

      const categoryMatch = activeCategory === allCategories || categoryName === activeCategory
      const locationMatch = locationFilter === allLocations || locationName === locationFilter
      const verticalMatch = verticalFilter === allVerticals || offers.includes(verticalFilter)
      const paymentModelMatch = paymentModelFilter === allPaymentModels || models.includes(paymentModelFilter)

      return searchMatch && categoryMatch && locationMatch && verticalMatch && paymentModelMatch
    })
  }, [activeCategory, allCategories, allLocations, allPaymentModels, allVerticals, locationFilter, partnerships, paymentModelFilter, searchQuery, verticalFilter])

  return (
    <div className="relative flex flex-col items-start overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <ForumHero
        title={
          heroTitle || (
            <>
              {t.partnerships.heroTitle}
            </>
          )
        }
        description={
          heroDescription || t.partnerships.heroDescription
        }
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-20">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
          <Banner
            src={heroBannerSrc}
            alt={heroBannerAlt}
            href={heroBannerHref}
            className="mb-4"
          />

          <PartnershipsFilters
            searchValue={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => setSearchQuery(searchInput.trim())}
            locations={locationOptions}
            verticals={verticalOptions}
            paymentModels={paymentModelOptions}
            locationValue={locationFilter}
            verticalValue={verticalFilter}
            paymentModelValue={paymentModelFilter}
            onLocationChange={setLocationFilter}
            onVerticalChange={setVerticalFilter}
            onPaymentModelChange={setPaymentModelFilter}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex w-full flex-col gap-6">
            {isLoading && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                {t.partnerships.loading}
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredPartnerships.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                {t.partnerships.noResults}
              </div>
            )}

            {!isLoading && !error && filteredPartnerships.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPartnerships.map((partnership) => {
                  const logoUrl = toAbsoluteMediaUrl(partnership.logo?.url)

                  return (
                    <PartnershipProgramCard
                      key={partnership.id}
                      title={partnership.title}
                      rating={partnership.rating}
                      foundedYear={partnership.foundedYear}
                      geo={partnership.location?.name || undefined}
                      logo={(
                        <div className="relative h-[56px] w-full max-w-[244px]">
                          {logoUrl ? (
                            <Image
                              src={logoUrl}
                              alt={partnership.title}
                              fill
                              sizes="244px"
                              className="object-contain object-left"
                            />
                          ) : (
                            <div className="h-full w-[120px] rounded-[14px] bg-[#2A2A2A]" />
                          )}
                        </div>
                      )}
                      models={(partnership.models || []).map((item) => item.model).filter(Boolean)}
                      minPayment={partnership.minPayment}
                      offers={(partnership.offers || []).map((item) => item.offer).filter(Boolean)}
                      detailsHref={partnership.slug ? `/partnerships/${partnership.slug}` : '/partnerships'}
                      foundedLabel={language === 'uk' ? '\u0417\u0430\u0441\u043d\u043e\u0432\u0430\u043d\u043e' : 'Founded'}
                      modelsLabel={language === 'uk' ? '\u041c\u043e\u0434\u0435\u043b\u0456' : 'Models'}
                      geoLabel={language === 'uk' ? '\u0413\u0435\u043e' : 'Geo'}
                      minPaymentLabel={language === 'uk' ? '\u041c\u0456\u043d\u0456\u043c\u0430\u043b\u044c\u043d\u0430 \u0432\u0438\u043f\u043b\u0430\u0442\u0430' : 'Minimum payment'}
                      detailsLabel={t.common.moreDetails}
                    />
                  )
                })}
              </div>
            )}

            {!isLoading && !error && filteredPartnerships.length > 0 && (
              <ForumPagination
                showingFrom={1}
                showingTo={filteredPartnerships.length}
                total={filteredPartnerships.length}
                currentPage={1}
                totalPages={1}
                itemLabel={t.partnerships.itemLabel}
                onPageChange={() => undefined}
              />
            )}
          </div>

          <Banner
            src={heroBannerSrc}
            alt={heroBannerAlt}
            href={heroBannerHref}
            className="mt-4"
          />
        </div>
      </main>
    </div>
  )
}

export default PartnershipsPageClient
