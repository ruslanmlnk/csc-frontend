import { gql } from 'graphql-request'
import { client } from './graphql'
import { ConferenceFilterOption, ConferenceItem } from '@/app/types/conferences'

export const GET_CONFERENCES = gql`
  query GetConferences {
    Conferences(limit: 200, sort: "-updatedAt", where: { status: { equals: published } }) {
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

export const GET_CONFERENCE_BY_SLUG = gql`
  query GetConferenceBySlug($slug: String!) {
    Conferences(limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
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

export const GET_CONFERENCE_FILTERS = gql`
  query GetConferenceFilters {
    JobLocations(limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    ConferencesVerticals(limit: 200, sort: "name") {
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
  const data = await client.request<ConferencesResponse>(GET_CONFERENCES)
  return data.Conferences.docs
}

export async function getConferenceBySlug(slug: string) {
  const data = await client.request<ConferencesResponse>(GET_CONFERENCE_BY_SLUG, { slug })
  return data.Conferences.docs[0] || null
}

export async function getConferenceFilters() {
  const data = await client.request<ConferenceFiltersResponse>(GET_CONFERENCE_FILTERS)
  return {
    locations: data.JobLocations.docs,
    verticals: data.ConferencesVerticals.docs,
  }
}
