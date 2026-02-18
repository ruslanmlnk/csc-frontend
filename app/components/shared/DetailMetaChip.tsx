import React from 'react'

interface DetailMetaChipProps {
  label: string
  icon?: React.ReactNode
  filled?: boolean
}

const DetailMetaChip: React.FC<DetailMetaChipProps> = ({ label, icon, filled = false }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2.5 rounded-[80px] px-3 py-3 md:h-[50px] md:px-6 md:py-3 ${
        filled ? 'bg-[#FFF]' : 'border border-[#B3B3B3]'
      }`}
    >
      {icon ? (
        <span className={`h-[14px] w-[14px] shrink-0 md:h-5 md:w-5 ${filled ? 'text-[#070707]' : 'text-[#B3B3B3]'}`}>
          {icon}
        </span>
      ) : null}
      <span
        className={`text-center font-poppins text-[14px] font-normal leading-4 md:text-[16px] md:font-medium md:leading-[26px] ${
          filled ? 'text-[#0D0D0D]' : 'text-[#B3B3B3]'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default DetailMetaChip
