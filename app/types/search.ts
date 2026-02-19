export type SearchResultType = 'blog' | 'conferences' | 'services' | 'partnerships' | 'jobs'

interface SearchResultBase {
  id: string
  type: SearchResultType
  title: string
  href: string
}

export interface BlogSearchResultItem extends SearchResultBase {
  type: 'blog'
  category: string
  publishedDate?: string | null
  imageUrl?: string | null
}

export interface ConferenceSearchResultItem extends SearchResultBase {
  type: 'conferences'
  conferenceDate?: string | null
  location?: string | null
  vertical?: string | null
  mainImageUrl?: string | null
}

export interface ServiceSearchResultItem extends SearchResultBase {
  type: 'services'
  description: string
  category: string
  priceLabel: string
  promoCode?: string | null
  promoDescription?: string | null
  logoUrl?: string | null
  logoWidth?: number | null
  logoHeight?: number | null
}

export interface PartnershipSearchResultItem extends SearchResultBase {
  type: 'partnerships'
  rating: string
  foundedYear: string
  minPayment: string
  location?: string | null
  models: string[]
  offers: string[]
  logoUrl?: string | null
}

export interface JobSearchResultItem extends SearchResultBase {
  type: 'jobs'
  createdAt?: string | null
  badge?: 'none' | 'top' | 'urgent' | null
  location: string
  format: string
  experience: string
  salary: string
  salaryInfo: string
}

export type SearchResultItem =
  | BlogSearchResultItem
  | ConferenceSearchResultItem
  | ServiceSearchResultItem
  | PartnershipSearchResultItem
  | JobSearchResultItem
