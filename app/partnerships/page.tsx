import PartnershipsPageClient from './PartnershipsPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'
import { getServerLanguage } from '@/lib/i18n/server'

const GLOBAL_SLUG = 'partnerships-page'

const PartnershipsPage = async () => {
  const language = await getServerLanguage()
  const globalData = await getPageGlobalData(GLOBAL_SLUG, language)

  return <PartnershipsPageClient initialHeroV2={globalData.heroV2} />
}

export default PartnershipsPage
