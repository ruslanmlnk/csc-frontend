import { gql } from 'graphql-request'
import { client } from './graphql'
import { PartnershipCategory, PartnershipItem } from '@/app/types/partnerships'

export const GET_PARTNERSHIP_CATEGORIES = gql`
  query GetPartnershipCategories {
    PartnershipCategories(limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

export const GET_PARTNERSHIPS = gql`
  query GetPartnerships {
    Partnerships(limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
      docs {
        id
        title
        slug
        rating
        foundedYear
        minPayment
        websiteUrl
        logo {
          url
          width
          height
        }
        sidebarImage {
          url
          width
          height
        }
        category {
          id
          name
          slug
        }
        location {
          id
          name
          slug
        }
        models {
          model
        }
        offers {
          offer
        }
      }
    }
  }
`

export const GET_PARTNERSHIP_BY_SLUG = gql`
  query GetPartnershipBySlug($slug: String!) {
    Partnerships(limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
      docs {
        id
        title
        slug
        rating
        foundedYear
        minPayment
        websiteUrl
        content
        logo {
          url
          width
          height
        }
        sidebarImage {
          url
          width
          height
        }
        category {
          id
          name
          slug
        }
        location {
          id
          name
          slug
        }
        models {
          model
        }
        offers {
          offer
        }
      }
    }
  }
`

type PartnershipCategoriesResponse = {
  PartnershipCategories: {
    docs: PartnershipCategory[]
  }
}

type PartnershipsResponse = {
  Partnerships: {
    docs: PartnershipItem[]
  }
}

export async function getPartnershipCategories() {
  const data = await client.request<PartnershipCategoriesResponse>(GET_PARTNERSHIP_CATEGORIES)
  return data.PartnershipCategories.docs
}

export async function getPartnerships() {
  const data = await client.request<PartnershipsResponse>(GET_PARTNERSHIPS)
  return data.Partnerships.docs
}

export async function getPartnershipBySlug(slug: string) {
  const data = await client.request<PartnershipsResponse>(GET_PARTNERSHIP_BY_SLUG, { slug })
  return data.Partnerships.docs[0] || null
}
