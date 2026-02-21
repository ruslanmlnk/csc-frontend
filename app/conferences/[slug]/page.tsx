import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBackendUrl } from '@/lib/auth-server'
import { getConferenceBySlug, getConferences } from '@/lib/backend/conferences'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const conference = await getConferenceBySlug(slug)
  if (!conference) return {}

  return {
    robots: conference.noindex ? { index: false, follow: true } : undefined,
  }
}
import ConferenceDetailHero from '@/app/components/conferences/ConferenceDetailHero'
import ConferenceCard from '@/app/components/conferences/ConferenceCard'
import RichText from '@/app/components/blog/RichText'
import type { ConferenceItem } from '@/app/types/conferences'
import { formatConferenceDate } from '@/app/components/conferences/formatConferenceDate'

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

const renderConferenceLogo = (conference: ConferenceItem, backendUrl: string) => {
  const logoUrl = withBackendUrl(conference.logo?.url, backendUrl)
  if (!logoUrl) {
    return <div className="h-[56px] w-[56px] rounded-[10px] bg-[#2A2A2A]" />
  }

  return (
    <Image
      src={logoUrl}
      alt={conference.title}
      width={56}
      height={56}
      className="h-[56px] w-[56px] rounded-[10px] object-cover"
    />
  )
}

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = backendBaseUrl.endsWith('/') ? backendBaseUrl.slice(0, -1) : backendBaseUrl
  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  return `${normalizedBase}${normalizedPath}`
}

const ConferenceDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const backendUrl = getBackendUrl()

  const [conference, allConferences] = await Promise.all([getConferenceBySlug(slug), getConferences()])

  if (!conference) {
    notFound()
  }

  const currentConference = conference as ConferenceItem
  const mainImageUrl = withBackendUrl(currentConference.mainImage?.url, backendUrl)
  const sidebarBannerImageUrl = withBackendUrl(currentConference.sidebarBanner?.image?.url, backendUrl)
  const sidebarBannerHref = currentConference.sidebarBanner?.link?.trim() || null
  const sidebarBannerAlt =
    currentConference.sidebarBanner?.caption?.trim() || `${currentConference.title} sidebar banner`
  const isSidebarBannerExternal = Boolean(sidebarBannerHref && /^https?:\/\//i.test(sidebarBannerHref))

  const similarConferences = allConferences.filter((item) => item.id !== currentConference.id).slice(0, 3)
  const conferenceWebsiteUrl = currentConference.websiteUrl?.trim() ? currentConference.websiteUrl : null
  const conferenceDateLabel = formatConferenceDate(currentConference.conferenceDate)
  const conferenceLocationLabel = currentConference.location?.name?.trim() || null
  const conferenceVerticalLabel = currentConference.vertical?.name?.trim() || null

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-[80px] px-5 pt-[162.69px]">
        <ConferenceDetailHero
          title={currentConference.title}
          logo={renderConferenceLogo(currentConference, backendUrl)}
          websiteUrl={conferenceWebsiteUrl}
          dateLabel={conferenceDateLabel}
          locationLabel={conferenceLocationLabel}
          verticalLabel={conferenceVerticalLabel}
        />

        <div className="flex items-start gap-6 self-stretch xl:gap-11">
          <div className="flex min-w-0 flex-1 flex-col gap-[80px]">
            <div className="flex flex-col gap-8 font-poppins text-[20px] leading-[32px] text-[#9E9E9E]">
              <div className="service-content prose prose-invert max-w-none">
                <RichText content={currentConference.content} backendUrl={backendUrl} variant="article" />
              </div>
            </div>

            {mainImageUrl ? (
              <div className="relative h-[196.009px] w-full overflow-hidden rounded-[40px] md:h-[101px]">
                <Image
                  src={mainImageUrl}
                  alt={`${currentConference.title} banner`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1240px"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            {sidebarBannerImageUrl ? (
              <div className="mx-auto w-full max-w-[380px] xl:hidden">
                {sidebarBannerHref ? (
                  <a
                    href={sidebarBannerHref}
                    target={isSidebarBannerExternal ? '_blank' : undefined}
                    rel={isSidebarBannerExternal ? 'noopener noreferrer' : undefined}
                    className="relative block h-[727px] w-full overflow-hidden rounded-[20px]"
                    aria-label={sidebarBannerAlt}
                  >
                    <Image
                      src={sidebarBannerImageUrl}
                      alt={sidebarBannerAlt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 380px"
                      className="h-full w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="relative h-[727px] w-full overflow-hidden rounded-[20px]">
                    <Image
                      src={sidebarBannerImageUrl}
                      alt={sidebarBannerAlt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 380px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <aside className="hidden w-full max-w-[380px] shrink-0 xl:block">
            {sidebarBannerImageUrl ? (
              <div className="sticky top-[140px]">
                {sidebarBannerHref ? (
                  <a
                    href={sidebarBannerHref}
                    target={isSidebarBannerExternal ? '_blank' : undefined}
                    rel={isSidebarBannerExternal ? 'noopener noreferrer' : undefined}
                    className="relative block h-[727px] w-full overflow-hidden rounded-[20px]"
                    aria-label={sidebarBannerAlt}
                  >
                    <Image
                      src={sidebarBannerImageUrl}
                      alt={sidebarBannerAlt}
                      fill
                      sizes="380px"
                      className="h-full w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="relative h-[727px] w-full overflow-hidden rounded-[20px]">
                    <Image
                      src={sidebarBannerImageUrl}
                      alt={sidebarBannerAlt}
                      fill
                      sizes="380px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="sticky top-[140px] h-[727px] w-full invisible" />
            )}
          </aside>
        </div>
      </div>

      {similarConferences.length > 0 ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-[64px] overflow-hidden px-5 pb-20 pt-[120px]">
          <h2 className="self-stretch bg-gradient-to-b from-[#FFF] via-[#FFF] to-[#999] bg-clip-text text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
            Similar Conferences
          </h2>

          <div className="grid self-stretch grid-cols-1 gap-[24px] md:grid-cols-2">
            {similarConferences.map((item) => (
              <ConferenceCard
                key={item.id}
                title={item.title}
                imageSrc={toAbsoluteMediaUrl(item.mainImage?.url)}
                location={item.location?.name}
                dateLabel={formatConferenceDate(item.conferenceDate)}
                topicsLabel={item.vertical?.name}
                detailsHref={item.slug ? `/conferences/${item.slug}` : `/conferences/${toSlug(item.title)}`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default ConferenceDetailPage
