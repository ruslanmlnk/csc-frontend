import Image from 'next/image'
import React from 'react'

type ArticleHeroProps = {
  authorName: string
  categoryName: string
  publishedDateLabel: string
  title: string
  imageUrl: string
}

const ArticleHero: React.FC<ArticleHeroProps> = ({
  authorName,
  categoryName,
  publishedDateLabel,
  title,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex items-center gap-4">
        <span className="text-[#BDBDBD] text-[20px] font-poppins">{authorName}</span>
        <span className="text-white">|</span>
        <div className="px-4 py-1.5 rounded-[40px] bg-[rgba(242,159,4,0.25)] border border-[#F29F04]">
          <span className="text-white text-[14px] font-poppins">{categoryName}</span>
        </div>
        <span className="text-white">|</span>
        <span className="text-[#BDBDBD] text-[20px] font-poppins">{publishedDateLabel}</span>
      </div>

      <h1 className="max-w-[1074px] text-[56px] font-semibold leading-[72px] tracking-[-1.12px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
        {title}
      </h1>

      <div className="relative w-full aspect-[2480/1000] max-h-[500px] rounded-[40px] overflow-hidden border border-[rgba(74,74,74,0.7)] mt-6">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
    </div>
  )
}

export default ArticleHero

