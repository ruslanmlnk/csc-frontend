import type { Metadata } from 'next'
import ConferencesPageClient from './ConferencesPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'

const GLOBAL_SLUG = 'conferences-page'

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  const seo = globalData.seo

  if (!seo) {
    return { title: 'Conferences' }
  }

  return {
    title: seo.title || 'Conferences',
    description: seo.description || undefined,
    openGraph: {
      title: seo.title || 'Conferences',
      description: seo.description || undefined,
      images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
    },
  }
}

const ConferencesPage = async () => {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)
  return <ConferencesPageClient initialHeroV2={globalData.heroV2} />
}

export default ConferencesPage
