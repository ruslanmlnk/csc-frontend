import Link from 'next/link'
import React from 'react'

type ArticleNotFoundProps = {
  title?: string
  ctaLabel?: string
}

const ArticleNotFound: React.FC<ArticleNotFoundProps> = ({
  title = 'Article not found',
  ctaLabel = 'Return to Blog',
}) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white gap-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      <Link href="/blog" className="text-[#F29F04] hover:underline underline-offset-4">
        {ctaLabel}
      </Link>
    </div>
  )
}

export default ArticleNotFound

