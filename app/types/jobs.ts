export interface JobMedia {
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface JobBanner {
  caption?: string | null
  link?: string | null
  image?: JobMedia | null
}

export interface JobFilterOption {
  id: string
  name: string
  slug?: string | null
}

export type JobBadge = 'none' | 'top' | 'urgent'

export interface JobItem {
  id: string
  title: string
  slug?: string | null
  createdAt: string
  badge?: JobBadge | null
  salary: string
  salaryInfo: string
  sidebarBanner?: JobBanner | null
  content?: unknown
  location: JobFilterOption
  experience: JobFilterOption
  format: JobFilterOption
  noindex?: boolean | null
}
