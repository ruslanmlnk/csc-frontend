import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBackendUrl } from '@/lib/auth-server'
import { getPartnershipBySlug, getPartnerships } from '@/lib/backend/partnerships'
import PartnershipDetailHero from '@/app/components/partnerships/PartnershipDetailHero'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'
import RichText from '@/app/components/blog/RichText'
import type { PartnershipItem } from '@/app/types/partnerships'

const withBackendUrl = (url: string | undefined | null, backendUrl: string): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const renderPartnershipLogo = (partnership: PartnershipItem, backendUrl: string) => {
  const logoUrl = withBackendUrl(partnership.logo?.url, backendUrl)
  if (!logoUrl) {
    return <div className="h-[56px] w-[120px] rounded-[14px] bg-[#2A2A2A]" />
  }

  return (
    <Image
      src={logoUrl}
      alt={partnership.title}
      width={244}
      height={56}
      className="h-[56px] w-auto object-contain"
    />
  )
}

const PartnershipDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const backendUrl = getBackendUrl()

  const [partnership, allPartnerships] = await Promise.all([getPartnershipBySlug(slug), getPartnerships()])

  if (!partnership) {
    notFound()
  }

  const currentPartnership = partnership as PartnershipItem
  const sidebarImageUrl = withBackendUrl(currentPartnership.sidebarImage?.url, backendUrl)

  const similarByCategory = allPartnerships.filter(
    (item) =>
      item.id !== currentPartnership.id &&
      item.category?.slug &&
      currentPartnership.category?.slug &&
      item.category.slug === currentPartnership.category.slug,
  )
  const similarFallback = allPartnerships.filter((item) => item.id !== currentPartnership.id)
  const similarPartnerships = (similarByCategory.length > 0 ? similarByCategory : similarFallback).slice(0, 3)

  const websiteUrl = currentPartnership.websiteUrl?.trim() ? currentPartnership.websiteUrl : null
  const locationLabel = currentPartnership.location?.name?.trim() || null
  const verticalLabel = (currentPartnership.offers || [])
    .map((item) => item.offer?.trim())
    .filter((value): value is string => Boolean(value))
    .join(' / ')
  const paymentModels = Array.from(
    new Set(
      (currentPartnership.models || [])
        .map((item) => item.model?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-[80px] px-5 pt-[162.69px]">
        <PartnershipDetailHero
          title={currentPartnership.title}
          logo={renderPartnershipLogo(currentPartnership, backendUrl)}
          websiteUrl={websiteUrl}
          foundedYear={currentPartnership.foundedYear}
          locationLabel={locationLabel}
          verticalLabel={verticalLabel || null}
          paymentModels={paymentModels}
          rating={currentPartnership.rating}
        />

        <div className="flex items-start gap-6 self-stretch xl:gap-11">
          <div className="flex min-w-0 flex-1 flex-col gap-[80px]">
            <div className="flex flex-col gap-8 font-poppins text-[20px] leading-[32px] text-[#9E9E9E]">
              <div className="service-content prose prose-invert max-w-none">
                <RichText content={currentPartnership.content} backendUrl={backendUrl} variant="article" />
              </div>
            </div>

            {sidebarImageUrl ? (
              <div className="mx-auto w-full max-w-[380px] xl:hidden">
                <div className="relative h-[727px] w-full overflow-hidden rounded-[20px]">
                  <Image
                    src={sidebarImageUrl}
                    alt={`${currentPartnership.title} sidebar banner`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 380px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {sidebarImageUrl ? (
            <aside className="hidden w-full max-w-[380px] shrink-0 xl:block">
              <div className="sticky top-[140px]">
                <div className="relative h-[727px] w-full overflow-hidden rounded-[20px]">
                  <Image
                    src={sidebarImageUrl}
                    alt={`${currentPartnership.title} sidebar banner`}
                    fill
                    sizes="380px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {similarPartnerships.length > 0 ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-[64px] overflow-hidden px-5 pt-[120px]">
          <h2 className="self-stretch bg-gradient-to-b from-[#FFF] via-[#FFF] to-[#999] bg-clip-text text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
            Similar Partnerships
          </h2>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarPartnerships.map((item) => {
              const logoUrl = withBackendUrl(item.logo?.url, backendUrl)

              return (
                <PartnershipProgramCard
                  key={item.id}
                  title={item.title}
                  rating={item.rating}
                  foundedYear={item.foundedYear}
                  geo={item.location?.name || undefined}
                  logo={(
                    <div className="relative h-[56px] w-full max-w-[244px]">
                      {logoUrl ? (
                        <Image src={logoUrl} alt={item.title} fill sizes="244px" className="object-contain object-left" />
                      ) : (
                        <div className="h-full w-[120px] rounded-[14px] bg-[#2A2A2A]" />
                      )}
                    </div>
                  )}
                  models={(item.models || []).map((model) => model.model).filter(Boolean)}
                  minPayment={item.minPayment}
                  offers={(item.offers || []).map((offer) => offer.offer).filter(Boolean)}
                  detailsHref={item.slug ? `/partnerships/${item.slug}` : `/partnerships/${toSlug(item.title)}`}
                />
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="h-20 w-full" aria-hidden />
    </main>
  )
}

export default PartnershipDetailPage
