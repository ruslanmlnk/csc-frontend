import type { Metadata } from 'next'
import ServicesPageClient from './ServicesPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'

const GLOBAL_SLUG = 'services-page'

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  const seo = globalData.seo

  if (!seo) {
    return { title: 'Services' }
  }

  return {
    title: seo.title || 'Services',
    description: seo.description || undefined,
    openGraph: {
      title: seo.title || 'Services',
      description: seo.description || undefined,
      images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
    },
  }
}

const ServicesPage = async () => {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  return <ServicesPageClient initialHeroV2={globalData.heroV2} />
}

export default ServicesPage
