import { client } from './graphql'
import { gql } from 'graphql-request'

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
        description
        publishedDate
        content
        blockquote
        image {
          url
        }
        category {
          name
        }
        author {
          name
          bio
          avatar {
            url
          }
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

export async function getArticles() {
  const data: any = await client.request(GET_ARTICLES)
  return data.Articles.docs
}

export async function getArticleBySlug(slug: string) {
  const data: any = await client.request(GET_ARTICLE_BY_SLUG, { slug })
  return data.Articles.docs[0] || null
}

export async function getCategories() {
  const data: any = await client.request(GET_CATEGORIES)
  return data.Categories.docs
}
