import React from 'react'

type SurfaceCardProps = {
  className?: string
  children: React.ReactNode
}

const SurfaceCard: React.FC<SurfaceCardProps> = ({ className = '', children }) => {
  return (
    <div className={`rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] ${className}`.trim()}>
      {children}
    </div>
  )
}

export default SurfaceCard
