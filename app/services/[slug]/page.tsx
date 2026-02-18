import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBackendUrl } from '@/lib/auth-server'
import { getServiceBySlug, getServices } from '@/lib/backend/services'
import ServiceDetailHero from '@/app/components/services/ServiceDetailHero'
import ServicePromoCode from '@/app/components/services/ServicePromoCode'
import UsefulServiceCard from '@/app/components/services/UsefulServiceCard'
import RichText from '@/app/components/blog/RichText'
import type { ServiceItem } from '@/app/types/services'

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

const renderServiceLogo = (service: ServiceItem, backendUrl: string) => {
  const logoUrl = withBackendUrl(service.logo?.url, backendUrl)
  if (!logoUrl) {
    return <div className="h-[56px] w-[120px] rounded-[14px] bg-[#2A2A2A]" />
  }

  const width = service.logo?.width ?? 140
  const height = service.logo?.height ?? 56

  return (
    <Image
      src={logoUrl}
      alt={service.title}
      width={width}
      height={height}
      className="h-[56px] w-auto object-contain"
    />
  )
}

const ServiceDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const backendUrl = getBackendUrl()

  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices()])

  if (!service) {
    notFound()
  }

  const currentService = service as ServiceItem
  const mainImageUrl = withBackendUrl(currentService.mainImage?.url, backendUrl)
  const sidebarImageUrl = withBackendUrl(currentService.sidebarImage?.url, backendUrl)

  const similarServicesByCategory = allServices.filter(
    (item) =>
      item.id !== currentService.id &&
      item.category?.slug &&
      currentService.category?.slug &&
      item.category.slug === currentService.category.slug,
  )

  const similarServicesFallback = allServices.filter((item) => item.id !== currentService.id)

  const similarServices = (
    similarServicesByCategory.length > 0 ? similarServicesByCategory : similarServicesFallback
  ).slice(0, 3)

  const categoryName = currentService.category?.name || 'Service'
  const serviceHandle = currentService.handle?.trim() ? currentService.handle : null
  const serviceWebsiteUrl = currentService.websiteUrl?.trim() ? currentService.websiteUrl : null

  return (
    <main className="min-h-screen bg-[#0D0D0D] overflow-x-hidden font-poppins text-white">
      <div className="w-full max-w-[1280px] px-5 pt-[162.69px] mx-auto flex flex-col items-start gap-[80px]">
        <ServiceDetailHero
          title={currentService.title}
          logo={renderServiceLogo(currentService, backendUrl)}
          websiteUrl={serviceWebsiteUrl}
          price={currentService.priceLabel}
          handle={serviceHandle}
          category={categoryName}
        />

        <div className="flex items-start gap-[64px] self-stretch">
          <div className="flex flex-col gap-[80px] flex-1">
            <div className="text-[#9E9E9E] text-[20px] leading-[32px] font-poppins flex flex-col gap-8">
              <div className="service-content prose prose-invert max-w-none">
                <RichText content={currentService.content} backendUrl={backendUrl} />
              </div>
            </div>

            {mainImageUrl ? (
              <div className="w-full h-[101px] relative rounded-[40px] overflow-hidden">
                <Image
                  src={mainImageUrl}
                  alt={`${currentService.title} banner`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1240px"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            {currentService.promoCode ? (
              <div className="flex p-[32px_40px] justify-center items-center gap-[24px] self-stretch rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] overflow-hidden relative">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: [
                      'radial-gradient(35% 35% at 50% 30%, rgba(242, 159, 4, 0.26) 0%, rgba(242, 159, 4, 0.5) 100%)',
                      'linear-gradient(180deg, rgba(255, 216, 212, 0.16) 0%, rgba(255, 156, 148, 0.19) 100%)',
                    ].join(','),
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(167deg, rgba(242, 159, 4, 0.08) 0px, rgba(242, 159, 4, 0.08) 1px, transparent 1px, transparent 28px)',
                  }}
                />

                <div className="relative z-10 w-full">
                  <ServicePromoCode
                    promoCode={currentService.promoCode}
                    description={currentService.promoDescription || ''}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {sidebarImageUrl ? (
            <div className="w-[380px] shrink-0 hidden xl:block">
              <div className="w-[380px] h-[727px] rounded-[20px] overflow-hidden relative">
                <Image
                  src={sidebarImageUrl}
                  alt={`${currentService.title} sidebar banner`}
                  fill
                  sizes="380px"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {similarServices.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-[64px] px-5 pt-[120px] pb-20 w-full max-w-[1280px] mx-auto overflow-hidden">
          <h2 className="text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-gradient-to-b from-[#FFF] via-[#FFF] to-[#999] self-stretch">
            Similar Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px] self-stretch">
            {similarServices.map((item) => (
              <Link
                key={item.id}
                href={item.slug ? `/services/${item.slug}` : `/services/${toSlug(item.title)}`}
                className="block"
              >
                <UsefulServiceCard
                  logo={(
                    <div className="relative w-[56px] h-[56px] flex items-center justify-center">
                      {withBackendUrl(item.logo?.url, backendUrl) ? (
                        <Image
                          src={withBackendUrl(item.logo?.url, backendUrl) as string}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full rounded-[14px] bg-[#2A2A2A]" />
                      )}
                    </div>
                  )}
                  category={item.category?.name || 'Service'}
                  name={item.title}
                  description={item.description}
                  pricing={item.priceLabel}
                  offer={item.promoDescription || ''}
                  offerBrand={item.promoCode || undefined}
                />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default ServiceDetailPage
