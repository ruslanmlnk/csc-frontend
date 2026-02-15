import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import React from 'react'

type ArticleAuthorCardProps = {
  authorName: string
  authorBio: string
  authorAvatar: string
}

const ArticleAuthorCard: React.FC<ArticleAuthorCardProps> = ({ authorName, authorBio, authorAvatar }) => {
  return (
    <div className="flex flex-col p-10 rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] gap-10">
      <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
        <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden shrink-0 border-2 border-[#F29F04]/20">
          <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <h3 className="text-white text-[32px] font-medium leading-[40px] tracking-[-0.64px]">{authorName}</h3>
          <p className="text-[#BDBDBD] text-[20px] leading-[32px]">Writer / Expert</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
            <Facebook className="w-4 h-4 fill-current" />
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
            <Instagram className="w-4 h-4" />
          </Link>
          <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
            <Linkedin className="w-4 h-4 fill-current" />
          </Link>
        </div>
      </div>
      <p className="text-[#9E9E9E] text-[16px] leading-[26px]">{authorBio}</p>
    </div>
  )
}

export default ArticleAuthorCard

