import { GraphQLClient } from 'graphql-request'
import { getBackendUrl } from '@/lib/auth-server'
import { getServerLanguage } from '@/lib/i18n/server'

const endpoint = `${getBackendUrl()}/api/graphql`

export const client = new GraphQLClient(endpoint, {
  headers: {},
})

export const getPayloadGraphQLLocale = async (): Promise<'en' | 'uk'> => {
  const language = await getServerLanguage()
  return language === 'uk' ? 'uk' : 'en'
}
