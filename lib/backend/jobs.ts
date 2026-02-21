import { gql } from 'graphql-request'
import { client } from './graphql'
import type { JobFilterOption, JobItem } from '@/app/types/jobs'

export const GET_JOBS = gql`
  query GetJobs {
    Jobs(limit: 200, sort: "-createdAt", where: { status: { equals: published } }) {
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

export const GET_JOB_BY_SLUG = gql`
  query GetJobBySlug($slug: String!) {
    Jobs(limit: 1, where: { slug: { equals: $slug }, status: { equals: published } }) {
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

export const GET_JOB_FILTERS = gql`
  query GetJobFilters {
    JobLocations(limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    JobExperiences(limit: 200, sort: "name") {
      docs {
        id
        name
        slug
      }
    }
    JobFormats(limit: 200, sort: "name") {
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
  const data = await client.request<JobsResponse>(GET_JOBS)
  return data.Jobs.docs
}

export async function getJobBySlug(slug: string) {
  const data = await client.request<JobsResponse>(GET_JOB_BY_SLUG, { slug })
  return data.Jobs.docs[0] || null
}

export async function getJobFilters() {
  const data = await client.request<JobFiltersResponse>(GET_JOB_FILTERS)

  return {
    locations: data.JobLocations.docs,
    experiences: data.JobExperiences.docs,
    formats: data.JobFormats.docs,
  }
}
