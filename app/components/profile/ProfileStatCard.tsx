import React from 'react'
import SurfaceCard from '@/app/components/layout/SurfaceCard'

type ProfileStatCardProps = {
  label: string
  value?: string | null
  icon: React.ReactNode
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({ label, value, icon }) => {
  return (
    <article className="flex flex-col gap-7">
      <div className="relative w-full">
        <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center">
          <span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">{label}</span>
        </div>
        <svg className="absolute left-[27px] top-[58px]" width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z"
            fill="#F29F04"
          />
        </svg>
      </div>

      <SurfaceCard className="p-6 h-full min-h-[110px] flex items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
            {icon}
          </div>
          <span className={`text-white leading-tight font-poppins ${value ? 'text-[20px]' : 'text-[28px]'}`}>
            {value || '-'}
          </span>
        </div>
      </SurfaceCard>
    </article>
  )
}

export default ProfileStatCard
