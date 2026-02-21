export interface ConferenceMedia {
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface ConferenceBanner {
  caption?: string | null
  link?: string | null
  image?: ConferenceMedia | null
}

export interface ConferenceFilterOption {
  id: string
  name: string
  slug?: string | null
}

export interface ConferenceItem {
  id: string
  title: string
  slug?: string | null
  conferenceDate?: string | null
  location?: ConferenceFilterOption | null
  vertical?: ConferenceFilterOption | null
  websiteUrl?: string | null
  logo?: ConferenceMedia | null
  mainImage?: ConferenceMedia | null
  sidebarBanner?: ConferenceBanner | null
  content?: unknown
  noindex?: boolean | null
}
