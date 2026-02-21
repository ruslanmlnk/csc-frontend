export interface ServiceMedia {
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface ServiceBanner {
  caption?: string | null
  link?: string | null
  image?: ServiceMedia | null
}

export interface ServiceCategory {
  id: string
  name: string
  slug?: string | null
}

export interface ServiceItem {
  id: string
  title: string
  slug?: string | null
  description: string
  priceLabel: string
  websiteUrl?: string | null
  handle?: string | null
  logo?: ServiceMedia | null
  mainImage?: ServiceMedia | null
  sidebarBanner?: ServiceBanner | null
  promoCode?: string | null
  promoDescription?: string | null
  content?: unknown
  category: ServiceCategory
  noindex?: boolean | null
}
