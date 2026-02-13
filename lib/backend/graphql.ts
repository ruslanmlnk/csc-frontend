import { GraphQLClient } from 'graphql-request'
import { getBackendUrl } from '@/lib/auth-server'

const endpoint = `${getBackendUrl()}/api/graphql`

export const client = new GraphQLClient(endpoint, {
  headers: {},
})
