import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBackendUrl } from '@/lib/auth-server'
import { getJobBySlug, getJobs } from '@/lib/backend/jobs'
import type { JobItem } from '@/app/types/jobs'
import RichText from '@/app/components/blog/RichText'
import JobDetailHero from '@/app/components/jobs/JobDetailHero'
import JobVacancyCard from '@/app/components/jobs/JobVacancyCard'

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'

const withBackendUrl = (url: string | undefined | null, backendUrl: string): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const formatJobDate = (value?: string): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' })
  return `${day} ${month}, ${year}`
}

const JobDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const backendUrl = getBackendUrl()

  const [job, allJobs] = await Promise.all([getJobBySlug(slug), getJobs()])

  if (!job) {
    notFound()
  }

  const currentJob = job as JobItem
  const locationName = currentJob.location?.name || 'Job'
  const workFormat = currentJob.format?.name || 'Not specified'
  const experience = currentJob.experience?.name || 'Not specified'
  const sidebarBannerImageUrl = withBackendUrl(currentJob.sidebarBanner?.image?.url, backendUrl) || promoBannerSrc
  const sidebarBannerHref = currentJob.sidebarBanner?.link?.trim() || null
  const sidebarBannerAlt = currentJob.sidebarBanner?.caption?.trim() || 'Jobs sidebar banner'
  const isSidebarBannerExternal = Boolean(sidebarBannerHref && /^https?:\/\//i.test(sidebarBannerHref))

  const similarJobsByLocation = allJobs.filter(
    (item) =>
      item.id !== currentJob.id &&
      item.location?.id &&
      currentJob.location?.id &&
      item.location.id === currentJob.location.id,
  )

  const similarJobsFallback = allJobs.filter((item) => item.id !== currentJob.id)
  const similarJobs = (similarJobsByLocation.length > 0 ? similarJobsByLocation : similarJobsFallback).slice(0, 3)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <div
        className={`mx-auto flex w-full max-w-[1280px] flex-col items-start gap-[80px] px-5 pt-[162.69px] ${
          similarJobs.length === 0 ? 'pb-20' : ''
        }`}
      >
        <JobDetailHero
          title={currentJob.title}
          salary={currentJob.salary}
          location={locationName}
          workFormat={workFormat}
          experience={experience}
        />

        <div className="flex items-start gap-6 self-stretch xl:gap-11">
          <div className="flex min-w-0 flex-1 flex-col gap-[80px]">
            <div className="flex flex-col gap-8 font-poppins text-[20px] leading-[32px] text-[#9E9E9E]">
              {currentJob.content ? (
                <div className="service-content prose prose-invert max-w-none">
                  <RichText content={currentJob.content} backendUrl={backendUrl} variant="article" />
                </div>
              ) : (
                <p className="!mb-0">No description provided.</p>
              )}
            </div>

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
          </div>

          <aside className="hidden w-full max-w-[380px] shrink-0 xl:block">
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
          </aside>
        </div>
      </div>

      {similarJobs.length > 0 ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-[64px] overflow-hidden px-5 pb-20 pt-[120px]">
          <h2 className="self-stretch bg-gradient-to-b from-[#FFF] via-[#FFF] to-[#999] bg-clip-text text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
            Similar Jobs
          </h2>

          <div className="grid w-full grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
            {similarJobs.map((item) => (
              <JobVacancyCard
                key={item.id}
                dateLabel={formatJobDate(item.createdAt)}
                badge={item.badge}
                title={item.title}
                location={item.location?.name || 'Job'}
                workFormat={item.format?.name || ''}
                experience={item.experience?.name || ''}
                salary={item.salary}
                salaryInfo={item.salaryInfo}
                detailsHref={item.slug ? `/jobs/${item.slug}` : '/jobs'}
              />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default JobDetailPage
