import PartnershipsPageClient from './PartnershipsPageClient'
import { getPageGlobalData } from '@/lib/backend/pageGlobals'

const GLOBAL_SLUG = 'partnerships-page'

const PartnershipsPage = async () => {
  const globalData = await getPageGlobalData(GLOBAL_SLUG)

  return <PartnershipsPageClient initialHeroV2={globalData.heroV2} />
}

export default PartnershipsPage
