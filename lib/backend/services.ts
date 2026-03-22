import { gql } from 'graphql-request'
import { client, getPayloadGraphQLLocale } from './graphql'
import { ServiceCategory, ServiceItem } from '@/app/types/services'

const getServiceCategoriesQuery = (locale: 'en' | 'uk') => gql`
  query GetServiceCategories {
    ServiceCategories(locale: ${locale}, fallbackLocale: en, limit: 100, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

const getServicesQuery = (locale: 'en' | 'uk') => gql`
  query GetServices {
    Services(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
      docs {
        id
        title
        slug
        description
        priceLabel
        websiteUrl
        handle
        promoCode
        promoDescription
        logo {
          url
          width
          height
        }
        mainImage {
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
        noindex
      }
    }
  }
`

const getServiceBySlugQuery = (locale: 'en' | 'uk') => gql`
  query GetServiceBySlug($slug: String!) {
    Services(locale: ${locale}, fallbackLocale: en, limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
      docs {
        id
        title
        slug
        description
        priceLabel
        websiteUrl
        handle
        promoCode
        promoDescription
        content
        logo {
          url
          width
          height
        }
        mainImage {
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
        noindex
      }
    }
  }
`

type ServiceCategoriesResponse = {
  ServiceCategories: {
    docs: ServiceCategory[]
  }
}

type ServicesResponse = {
  Services: {
    docs: ServiceItem[]
  }
}

export async function getServiceCategories() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ServiceCategoriesResponse>(getServiceCategoriesQuery(locale))
  return data.ServiceCategories.docs
}

export async function getServices() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ServicesResponse>(getServicesQuery(locale))
  return data.Services.docs
}

export async function getServiceBySlug(slug: string) {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ServicesResponse>(getServiceBySlugQuery(locale), { slug })
  return data.Services.docs[0] || null
}
