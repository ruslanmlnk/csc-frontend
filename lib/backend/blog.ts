import { client } from './graphql'
import { gql } from 'graphql-request'
import { backendRequest } from './client'
import { Article, Banner, BlogPageData, Category } from '@/app/types/blog'

export const GET_ARTICLES = gql`
  query GetArticles {
    Articles(limit: 100) {
      docs {
        id
        title
        slug
        publishedDate
        image {
          url
        }
        category {
          name
        }
        tags {
          tag
        }
      }
    }
  }
`

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    Articles(where: { slug: { equals: $slug } }, limit: 1) {
      docs {
        id
        title
        slug
        publishedDate
        author {
          id
          name
          bio
          position
          facebook
          instagram
          linkedin
          telegram
          tiktok
          website
          avatar {
            url
          }
        }
        content
        image {
          url
        }
        category {
          name
        }
        tags {
          tag
        }
        sidebarBanner {
          caption
          link
          image {
            url
          }
        }
        relatedArticles {
          id
          title
          slug
          publishedDate
          image {
            url
          }
          category {
            name
          }
        }
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    Categories(limit: 100) {
      docs {
        id
        name
      }
    }
  }
`

type ArticlesResponse = {
  Articles: {
    docs: Article[]
  }
}

type CategoriesResponse = {
  Categories: {
    docs: Category[]
  }
}

type UnknownRecord = Record<string, unknown>

type BlogGlobalResponse = {
  banner?: unknown
}

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

const resolveBanner = (value: unknown): Banner | null => {
  const bannerRecord = asRecord(value)
  if (!bannerRecord) {
    return null
  }

  const imageValue = bannerRecord.image
  const imageRecord = asRecord(imageValue)
  const imageUrl = asString(imageRecord?.url) || asString(imageValue)

  return {
    caption: asString(bannerRecord.caption),
    link: asString(bannerRecord.link),
    image: imageUrl ? { url: imageUrl } : null,
  }
}

export async function getArticles() {
  const data = await client.request<ArticlesResponse>(GET_ARTICLES)
  return data.Articles.docs
}

export async function getArticleBySlug(slug: string) {
  const data = await client.request<ArticlesResponse>(GET_ARTICLE_BY_SLUG, { slug })
  return data.Articles.docs[0] || null
}

export async function getCategories() {
  const data = await client.request<CategoriesResponse>(GET_CATEGORIES)
  return data.Categories.docs
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const { ok, data } = await backendRequest<BlogGlobalResponse>('/api/globals/blog?depth=2', {
    cache: 'no-store',
  })

  if (!ok || !data) {
    return {}
  }

  return {
    banner: resolveBanner(data.banner),
  }
}
