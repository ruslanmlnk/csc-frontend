'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import ForumPagination from '@/app/components/forum/ForumPagination'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'
import PartnershipsFilters from '@/app/components/partnerships/PartnershipsFilters'
import type { PartnershipCategory, PartnershipItem } from '@/app/types/partnerships'

type PartnershipsApiResponse = {
  partnerships?: PartnershipItem[]
  error?: string
}

type PartnershipCategoriesApiResponse = {
  categories?: PartnershipCategory[]
  error?: string
}

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const ALL_CATEGORIES = 'All Categories'
const ALL_LOCATIONS = 'Location'
const ALL_VERTICALS = 'Vertical'
const ALL_PAYMENT_MODELS = 'Payment model'

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const PartnershipsPage: React.FC = () => {
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>([])
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORIES])
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState(ALL_LOCATIONS)
  const [verticalFilter, setVerticalFilter] = useState(ALL_VERTICALS)
  const [paymentModelFilter, setPaymentModelFilter] = useState(ALL_PAYMENT_MODELS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
          throw new Error(partnershipsData?.error || 'Unable to load partnerships.')
        }

        if (!categoriesResponse.ok) {
          throw new Error(categoriesData?.error || 'Unable to load partnership categories.')
        }

        if (!active) return

        const loadedPartnerships = Array.isArray(partnershipsData?.partnerships) ? partnershipsData.partnerships : []
        const loadedCategories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : []

        setPartnerships(loadedPartnerships)
        setCategories([ALL_CATEGORIES, ...loadedCategories.map((item) => item.name)])
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load partnerships.')
        setPartnerships([])
        setCategories([ALL_CATEGORIES])
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const locationOptions = useMemo(
    () =>
      [
        ALL_LOCATIONS,
        ...Array.from(
          new Set(partnerships.map((item) => item.location?.name?.trim()).filter((value): value is string => Boolean(value))),
        ),
      ],
    [partnerships],
  )

  const verticalOptions = useMemo(
    () =>
      [
        ALL_VERTICALS,
        ...Array.from(
          new Set(
            partnerships.flatMap((item) =>
              (item.offers || []).map((offer) => offer.offer?.trim()).filter((value): value is string => Boolean(value)),
            ),
          ),
        ),
      ],
    [partnerships],
  )

  const paymentModelOptions = useMemo(
    () =>
      [
        ALL_PAYMENT_MODELS,
        ...Array.from(
          new Set(
            partnerships.flatMap((item) =>
              (item.models || []).map((model) => model.model?.trim()).filter((value): value is string => Boolean(value)),
            ),
          ),
        ),
      ],
    [partnerships],
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

      const categoryMatch = activeCategory === ALL_CATEGORIES || categoryName === activeCategory
      const locationMatch = locationFilter === ALL_LOCATIONS || locationName === locationFilter
      const verticalMatch = verticalFilter === ALL_VERTICALS || offers.includes(verticalFilter)
      const paymentModelMatch = paymentModelFilter === ALL_PAYMENT_MODELS || models.includes(paymentModelFilter)

      return searchMatch && categoryMatch && locationMatch && verticalMatch && paymentModelMatch
    })
  }, [activeCategory, locationFilter, partnerships, paymentModelFilter, searchQuery, verticalFilter])

  return (
    <div className="relative flex flex-col items-start overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <ForumHero
        title={(
          <>
            Trusted partnership <br className="hidden md:block" /> programs
          </>
        )}
        description="Discover affiliate programs, compare conditions, and choose the best partner for your traffic and growth goals."
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-20">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
          <Banner src={promoBannerSrc} alt="Partnerships banner" className="hidden md:block" />

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
                Loading partnerships...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredPartnerships.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                No partnerships found.
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
                itemLabel="partnerships"
                onPageChange={() => undefined}
              />
            )}
          </div>

          <Banner src={promoBannerSrc} alt="Partnerships banner" className="mt-6" />
        </div>
      </main>
    </div>
  )
}

export default PartnershipsPage
