import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/backend/blog'
import { getConferences } from '@/lib/backend/conferences'
import { getJobs } from '@/lib/backend/jobs'
import { getPartnerships } from '@/lib/backend/partnerships'
import { getServices } from '@/lib/backend/services'
import type { SearchResultItem, SearchResultType } from '@/app/types/search'

const MIN_QUERY_LENGTH = 3
const MAX_RESULTS_PER_TYPE = 8
const MAX_TOTAL_RESULTS = 24

const includesQuery = (value: string | null | undefined, query: string) => {
  if (!value) return false
  return value.toLowerCase().includes(query)
}

const takeLimited = <T>(items: T[], limit: number) => items.slice(0, limit)

type SearchScope = SearchResultType | 'all'

const isScope = (value: string | null): value is SearchScope =>
  value === 'all' ||
  value === 'blog' ||
  value === 'conferences' ||
  value === 'services' ||
  value === 'partnerships' ||
  value === 'jobs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q') || ''
    const normalizedQuery = rawQuery.trim()
    const query = normalizedQuery.toLowerCase()
    const scopeParam = searchParams.get('type')
    const scope: SearchScope = isScope(scopeParam) ? scopeParam : 'all'

    if (query.length < MIN_QUERY_LENGTH) {
      return NextResponse.json({
        query: normalizedQuery,
        minQueryLength: MIN_QUERY_LENGTH,
        results: [],
      })
    }

    const shouldSearch = (type: SearchResultType) => scope === 'all' || scope === type

    const [articlesRes, conferencesRes, servicesRes, partnershipsRes, jobsRes] = await Promise.allSettled([
      shouldSearch('blog') ? getArticles() : Promise.resolve([]),
      shouldSearch('conferences') ? getConferences() : Promise.resolve([]),
      shouldSearch('services') ? getServices() : Promise.resolve([]),
      shouldSearch('partnerships') ? getPartnerships() : Promise.resolve([]),
      shouldSearch('jobs') ? getJobs() : Promise.resolve([]),
    ])

    const articles = articlesRes.status === 'fulfilled' ? articlesRes.value : []
    const conferences = conferencesRes.status === 'fulfilled' ? conferencesRes.value : []
    const services = servicesRes.status === 'fulfilled' ? servicesRes.value : []
    const partnerships = partnershipsRes.status === 'fulfilled' ? partnershipsRes.value : []
    const jobs = jobsRes.status === 'fulfilled' ? jobsRes.value : []

    const blogResults: SearchResultItem[] = shouldSearch('blog')
      ? takeLimited(
          articles
            .filter(
              (article) =>
                includesQuery(article.title, query) ||
                includesQuery(article.category?.name, query),
            )
            .map((article) => ({
              id: `blog-${article.id}`,
              type: 'blog' as const,
              title: article.title,
              href: article.slug ? `/blog/${article.slug}` : '/blog',
              category: article.category?.name || 'Blog',
              publishedDate: article.publishedDate || null,
              imageUrl: article.image?.url || null,
            })),
          MAX_RESULTS_PER_TYPE,
        )
      : []

    const conferenceResults: SearchResultItem[] = shouldSearch('conferences')
      ? takeLimited(
          conferences
            .filter(
              (conference) =>
                includesQuery(conference.title, query) ||
                includesQuery(conference.location?.name, query) ||
                includesQuery(conference.vertical?.name, query),
            )
            .map((conference) => ({
              id: `conferences-${conference.id}`,
              type: 'conferences' as const,
              title: conference.title,
              href: conference.slug ? `/conferences/${conference.slug}` : '/conferences',
              conferenceDate: conference.conferenceDate || null,
              location: conference.location?.name || null,
              vertical: conference.vertical?.name || null,
              mainImageUrl: conference.mainImage?.url || null,
            })),
          MAX_RESULTS_PER_TYPE,
        )
      : []

    const serviceResults: SearchResultItem[] = shouldSearch('services')
      ? takeLimited(
          services
            .filter(
              (service) =>
                includesQuery(service.title, query) ||
                includesQuery(service.description, query) ||
                includesQuery(service.category?.name, query) ||
                includesQuery(service.priceLabel, query),
            )
            .map((service) => ({
              id: `services-${service.id}`,
              type: 'services' as const,
              title: service.title,
              href: service.slug ? `/services/${service.slug}` : '/services',
              description: service.description || '',
              category: service.category?.name || 'Service',
              priceLabel: service.priceLabel || '',
              promoCode: service.promoCode || null,
              promoDescription: service.promoDescription || null,
              logoUrl: service.logo?.url || null,
              logoWidth: service.logo?.width || null,
              logoHeight: service.logo?.height || null,
            })),
          MAX_RESULTS_PER_TYPE,
        )
      : []

    const partnershipResults: SearchResultItem[] = shouldSearch('partnerships')
      ? takeLimited(
          partnerships
            .filter((partnership) => {
              const offers = (partnership.offers || []).map((item) => item.offer).join(' ')
              const models = (partnership.models || []).map((item) => item.model).join(' ')
              return (
                includesQuery(partnership.title, query) ||
                includesQuery(partnership.location?.name, query) ||
                includesQuery(partnership.minPayment, query) ||
                includesQuery(offers, query) ||
                includesQuery(models, query)
              )
            })
            .map((partnership) => ({
              id: `partnerships-${partnership.id}`,
              type: 'partnerships' as const,
              title: partnership.title,
              href: partnership.slug ? `/partnerships/${partnership.slug}` : '/partnerships',
              rating: partnership.rating || '',
              foundedYear: partnership.foundedYear || '',
              minPayment: partnership.minPayment || '',
              location: partnership.location?.name || null,
              models: (partnership.models || []).map((item) => item.model?.trim()).filter(Boolean) as string[],
              offers: (partnership.offers || []).map((item) => item.offer?.trim()).filter(Boolean) as string[],
              logoUrl: partnership.logo?.url || null,
            })),
          MAX_RESULTS_PER_TYPE,
        )
      : []

    const jobResults: SearchResultItem[] = shouldSearch('jobs')
      ? takeLimited(
          jobs
            .filter(
              (job) =>
                includesQuery(job.title, query) ||
                includesQuery(job.salary, query) ||
                includesQuery(job.salaryInfo, query) ||
                includesQuery(job.location?.name, query) ||
                includesQuery(job.experience?.name, query) ||
                includesQuery(job.format?.name, query),
            )
            .map((job) => ({
              id: `jobs-${job.id}`,
              type: 'jobs' as const,
              title: job.title,
              href: job.slug ? `/jobs/${job.slug}` : '/jobs',
              createdAt: job.createdAt || null,
              badge: job.badge || null,
              location: job.location?.name || 'Job',
              format: job.format?.name || '',
              experience: job.experience?.name || '',
              salary: job.salary || '',
              salaryInfo: job.salaryInfo || '',
            })),
          MAX_RESULTS_PER_TYPE,
        )
      : []

    const results = takeLimited(
      [...blogResults, ...conferenceResults, ...serviceResults, ...partnershipResults, ...jobResults],
      MAX_TOTAL_RESULTS,
    )

    return NextResponse.json({
      query: normalizedQuery,
      minQueryLength: MIN_QUERY_LENGTH,
      results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to perform search.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
