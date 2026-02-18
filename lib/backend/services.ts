import { gql } from 'graphql-request'
import { client } from './graphql'
import { ServiceCategory, ServiceItem } from '@/app/types/services'

export const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    ServiceCategories(limit: 100, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

export const GET_SERVICES = gql`
  query GetServices {
    Services(limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
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
      }
    }
  }
`

export const GET_SERVICE_BY_SLUG = gql`
  query GetServiceBySlug($slug: String!) {
    Services(limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
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
  const data = await client.request<ServiceCategoriesResponse>(GET_SERVICE_CATEGORIES)
  return data.ServiceCategories.docs
}

export async function getServices() {
  const data = await client.request<ServicesResponse>(GET_SERVICES)
  return data.Services.docs
}

export async function getServiceBySlug(slug: string) {
  const data = await client.request<ServicesResponse>(GET_SERVICE_BY_SLUG, { slug })
  return data.Services.docs[0] || null
}
