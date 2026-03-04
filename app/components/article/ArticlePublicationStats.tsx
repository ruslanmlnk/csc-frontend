"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Eye } from 'lucide-react'

type ArticlePublicationStatsProps = {
  slug: string
  publishedDateLabel: string
  initialViews?: number | null
}

const toNonNegativeInteger = (value: number | null | undefined): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.floor(value))
}

const ArticlePublicationStats: React.FC<ArticlePublicationStatsProps> = ({
  slug,
  publishedDateLabel,
  initialViews,
}) => {
  const [views, setViews] = useState<number>(toNonNegativeInteger(initialViews))

  useEffect(() => {
    let active = true

    const incrementViews = async () => {
      try {
        const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
          method: 'POST',
          cache: 'no-store',
        })

        const payload = (await response.json().catch(() => null)) as { views?: unknown } | null
        if (!response.ok || !active) {
          return
        }

        const nextViews =
          typeof payload?.views === 'number' && Number.isFinite(payload.views)
            ? Math.max(0, Math.floor(payload.views))
            : null

        if (nextViews !== null) {
          setViews(nextViews)
        }
      } catch {
        // Ignore network errors and keep the initial counter.
      }
    }

    incrementViews()

    return () => {
      active = false
    }
  }, [slug])

  const formattedViews = useMemo(
    () => new Intl.NumberFormat('en-US').format(views),
    [views],
  )

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[20px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-4">
      <div className="text-[#BDBDBD] text-[14px] leading-[22px] font-poppins">
        Published: <span className="text-[#FCFCFC]">{publishedDateLabel}</span>
      </div>

      <span className="h-1.5 w-1.5 rounded-full bg-[#4A4A4A]" aria-hidden="true" />

      <div className="inline-flex items-center gap-2 text-[#FCFCFC] text-[14px] leading-[22px] font-poppins">
        <Eye className="h-4 w-4 text-[#F29F04]" aria-hidden="true" />
        <span>{formattedViews} views</span>
      </div>
    </div>
  )
}

export default ArticlePublicationStats

