import Image from 'next/image'
import React from 'react'
import { Search } from 'lucide-react'
import type { Tag } from '@/app/types/blog'

type ArticleSidebarProps = {
  tags?: Tag[]
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ tags }) => {
  return (
    <aside className="w-full lg:w-[380px] flex flex-col gap-16 shrink-0">
      <div className="relative w-full aspect-[380/727] rounded-[20px] overflow-hidden">
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/3e844bee26ad8ec77ac05689c0767ff3c1e8fc96?width=760"
          alt="Sidebar Promo"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col p-8 rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] gap-10">
        <div className="flex items-center h-[50px] px-4 gap-2 rounded-[80px] border border-[#FCFCFC]">
          <Search className="w-6 h-6 text-[#9E9E9E]" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent border-none outline-none text-white text-[16px] placeholder:text-[#9E9E9E]"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-[32px] font-medium leading-[40px] tracking-[-0.64px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
            Popular Tags
          </h3>
          <div className="flex flex-col">
            {(tags || []).map((t, idx, arr) => (
              <div key={t.tag} className={`py-4 ${idx !== arr.length - 1 ? 'border-b border-[#404040]' : ''}`}>
                <span className="text-[#BDBDBD] text-[16px] hover:text-[#F29F04] cursor-pointer transition-colors font-poppins">
                  #{t.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ArticleSidebar

