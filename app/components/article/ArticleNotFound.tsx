import Link from 'next/link'
import React from 'react'

const ArticleNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white gap-6">
      <h1 className="text-4xl font-bold">Article not found</h1>
      <Link href="/blog" className="text-[#F29F04] hover:underline underline-offset-4">
        Return to Blog
      </Link>
    </div>
  )
}

export default ArticleNotFound

