import { gql } from 'graphql-request'
import { client, getPayloadGraphQLLocale } from './graphql'
import { PartnershipCategory, PartnershipItem } from '@/app/types/partnerships'

const getPartnershipCategoriesQuery = (locale: 'en' | 'uk') => gql`
  query GetPartnershipCategories {
    PartnershipCategories(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

const getPartnershipsQuery = (locale: 'en' | 'uk') => gql`
  query GetPartnerships {
    Partnerships(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
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
        sidebarBanner {
          caption
          link
          image {
            url
            width
            height
          }
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
        noindex
      }
    }
  }
`

const getPartnershipBySlugQuery = (locale: 'en' | 'uk') => gql`
  query GetPartnershipBySlug($slug: String!) {
    Partnerships(locale: ${locale}, fallbackLocale: en, limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
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
        sidebarBanner {
          caption
          link
          image {
            url
            width
            height
          }
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
        noindex
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
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<PartnershipCategoriesResponse>(getPartnershipCategoriesQuery(locale))
  return data.PartnershipCategories.docs
}

export async function getPartnerships() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<PartnershipsResponse>(getPartnershipsQuery(locale))
  return data.Partnerships.docs
}

export async function getPartnershipBySlug(slug: string) {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<PartnershipsResponse>(getPartnershipBySlugQuery(locale), { slug })
  return data.Partnerships.docs[0] || null
}
