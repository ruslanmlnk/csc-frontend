import { gql } from 'graphql-request'
import { client, getPayloadGraphQLLocale } from './graphql'
import { ConferenceFilterOption, ConferenceItem } from '@/app/types/conferences'

const getConferencesQuery = (locale: 'en' | 'uk') => gql`
  query GetConferences {
    Conferences(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
      docs {
        id
        title
        slug
        conferenceDate
        location {
          id
          name
          slug
        }
        vertical {
          id
          name
          slug
        }
        websiteUrl
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
        noindex
      }
    }
  }
`

const getConferenceBySlugQuery = (locale: 'en' | 'uk') => gql`
  query GetConferenceBySlug($slug: String!) {
    Conferences(locale: ${locale}, fallbackLocale: en, limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
      docs {
        id
        title
        slug
        conferenceDate
        location {
          id
          name
          slug
        }
        vertical {
          id
          name
          slug
        }
        websiteUrl
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
        noindex
      }
    }
  }
`

const getConferenceFiltersQuery = (locale: 'en' | 'uk') => gql`
  query GetConferenceFilters {
    JobLocations(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    ConferencesVerticals(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

type ConferencesResponse = {
  Conferences: {
    docs: ConferenceItem[]
  }
}

type ConferenceFiltersResponse = {
  JobLocations: {
    docs: ConferenceFilterOption[]
  }
  ConferencesVerticals: {
    docs: ConferenceFilterOption[]
  }
}

export async function getConferences() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ConferencesResponse>(getConferencesQuery(locale))
  return data.Conferences.docs
}

export async function getConferenceBySlug(slug: string) {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ConferencesResponse>(getConferenceBySlugQuery(locale), { slug })
  return data.Conferences.docs[0] || null
}

export async function getConferenceFilters() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<ConferenceFiltersResponse>(getConferenceFiltersQuery(locale))
  return {
    locations: data.JobLocations.docs,
    verticals: data.ConferencesVerticals.docs,
  }
}
