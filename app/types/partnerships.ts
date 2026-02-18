export interface PartnershipMedia {
  url?: string | null
  width?: number | null
  height?: number | null
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
  sidebarImage?: PartnershipMedia | null
  category?: PartnershipCategory | null
  location?: PartnershipLocation | null
  models?: PartnershipModel[] | null
  offers?: PartnershipOffer[] | null
  content?: unknown
}
