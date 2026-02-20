export interface PartnershipMedia {
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface PartnershipBanner {
  caption?: string | null
  link?: string | null
  image?: PartnershipMedia | null
}

export interface PartnershipCategory {
  id: string
  name: string
  slug?: string | null
}

export interface PartnershipLocation {
  id: string
  name: string
  slug?: string | null
}

export interface PartnershipModel {
  model: string
}

export interface PartnershipOffer {
  offer: string
}

export interface PartnershipItem {
  id: string
  title: string
  slug?: string | null
  rating: string
  foundedYear: string
  minPayment: string
  websiteUrl?: string | null
  logo?: PartnershipMedia | null
  sidebarBanner?: PartnershipBanner | null
  category?: PartnershipCategory | null
  location?: PartnershipLocation | null
  models?: PartnershipModel[] | null
  offers?: PartnershipOffer[] | null
  content?: unknown
}
