'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import UsefulServiceCard from '@/app/components/services/UsefulServiceCard'
import type { ServiceItem } from '@/app/types/services'

type ServicesApiResponse = {
  services?: ServiceItem[]
  error?: string
}

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

const UsefulServices: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadServices = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/services', { cache: 'no-store' })
        const data = (await response.json().catch(() => null)) as ServicesApiResponse | null

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load services.')
        }

        if (!active) return

        const docs = Array.isArray(data?.services) ? data.services : []
        setServices(docs.slice(0, 3))
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load services.')
        setServices([])
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadServices()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="w-full px-5 flex flex-col gap-16 bg-[#0D0D0D] max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
        <h2 className="font-['Poppins'] text-[32px] md:text-[56px] font-medium leading-tight md:leading-[72px] tracking-[-1.28px] md:tracking-[-2.24px] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#999] text-center md:text-left">
          Useful Services
        </h2>
        <Link
          href="/services"
          className="flex py-[11px] px-[24px] justify-center items-center gap-[10px] rounded-[80px] border border-[#F29F04] text-[#F29F04] font-['Poppins'] text-[16px] font-medium leading-[26px] hover:bg-[#F29F04]/10 transition-all active:scale-95"
        >
          See More
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
          Loading services...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[#FF9C9C] text-[16px] leading-[26px]">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {services.map((service) => {
            const logoUrl = toAbsoluteMediaUrl(service.logo?.url)

            return (
              <Link key={service.id} href={service.slug ? `/services/${service.slug}` : '/services'} className="block">
                <UsefulServiceCard
                  logo={(
                    <div className="relative w-[56px] h-[56px] flex items-center justify-center">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={service.title}
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-[14px] bg-[#2A2A2A]" />
                      )}
                    </div>
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
      ) : null}
    </section>
  )
}

export default UsefulServices
