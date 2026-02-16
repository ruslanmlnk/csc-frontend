import React from 'react'
import Link from 'next/link'
import BlogCard from '@/app/components/BlogCard'

type RelatedArticleItem = {
  id: string
  slug: string
  publishedDate: string
  categoryName: string
  title: string
  image: string
}

type ArticleRelatedProps = {
  articles: RelatedArticleItem[]
}

const ArticleRelated: React.FC<ArticleRelatedProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-16 mt-10">
      <h2 className="text-center text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
        Related Article
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((a) => (
          <Link key={a.id} href={`/blog/${a.slug}`}>
            <BlogCard
              post={{
                id: a.id,
                date: new Date(a.publishedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }),
                category: a.categoryName,
                title: a.title,
                image: a.image,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ArticleRelated
