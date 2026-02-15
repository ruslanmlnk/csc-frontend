import Image from 'next/image'
import React from 'react'

type GlowBackgroundProps = {
  className?: string
  heightClassName?: string
  gradient?: string
  gradientBlendMode?: React.CSSProperties['backgroundBlendMode']
  showMobileGlow?: boolean
  showDesktopGlow?: boolean
}

const DEFAULT_GRADIENT =
  'linear-gradient(82.71deg, rgba(242, 159, 4, 0.7) 0.75%, #0d0d0d 30.5%, #0d0d0d 69.72%, rgba(242, 159, 4, 0.7) 99.19%)'

const GlowBackground: React.FC<GlowBackgroundProps> = ({
  className = '',
  heightClassName = 'h-full',
  gradient = DEFAULT_GRADIENT,
  gradientBlendMode,
  showMobileGlow = false,
  showDesktopGlow = true,
}) => {
  return (
    <div
      className={`absolute inset-x-0 top-0 z-0 w-full ${heightClassName} pointer-events-none select-none overflow-hidden ${className}`.trim()}
    >
      <div
        className="absolute inset-0 z-[-2] w-full h-full bg-repeat opacity-40"
        style={{ backgroundImage: "url('/images/noise.webp')", backgroundSize: '200px 200px' }}
      />
      <div
        className="absolute inset-0 z-[-1] w-full h-full"
        style={{ background: gradient, backgroundBlendMode: gradientBlendMode }}
      />

      {showMobileGlow ? (
        <div className="md:hidden absolute inset-0 w-full h-full">
          <Image src="/images/glow-mobile.webp" alt="" fill className="object-cover" priority />
        </div>
      ) : null}

      {showDesktopGlow ? (
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image src="/images/glow-desktop.webp" alt="" fill className="object-cover" priority />
        </div>
      ) : null}
    </div>
  )
}

export default GlowBackground
