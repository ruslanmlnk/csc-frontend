import type { Metadata } from 'next'
import JobsPageClient from './JobsPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'

const GLOBAL_SLUG = 'jobs-page'

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  const seo = globalData.seo

  if (!seo) {
    return { title: 'Jobs' }
  }

  return {
    title: seo.title || 'Jobs',
    description: seo.description || undefined,
    openGraph: {
      title: seo.title || 'Jobs',
      description: seo.description || undefined,
      images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
    },
  }
}

const JobsPage = async () => {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  return <JobsPageClient initialHeroV2={globalData.heroV2} />
}

export default JobsPage
