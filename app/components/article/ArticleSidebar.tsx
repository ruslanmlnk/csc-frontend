import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Search } from 'lucide-react'
import type { Tag } from '@/app/types/blog'

type SidebarLatestPost = {
  slug: string
  title: string
  categoryName: string
  publishedDateLabel: string
}

type ArticleSidebarProps = {
  tags?: Tag[]
  categories?: string[]
  latestPosts?: SidebarLatestPost[]
  banner?: {
    src: string
    alt: string
    href?: string | null
  } | null
}

const buildBlogFilterHref = (filters: {
  search?: string
  category?: string
  tag?: string
}): string => {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.category?.trim()) {
    params.set('category', filters.category.trim())
  }

  if (filters.tag?.trim()) {
    params.set('tag', filters.tag.trim().replace(/^#/, ''))
  }

  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

const DEFAULT_SIDEBAR_BANNER =
  'https://api.builder.io/api/v1/image/assets/TEMP/3e844bee26ad8ec77ac05689c0767ff3c1e8fc96?width=760'

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ tags, categories, latestPosts, banner }) => {
  const hasLatestPosts = (latestPosts?.length || 0) > 0
  const normalizedBannerHref = banner?.href?.trim()
  const isExternalBannerHref = Boolean(normalizedBannerHref && /^https?:\/\//i.test(normalizedBannerHref))

  return (
    <aside className="w-full lg:w-[380px] flex flex-col gap-16 shrink-0">
      {banner?.src && (
        normalizedBannerHref ? (
          <a
            href={normalizedBannerHref}
            target={isExternalBannerHref ? '_blank' : undefined}
            rel={isExternalBannerHref ? 'noopener noreferrer' : undefined}
            aria-label={banner?.alt || 'Sidebar Promo'}
            className="relative block w-full aspect-[380/727] rounded-[20px] overflow-hidden"
          >
            <Image
              src={banner.src}
              alt={banner?.alt || 'Sidebar Promo'}
              fill
              className="object-cover"
            />
          </a>
        ) : (
          <div className="relative w-full aspect-[380/727] rounded-[20px] overflow-hidden">
            <Image
              src={banner.src}
              alt={banner?.alt || 'Sidebar Promo'}
              fill
              className="object-cover"
            />
          </div>
        )
      )}

      <div className="flex flex-col p-8 rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] gap-10">
        <form action="/blog" method="get" className="flex items-center h-[50px] px-4 gap-2 rounded-[80px] border border-[#FCFCFC]">
          <button
            type="submit"
            aria-label="Search blog"
            className="inline-flex items-center justify-center"
          >
            <Search className="w-6 h-6 text-[#9E9E9E]" />
          </button>
          <input
            type="text"
            name="search"
            placeholder="Search"
            className="flex-1 bg-transparent border-none outline-none text-white text-[16px] placeholder:text-[#9E9E9E]"
          />
        </form>

        <div className="flex w-full flex-col items-start gap-6">
          <h3 className="self-stretch text-[32px] font-medium leading-[40px] tracking-[-0.64px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
            Categories
          </h3>
          <div className="flex w-full flex-wrap items-center content-center gap-4">
            {(categories || []).map((categoryName) => (
              <Link
                key={categoryName}
                href={buildBlogFilterHref({ category: categoryName })}
                className="flex items-center justify-center rounded-[80px] border-[0.5px] border-[#FCC660] px-3 py-1.5 transition-colors hover:bg-[rgba(252,198,96,0.12)]"
              >
                <span className="text-[#FCC660] text-[14px] leading-4 font-normal font-poppins">{categoryName}</span>
              </Link>
            ))}
          </div>
        </div>

        {hasLatestPosts ? (
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch text-[32px] font-medium leading-[40px] tracking-[-0.64px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
              Latest Post
            </h3>
            <div className="flex w-full flex-col items-start gap-8">
              {(latestPosts || []).map((post) => (
                <article key={post.slug} className="flex w-full flex-col items-start justify-center gap-4">
                  <Link href={`/blog/${post.slug}`} className="self-stretch text-white text-[20px] font-medium leading-[32px] hover:text-[#FCC660] transition-colors">
                    {post.title}
                  </Link>
                  <div className="flex w-full items-center gap-2">
                    <div className="flex items-center justify-center rounded-[80px] border-[0.5px] border-[#FCC660] px-3 pt-[5px] pb-[6px]">
                      <span className="text-[#FCC660] text-[14px] leading-4 font-normal font-poppins">{post.categoryName}</span>
                    </div>
                    <span className="flex-1 text-right text-[#6C6C6C] text-[14px] leading-4 font-normal font-poppins">
                      {post.publishedDateLabel}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          <h3 className="text-[32px] font-medium leading-[40px] tracking-[-0.64px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
            Popular Tags
          </h3>
          <div className="flex flex-col">
            {(tags || []).map((t, idx, arr) => (
              <div key={t.tag} className={`py-4 ${idx !== arr.length - 1 ? 'border-b border-[#404040]' : ''}`}>
                <Link
                  href={buildBlogFilterHref({ tag: t.tag })}
                  className="text-[#BDBDBD] text-[16px] hover:text-[#F29F04] cursor-pointer transition-colors font-poppins"
                >
                  #{t.tag}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ArticleSidebar
