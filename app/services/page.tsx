'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import UsefulServiceCard from '@/app/components/services/UsefulServiceCard'
import ServicesFilter from '@/app/components/services/ServicesFilter'
import ServiceCardLogo from '@/app/components/services/ServiceCardLogo'
import ForumPagination from '@/app/components/forum/ForumPagination'
import type { ServiceCategory, ServiceItem } from '@/app/types/services'

type ServicesApiResponse = {
  services?: ServiceItem[]
  error?: string
}

type ServiceCategoriesApiResponse = {
  categories?: ServiceCategory[]
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

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [categories, setCategories] = useState<string[]>(['All Services'])
  const [activeCategory, setActiveCategory] = useState('All Services')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [servicesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/services/categories', { cache: 'no-store' }),
        ])

        const servicesData = (await servicesResponse.json().catch(() => null)) as ServicesApiResponse | null
        const categoriesData = (await categoriesResponse.json().catch(() => null)) as ServiceCategoriesApiResponse | null

        if (!servicesResponse.ok) {
          throw new Error(servicesData?.error || 'Unable to load services.')
        }

        if (!categoriesResponse.ok) {
          throw new Error(categoriesData?.error || 'Unable to load service categories.')
        }

        if (!active) {
          return
        }

        const loadedServices = Array.isArray(servicesData?.services) ? servicesData.services : []
        const loadedCategories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : []

        setServices(loadedServices)
        setCategories(['All Services', ...loadedCategories.map((item) => item.name)])
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof Error ? loadError.message : 'Unable to load services.')
        setServices([])
        setCategories(['All Services'])
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

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All Services') {
      return services
    }

    return services.filter((service) => service.category?.name === activeCategory)
  }, [activeCategory, services])

  return (
    <div className="relative flex flex-col items-start bg-[#0D0D0D] overflow-x-hidden font-poppins text-white">
      <ForumHero
        title={(
          <>
            Sharing experience <br className="hidden md:block" /> with the industry
          </>
        )}
        description="We participate in and speak at major affiliate and marketing conferences, sharing insights, strategies, and real case studies from active campaigns"
      />

      <main className="w-full max-w-[1280px] mx-auto px-5 pb-20">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-16">
          <Banner src={promoBannerSrc} alt="Promo banner" className="hidden md:block" />

          <div className="flex flex-col items-center gap-8 w-full">
            <ServicesFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <div className="w-full flex flex-col gap-6">
            {isLoading && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
                Loading services...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[#FF9C9C] text-[16px] leading-[26px]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredServices.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
                No services found.
              </div>
            )}

            {!isLoading && !error && filteredServices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {filteredServices.map((service) => {
                  const logoUrl = toAbsoluteMediaUrl(service.logo?.url)

                  return (
                    <Link
                      key={service.id}
                      href={service.slug ? `/services/${service.slug}` : '/services'}
                      className="block"
                    >
                      <UsefulServiceCard
                        logo={(
                          <ServiceCardLogo
                            src={logoUrl}
                            alt={service.title}
                            width={service.logo?.width}
                            height={service.logo?.height}
                          />
                        )}
                        category={service.category?.name || 'Service'}
                        name={service.title}
                        description={service.description}
                        pricing={service.priceLabel}
                        offer={service.promoDescription || ''}
                        offerBrand={service.promoCode || undefined}
                      />
                    </Link>
                  )
                })}
              </div>
            )}

            {!isLoading && !error && filteredServices.length > 0 && (
              <div className="md:mt-10">
                <ForumPagination
                  showingFrom={1}
                  showingTo={filteredServices.length}
                  total={filteredServices.length}
                  currentPage={1}
                  totalPages={1}
                  itemLabel="services"
                  onPageChange={() => undefined}
                />
              </div>
            )}
          </div>

          <Banner src={promoBannerSrc} alt="Promo banner"/>
        </div>
      </main>
    </div>
  )
}

export default ServicesPage
