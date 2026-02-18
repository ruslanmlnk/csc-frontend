export interface ServiceMedia {
  url?: string | null
  width?: number | null
  height?: number | null
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
  sidebarImage?: ServiceMedia | null
  promoCode?: string | null
  promoDescription?: string | null
  content?: unknown
  category: ServiceCategory
}
