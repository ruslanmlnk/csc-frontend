import { client } from './graphql'
import { gql } from 'graphql-request'
import { Article, Category } from '@/app/types/blog'

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
          avatar {
            url
          }
        }
        content
        blockquote
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
