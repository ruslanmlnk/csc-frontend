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
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-4">
        <span className="text-[#BDBDBD] text-[20px] font-poppins">{authorName}</span>
        <span className="text-white text-[20px] leading-none w-3">&bull;</span>
        <div className="flex items-center justify-center rounded-[40px] bg-[rgba(242,159,4,0.25)] p-1">
          <div className="flex items-center justify-center rounded-[24px] border border-[#F29F04] px-4 pt-[6px] pb-[7px]">
            <span className="text-white text-center font-poppins text-[14px] leading-4 font-normal">
              {categoryName}
            </span>
          </div>
        </div>
        <span className="text-white text-[20px] leading-none w-3">&bull;</span>
        <span className="text-[#BDBDBD] text-[20px] font-poppins">{publishedDateLabel}</span>
      </div>

      <h1 className="w-full text-[56px] font-semibold leading-[72px] tracking-[-1.12px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
        {title}
      </h1>

      <div className="relative w-full max-h-[520px] rounded-[40px] overflow-hidden border border-[rgba(74,74,74,0.7)] mt-6">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
    </div>
  )
}

export default ArticleHero
