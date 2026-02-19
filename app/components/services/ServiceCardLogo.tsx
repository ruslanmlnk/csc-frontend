import React from 'react'
import Image from 'next/image'

interface ServiceCardLogoProps {
  src?: string | null
  alt: string
  width?: number | null
  height?: number | null
}

const DEFAULT_LOGO_WIDTH = 140
const DEFAULT_LOGO_HEIGHT = 56

const getSafeDimension = (value: number | null | undefined, fallback: number): number =>
  typeof value === 'number' && value > 0 ? value : fallback

const ServiceCardLogo: React.FC<ServiceCardLogoProps> = ({ src, alt, width, height }) => {
  if (!src) {
    return <div className="h-[56px] w-[120px] rounded-[14px] bg-[#2A2A2A]" />
  }

  const safeWidth = getSafeDimension(width, DEFAULT_LOGO_WIDTH)
  const safeHeight = getSafeDimension(height, DEFAULT_LOGO_HEIGHT)

  return (
    <Image
      src={src}
      alt={alt}
      width={safeWidth}
      height={safeHeight}
      className="h-[56px] w-auto object-contain"
    />
  )
}

export default ServiceCardLogo
