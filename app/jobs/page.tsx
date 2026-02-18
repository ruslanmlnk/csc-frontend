'use client'

import React, { useEffect, useMemo, useState } from 'react'
import ForumHero from '@/app/components/forum/ForumHero'
import Banner from '@/app/components/Banner'
import ForumPagination from '@/app/components/forum/ForumPagination'
import JobsFilters from '@/app/components/jobs/JobsFilters'
import type { JobItem } from '@/app/types/jobs'
import JobVacancyCard from '@/app/components/jobs/JobVacancyCard'

type JobsApiResponse = {
  jobs?: JobItem[]
  error?: string
}

type JobsFiltersApiResponse = {
  locations?: string[]
  experiences?: string[]
  formats?: string[]
  error?: string
}

const promoBannerSrc =
  'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480'

const ALL_LOCATIONS = 'All Locations'
const ANY_EXPERIENCE = 'Any experience'
const ANY_FORMAT = 'Any format'
const JOBS_PER_PAGE = 9

const formatJobDate = (value?: string): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' })
  return `${day} ${month}, ${year}`
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState(ALL_LOCATIONS)
  const [experienceFilter, setExperienceFilter] = useState(ANY_EXPERIENCE)
  const [formatFilter, setFormatFilter] = useState(ANY_FORMAT)
  const [locationOptions, setLocationOptions] = useState<string[]>([ALL_LOCATIONS])
  const [experienceOptions, setExperienceOptions] = useState<string[]>([ANY_EXPERIENCE])
  const [formatOptions, setFormatOptions] = useState<string[]>([ANY_FORMAT])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [jobsResponse, filtersResponse] = await Promise.all([
          fetch('/api/jobs', { cache: 'no-store' }),
          fetch('/api/jobs/filters', { cache: 'no-store' }),
        ])

        const jobsData = (await jobsResponse.json().catch(() => null)) as JobsApiResponse | null
        const filtersData = (await filtersResponse.json().catch(() => null)) as JobsFiltersApiResponse | null

        if (!jobsResponse.ok) {
          throw new Error(jobsData?.error || 'Unable to load jobs.')
        }

        if (!filtersResponse.ok) {
          throw new Error(filtersData?.error || 'Unable to load job filters.')
        }

        if (!active) return

        const loadedJobs = Array.isArray(jobsData?.jobs) ? jobsData.jobs : []
        const loadedLocations = Array.isArray(filtersData?.locations) ? filtersData.locations : []
        const loadedExperiences = Array.isArray(filtersData?.experiences) ? filtersData.experiences : []
        const loadedFormats = Array.isArray(filtersData?.formats) ? filtersData.formats : []

        setJobs(loadedJobs)
        setLocationOptions([ALL_LOCATIONS, ...loadedLocations])
        setExperienceOptions([ANY_EXPERIENCE, ...loadedExperiences])
        setFormatOptions([ANY_FORMAT, ...loadedFormats])
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load jobs.')
        setJobs([])
        setLocationOptions([ALL_LOCATIONS])
        setExperienceOptions([ANY_EXPERIENCE])
        setFormatOptions([ANY_FORMAT])
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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const locationName = job.location?.name || ''
      const experienceName = job.experience?.name || ''
      const formatName = job.format?.name || ''
      const searchMatch =
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.salary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.salaryInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experienceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatName.toLowerCase().includes(searchQuery.toLowerCase())
      const locationMatch = locationFilter === ALL_LOCATIONS || locationName === locationFilter
      const experienceMatch = experienceFilter === ANY_EXPERIENCE || experienceName === experienceFilter
      const formatMatch = formatFilter === ANY_FORMAT || formatName === formatFilter
      return searchMatch && locationMatch && experienceMatch && formatMatch
    })
  }, [experienceFilter, formatFilter, jobs, locationFilter, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [locationFilter, experienceFilter, formatFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))
  const normalizedPage = Math.min(currentPage, totalPages)
  const from = (normalizedPage - 1) * JOBS_PER_PAGE
  const paginatedJobs = filteredJobs.slice(from, from + JOBS_PER_PAGE)
  const showingFrom = filteredJobs.length === 0 ? 0 : from + 1
  const showingTo = filteredJobs.length === 0 ? 0 : from + paginatedJobs.length

  return (
    <div className="relative flex flex-col items-start overflow-x-hidden bg-[#0D0D0D] font-poppins text-white">
      <ForumHero
        title={(
          <>
            Build your career <br className="hidden md:block" /> in performance marketing
          </>
        )}
        description="Join a team working with real traffic, real budgets, and real impact. We are looking for specialists ready to grow fast."
      />

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-20">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-16">
          <Banner src={promoBannerSrc} alt="Jobs banner" className="hidden md:block" />

          <div className="flex w-full flex-col items-center gap-8">
            <JobsFilters
              searchValue={searchInput}
              onSearchChange={setSearchInput}
              onSearchSubmit={() => setSearchQuery(searchInput.trim())}
              locations={locationOptions}
              experiences={experienceOptions}
              formats={formatOptions}
              locationValue={locationFilter}
              experienceValue={experienceFilter}
              formatValue={formatFilter}
              onLocationChange={setLocationFilter}
              onExperienceChange={setExperienceFilter}
              onFormatChange={setFormatFilter}
            />
          </div>

          <div className="flex w-full flex-col gap-6">
            {isLoading && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                Loading jobs...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length === 0 && (
              <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
                No jobs found.
              </div>
            )}

            {!isLoading && !error && paginatedJobs.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedJobs.map((job) => {
                  const locationName = job.location?.name || 'Job'
                  const experienceName = job.experience?.name || ''
                  const formatName = job.format?.name || ''

                  return (
                    <div key={job.id} className="block">
                      <JobVacancyCard
                        dateLabel={formatJobDate(job.createdAt)}
                        badge={job.badge}
                        title={job.title}
                        location={locationName}
                        workFormat={formatName}
                        experience={experienceName}
                        salary={job.salary}
                        salaryInfo={job.salaryInfo}
                        detailsHref={job.slug ? `/jobs/${job.slug}` : '/jobs'}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length > 0 && (
              <div className="md:mt-10">
                <ForumPagination
                  showingFrom={showingFrom}
                  showingTo={showingTo}
                  total={filteredJobs.length}
                  currentPage={normalizedPage}
                  totalPages={totalPages}
                  itemLabel="jobs"
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          <Banner src={promoBannerSrc} alt="Jobs banner" className="mt-6" />
        </div>
      </main>
    </div>
  )
}

export default JobsPage
