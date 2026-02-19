import PartnershipsPageClient from './PartnershipsPageClient'
import { backendRequest } from '@/lib/backend/client'

type PartnershipsPageGlobalResponse = {
  heroV2?: {
    title?: string | null
    description?: string | null
  } | null
}

const getInitialHeroV2 = async () => {
  const { ok, data } = await backendRequest<PartnershipsPageGlobalResponse>(
    '/api/globals/partnerships-page?depth=0',
    {
      cache: 'no-store',
    },
  )

  if (!ok || !data?.heroV2) {
    return null
  }

  return data.heroV2
}

const PartnershipsPage = async () => {
  const initialHeroV2 = await getInitialHeroV2()

  return <PartnershipsPageClient initialHeroV2={initialHeroV2} />
}

export default PartnershipsPage
