import { GraphQLClient } from 'graphql-request'

const baseUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    'http://localhost:3001'
).replace(/\/$/, '')

const endpoint = `${baseUrl}/api/graphql`

export const client = new GraphQLClient(endpoint, {
    headers: {
        // You can add authentication headers here if needed
    },
})
