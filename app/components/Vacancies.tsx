"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import JobVacancyCard from '@/app/components/jobs/JobVacancyCard'
import type { JobItem } from '@/app/types/jobs'

type JobsApiResponse = {
  jobs?: JobItem[]
  error?: string
}

const MAX_VISIBLE_VACANCIES = 3

const formatJobDate = (value?: string): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' })
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' })
  return `${day} ${month}, ${year}`
}

const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<JobItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadVacancies = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/jobs', { cache: 'no-store' })
        const payload = (await response.json().catch(() => null)) as JobsApiResponse | null

        if (!response.ok) {
          throw new Error(payload?.error || 'Unable to load jobs.')
        }

        if (!active) {
          return
        }

        const loadedVacancies = Array.isArray(payload?.jobs) ? payload.jobs : []
        setVacancies(loadedVacancies)
      } catch (loadError) {
        if (!active) {
          return
        }
        setVacancies([])
        setError(loadError instanceof Error ? loadError.message : 'Unable to load jobs.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadVacancies()

    return () => {
      active = false
    }
  }, [])

  const visibleVacancies = useMemo(() => vacancies.slice(0, MAX_VISIBLE_VACANCIES), [vacancies])

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center overflow-hidden px-5">
      <div className="mb-16 flex w-full items-center justify-between">
        <h2 className="bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)] bg-clip-text font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
          Vacancies
        </h2>
        <Link
          href="/jobs"
          className="hidden md:flex items-center justify-center gap-[16px] rounded-[80px] border border-[#FCC660] px-[24px] py-[12px] font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95"
        >
          See More
        </Link>
      </div>

      {isLoading && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          Loading vacancies...
        </div>
      )}

      {!isLoading && error && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
          {error}
        </div>
      )}

      {!isLoading && !error && visibleVacancies.length === 0 && (
        <div className="mb-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          No vacancies found.
        </div>
      )}

      {!isLoading && !error && visibleVacancies.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-[24px] md:grid-cols-3">
          {visibleVacancies.map((vacancy) => (
            <JobVacancyCard
              key={vacancy.id}
              dateLabel={formatJobDate(vacancy.createdAt)}
              badge={vacancy.badge}
              title={vacancy.title}
              location={vacancy.location?.name || 'Job'}
              workFormat={vacancy.format?.name || ''}
              experience={vacancy.experience?.name || ''}
              salary={vacancy.salary}
              salaryInfo={vacancy.salaryInfo}
              detailsHref={vacancy.slug ? `/jobs/${vacancy.slug}` : '/jobs'}
            />
          ))}
        </div>
      )}

      <Link
        href="/jobs"
        className="mt-8 flex md:hidden items-center justify-center gap-[16px] rounded-[80px] border border-[#FCC660] px-[24px] py-[12px] font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95"
      >
        See More
      </Link>
    </section>
  )
}

export default Vacancies
