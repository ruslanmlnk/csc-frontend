import React from 'react'
import RichText from '@/app/components/blog/RichText'
import type { Tag } from '@/app/types/blog'

type ArticleContentProps = {
  content: unknown
  backendUrl: string
  blockquote?: string | null
  tags?: Tag[]
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, backendUrl, blockquote, tags }) => {
  return (
    <>
      <div className="text-[#9E9E9E] text-[20px] leading-[32px] font-poppins flex flex-col gap-8">
        <div className="article-content prose prose-invert max-w-none">
          <RichText content={content} backendUrl={backendUrl} />
        </div>
        {blockquote ? (
          <div className="relative py-12 px-14 rounded-r-[10px] border-l-[5px] border-[#F29F04] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[rgba(255,58,41,0.1)] -z-10" />
            <p className="text-[#FCFCFC] text-[24px] font-medium italic leading-[32px] relative z-10">
              &ldquo;{blockquote}&rdquo;
            </p>
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#F29F04] blur-[100px] opacity-20 -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[#FCB42D] blur-[60px] opacity-10 -ml-20 -mb-20" />
          </div>
        ) : null}
      </div>

      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-4 pt-10 border-t border-[rgba(74,74,74,0.7)]">
          {tags.map(({ tag }) => (
            <div key={tag} className="px-3 py-1.5 rounded-[80px] bg-[#FCFCFC]">
              <span className="text-[#F29F04] text-[14px] font-poppins">#{tag}</span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default ArticleContent
