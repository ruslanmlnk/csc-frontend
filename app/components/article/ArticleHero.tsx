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
      <div className="flex w-full flex-col items-center gap-4 md:hidden">
        <div className="flex items-center justify-center rounded-[40px] bg-[rgba(242,159,4,0.25)] p-1">
          <div className="flex items-center justify-center rounded-[24px] border border-[#F29F04] px-4 pt-[6px] pb-[7px]">
            <span className="text-center font-poppins text-[14px] font-normal leading-4 text-white">
              {categoryName}
            </span>
          </div>
        </div>
        <div className="flex items-start justify-center gap-2">
          <span className="font-poppins text-[20px] font-normal leading-8 text-[#BDBDBD]">{authorName}</span>
          <span className="font-poppins text-[20px] font-normal leading-[30px] text-white">&bull;</span>
          <span className="font-poppins text-[20px] font-normal leading-8 text-[#BDBDBD]">{publishedDateLabel}</span>
        </div>
      </div>

      <div className="hidden items-center gap-4 md:flex">
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

      <h1 className="w-full bg-gradient-to-b from-white to-[#999] bg-clip-text font-poppins text-[40px] font-semibold leading-[48px] tracking-[-0.8px] text-transparent md:text-[56px] md:leading-[72px] md:tracking-[-1.12px]">
        {title}
      </h1>

      <div
        className="relative mt-2 w-full max-w-[1240px] overflow-hidden rounded-[40px] border border-[rgba(74,74,74,0.7)] md:mt-[7px]"
        style={{ height: 520 }}
      >
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" />
      </div>
    </div>
  )
}

export default ArticleHero
