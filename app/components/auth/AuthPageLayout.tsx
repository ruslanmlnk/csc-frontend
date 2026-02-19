import Image from 'next/image'
import React from 'react'
import GlowBackground from '@/app/components/layout/GlowBackground'
import type { AuthPageBanner } from '@/lib/backend/authPageGlobals'

type AuthPageLayoutProps = {
  children: React.ReactNode
  topPaddingClassName: string
  contentGapClassName?: string
  leftBanner?: AuthPageBanner | null
  rightBanner?: AuthPageBanner | null
}

type ResolvedBanner = {
  src: string
  alt: string
  href?: string | null
}

const FALLBACK_BANNER: ResolvedBanner = {
  src: '/images/service-sidebar.webp',
  alt: 'Sidebar Decoration',
}

type BannerDecorProps = {
  banner: ResolvedBanner
  className: string
}

const BannerDecor: React.FC<BannerDecorProps> = ({ banner, className }) => {
  const normalizedHref = banner.href?.trim()
  const isExternalLink = Boolean(normalizedHref && /^https?:\/\//i.test(normalizedHref))

  const imageContent = (
    <Image
      src={banner.src}
      alt={banner.alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-700"
    />
  )

  if (normalizedHref) {
    return (
      <a
        href={normalizedHref}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        aria-label={banner.alt}
        className={className}
      >
        {imageContent}
      </a>
    )
  }

  return <div className={className}>{imageContent}</div>
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  children,
  topPaddingClassName,
  contentGapClassName = 'gap-10',
  leftBanner,
  rightBanner,
}) => {
  const resolvedLeftBanner = leftBanner?.src
    ? { src: leftBanner.src, alt: leftBanner.alt || 'Sidebar Decoration', href: leftBanner.href }
    : FALLBACK_BANNER
  const resolvedRightBanner = rightBanner?.src
    ? { src: rightBanner.src, alt: rightBanner.alt || 'Sidebar Decoration', href: rightBanner.href }
    : FALLBACK_BANNER

  return (
    <main className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
      <GlowBackground heightClassName="h-[1000px]" showMobileGlow />

      <section
        className={`relative ${topPaddingClassName} pb-[80px] flex flex-col items-center px-5 min-h-screen z-10`.trim()}
      >
        <div className="w-full max-w-[1320px] flex flex-col items-center">
          <div
            className={`flex flex-col xl:flex-row w-full items-center xl:items-start justify-center ${contentGapClassName}`.trim()}
          >
            <BannerDecor
              banner={resolvedLeftBanner}
              className="hidden xl:block w-[386px] h-[732px] relative rounded-[20px] overflow-hidden border border-white/10 group"
            />
            {children}
            <BannerDecor
              banner={resolvedRightBanner}
              className="hidden xl:block w-[386px] h-[732px] relative rounded-[20px] overflow-hidden border border-white/10 group"
            />
            <div className="xl:hidden flex flex-col gap-6 w-full px-4">
              <BannerDecor
                banner={resolvedLeftBanner}
                className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden group"
              />
              <BannerDecor
                banner={resolvedRightBanner}
                className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden group"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthPageLayout
