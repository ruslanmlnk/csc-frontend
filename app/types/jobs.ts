export interface JobMedia {
  url?: string | null
  width?: number | null
  height?: number | null
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
  sidebarImage?: JobMedia | null
  content?: unknown
  location: JobFilterOption
  experience: JobFilterOption
  format: JobFilterOption
}
