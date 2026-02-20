"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BlogCard from './BlogCard'
import MobileCategorySelector from '@/app/components/shared/MobileCategorySelector'

type BlogApiArticle = {
  id: string | number
  title?: string | null
  slug?: string | null
  publishedDate?: string | null
  image?: {
    url?: string | null
  } | null
  category?: {
    name?: string | null
  } | null
}

type BlogApiResponse = {
  articles?: BlogApiArticle[]
  error?: string
}

type LatestPostItem = {
  id: string
  title: string
  date: string
  category: string
  image: string
  slug?: string | null
  publishedDate?: string | null
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
const ALL_ARTICLES_LABEL = 'All Articles'
const MAX_VISIBLE_POSTS = 3

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  const normalizedBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const formatPublishedDate = (value?: string | null): string => {
  if (!value) return ''

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

interface LatestPostsProps {
  banner?: {
    caption?: string | null
    link?: string | null
    image?: {
      url?: string | null
    } | null
  } | null
}

const LatestPosts: React.FC<LatestPostsProps> = ({ banner }) => {
  const [posts, setPosts] = useState<LatestPostItem[]>([])
  const [categories, setCategories] = useState<string[]>([ALL_ARTICLES_LABEL])
  const [activeCategory, setActiveCategory] = useState(ALL_ARTICLES_LABEL)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadPosts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/blog', { cache: 'no-store' })
        const payload = (await response.json().catch(() => null)) as BlogApiResponse | null

        if (!response.ok) {
          throw new Error(payload?.error || 'Unable to load latest posts.')
        }

        if (!active) {
          return
        }

        const loadedArticles = Array.isArray(payload?.articles) ? payload.articles : []

        const mappedPosts = loadedArticles
          .map((article): LatestPostItem | null => {
            const title = article.title?.trim()
            if (!title) return null

            return {
              id: String(article.id),
              title,
              date: formatPublishedDate(article.publishedDate),
              category: article.category?.name?.trim() || 'Uncategorized',
              image: toAbsoluteMediaUrl(article.image?.url) || '/images/blog-post-1.png',
              slug: article.slug || null,
              publishedDate: article.publishedDate || null,
            }
          })
          .filter((item): item is LatestPostItem => Boolean(item))
          .sort((first, second) => {
            const firstTime = first.publishedDate ? new Date(first.publishedDate).getTime() : 0
            const secondTime = second.publishedDate ? new Date(second.publishedDate).getTime() : 0
            return secondTime - firstTime
          })

        const uniqueCategories = Array.from(new Set(mappedPosts.map((post) => post.category)))
        const nextCategories = [ALL_ARTICLES_LABEL, ...uniqueCategories]

        setPosts(mappedPosts)
        setCategories(nextCategories)
        setActiveCategory((prev) => (nextCategories.includes(prev) ? prev : ALL_ARTICLES_LABEL))
      } catch (loadError) {
        if (!active) {
          return
        }
        setPosts([])
        setCategories([ALL_ARTICLES_LABEL])
        setActiveCategory(ALL_ARTICLES_LABEL)
        setError(loadError instanceof Error ? loadError.message : 'Unable to load latest posts.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      active = false
    }
  }, [])

  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_ARTICLES_LABEL) {
      return posts
    }

    return posts.filter((post) => post.category === activeCategory)
  }, [activeCategory, posts])

  const visiblePosts = filteredPosts.slice(0, MAX_VISIBLE_POSTS)

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center overflow-hidden px-5 py-[120px]">
      <h2 className="bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)] bg-clip-text text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
        Latest Post
      </h2>

      <div className="mt-7 w-full lg:hidden">
        <MobileCategorySelector
          value={activeCategory}
          options={categories}
          onSelect={setActiveCategory}
          className="lg:hidden"
        />
      </div>

      <div className="mt-7 hidden w-full items-center justify-start gap-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-[8px] pr-[16px] lg:flex lg:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-[80px] px-[16px] py-[8px] text-[16px] leading-[26px] transition-all duration-300 ${activeCategory === category
              ? 'bg-[#F29F04] font-medium text-[#070707]'
              : 'font-normal text-[#FCFCFC] hover:bg-white/5'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          Loading latest posts...
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-16 w-full rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[16px] leading-[26px] text-[#FF9C9C]">
          {error}
        </div>
      )}

      {!isLoading && !error && visiblePosts.length === 0 && (
        <div className="mt-16 w-full rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[16px] leading-[26px] text-[#BDBDBD]">
          No posts found for this category.
        </div>
      )}

      {!isLoading && !error && visiblePosts.length > 0 && (
        <div className="mt-16 grid w-full max-w-[1240px] grid-cols-1 gap-[24px] md:grid-cols-3">
          {visiblePosts.map((post) => (
            <Link key={post.id} href={post.slug ? `/blog/${post.slug}` : '/blog'} className="flex h-full">
              <BlogCard post={post} />
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/blog"
        className="mt-16 flex items-center justify-center gap-[16px] rounded-[80px] border border-[#FCC660] px-[24px] py-[11px] font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95"
      >
        See More Posts
      </Link>

      {(banner?.image?.url || !banner) && (
        <div className="mt-16 hidden w-full max-w-[1240px] md:block">
          <div className="relative aspect-[1240/158] w-full overflow-hidden rounded-[40px]">
            {banner?.link ? (
              <Link href={banner.link} target={banner.link.startsWith('http') ? '_blank' : undefined}>
                <Image
                  src={banner.image?.url || '/images/latest-posts-bottom-banner.png'}
                  alt={banner.caption || 'Join Us Banner'}
                  fill
                  className="object-cover"
                />
              </Link>
            ) : (
              <Image
                src={banner?.image?.url || '/images/latest-posts-bottom-banner.png'}
                alt={banner?.caption || 'Join Us Banner'}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default LatestPosts

