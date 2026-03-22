import { gql } from 'graphql-request'
import { client, getPayloadGraphQLLocale } from './graphql'
import type { JobFilterOption, JobItem } from '@/app/types/jobs'

const getJobsQuery = (locale: 'en' | 'uk') => gql`
  query GetJobs {
    Jobs(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "-createdAt", where: { status: { equals: published } }) {
      docs {
        id
        title
        slug
        createdAt
        badge
        salary
        salaryInfo
        content
        location {
          id
          name
          slug
        }
        experience {
          id
          name
          slug
        }
        format {
          id
          name
          slug
        }
        noindex
      }
    }
  }
`

const getJobBySlugQuery = (locale: 'en' | 'uk') => gql`
  query GetJobBySlug($slug: String!) {
    Jobs(locale: ${locale}, fallbackLocale: en, limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
      docs {
        id
        title
        slug
        createdAt
        badge
        salary
        salaryInfo
        sidebarBanner {
          caption
          link
          image {
            url
            width
            height
          }
        }
        content
        location {
          id
          name
          slug
        }
        experience {
          id
          name
          slug
        }
        format {
          id
          name
          slug
        }
        noindex
      }
    }
  }
`

const getJobFiltersQuery = (locale: 'en' | 'uk') => gql`
  query GetJobFilters {
    JobLocations(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    JobExperiences(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    JobFormats(locale: ${locale}, fallbackLocale: en, limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
  }
`

type JobsResponse = {
  Jobs: {
    docs: JobItem[]
  }
}

type JobFiltersResponse = {
  JobLocations: {
    docs: JobFilterOption[]
  }
  JobExperiences: {
    docs: JobFilterOption[]
  }
  JobFormats: {
    docs: JobFilterOption[]
  }
}

export async function getJobs() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<JobsResponse>(getJobsQuery(locale))
  return data.Jobs.docs
}

export async function getJobBySlug(slug: string) {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<JobsResponse>(getJobBySlugQuery(locale), { slug })
  return data.Jobs.docs[0] || null
}

export async function getJobFilters() {
  const locale = await getPayloadGraphQLLocale()
  const data = await client.request<JobFiltersResponse>(getJobFiltersQuery(locale))

  return {
    locations: data.JobLocations.docs,
    experiences: data.JobExperiences.docs,
    formats: data.JobFormats.docs,
  }
}
