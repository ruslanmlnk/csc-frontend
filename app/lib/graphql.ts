import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_PAYLOAD_URL
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/graphql`
    : 'http://localhost:3000/api/graphql'

export const client = new GraphQLClient(endpoint, {
    headers: {
        // You can add authentication headers here if needed
    },
})
