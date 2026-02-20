'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'
import type { PartnershipItem } from '@/app/types/partnerships'

type PartnershipsApiResponse = {
  partnerships?: PartnershipItem[]
  error?: string
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
const MAX_VISIBLE_PROGRAMS = 3

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

interface PartnershipProgramsProps {
  banner?: {
    caption?: string | null
    link?: string | null
    image?: {
      url?: string | null
    } | null
  } | null
}

const PartnershipPrograms: React.FC<PartnershipProgramsProps> = ({ banner }) => {
  const [programs, setPrograms] = useState<PartnershipItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadPrograms = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/partnerships', { cache: 'no-store' })
        const payload = (await response.json().catch(() => null)) as PartnershipsApiResponse | null

        if (!response.ok) {
          throw new Error(payload?.error || 'Unable to load partnerships.')
        }

        if (!active) {
          return
        }

        const loadedPrograms = Array.isArray(payload?.partnerships) ? payload.partnerships : []
        setPrograms(loadedPrograms)
      } catch (loadError) {
        if (!active) {
          return
        }
        setPrograms([])
        setError(loadError instanceof Error ? loadError.message : 'Unable to load partnerships.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadPrograms()

    return () => {
      active = false
    }
  }, [])

  const visiblePrograms = useMemo(() => programs.slice(0, MAX_VISIBLE_PROGRAMS), [programs])

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center overflow-hidden px-5 py-[120px]">
      <div className="mb-16 flex w-full items-center justify-between">
        <h2 className="bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)] bg-clip-text font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
          Partnerships Programs
        </h2>
        <Link
          href="/partnerships"
          className="hidden md:flex items-center justify-center gap-4 rounded-[80px] border border-[#FCC660] px-6 py-3 font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95"
        >
          See More
        </Link>
      </div>

      {isLoading && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          Loading partnerships...
        </div>
      )}

      {!isLoading && error && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
          {error}
        </div>
      )}

      {!isLoading && !error && visiblePrograms.length === 0 && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          No partnership programs found.
        </div>
      )}

      {!isLoading && !error && visiblePrograms.length > 0 && (
        <div className="mb-16 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {visiblePrograms.map((program) => {
            const logoUrl = toAbsoluteMediaUrl(program.logo?.url)
            const models = (program.models || []).map((item) => item.model).filter(Boolean)
            const offers = (program.offers || []).map((item) => item.offer).filter(Boolean)

            return (
              <PartnershipProgramCard
                key={program.id}
                title={program.title}
                rating={program.rating || '-'}
                foundedYear={program.foundedYear || '-'}
                geo={program.location?.name || undefined}
                logo={(
                  <div className="relative h-[56px] w-full max-w-[244px]">
                    {logoUrl ? (
                      <Image src={logoUrl} alt={program.title} fill sizes="244px" className="object-contain object-left" />
                    ) : (
                      <div className="h-full w-[120px] rounded-[14px] bg-[#2A2A2A]" />
                    )}
                  </div>
                )}
                models={models}
                minPayment={program.minPayment || '-'}
                offers={offers}
                detailsHref={program.slug ? `/partnerships/${program.slug}` : '/partnerships'}
              />
            )
          })}
        </div>
      )}

      <Link
        href="/partnerships"
        className="mt-8 flex w-full max-w-fit items-center justify-center gap-4 self-center rounded-[80px] border border-[#FCC660] px-6 py-3 font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95 md:hidden"
      >
        See More
      </Link>

      {(banner?.image?.url || !banner) && (
        <div className="mt-[55px] hidden w-full max-w-[1240px] md:block">
          <div className="relative aspect-[1240/158] w-full overflow-hidden rounded-[40px]">
            {banner?.link ? (
              <Link href={banner.link} target={banner.link.startsWith('http') ? '_blank' : undefined}>
                <Image
                  src={banner.image?.url || '/images/partnership-banner.png'}
                  alt={banner.caption || 'Partnership Banner'}
                  fill
                  sizes="1240px"
                  className="object-cover"
                />
              </Link>
            ) : (
              <Image
                src={banner?.image?.url || '/images/partnership-banner.png'}
                alt={banner?.caption || 'Partnership Banner'}
                fill
                sizes="1240px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default PartnershipPrograms
