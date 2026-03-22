import type { Metadata } from 'next'
import ServicesPageClient from './ServicesPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'
import { getServerLanguage } from '@/lib/i18n/server'

const GLOBAL_SLUG = 'services-page'

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage()
  const globalData = await getPageGlobalData(GLOBAL_SLUG, language)
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
  const language = await getServerLanguage()
  const globalData = await getPageGlobalData(GLOBAL_SLUG, language)
  return <ServicesPageClient initialHeroV2={globalData.heroV2} />
}

export default ServicesPage
