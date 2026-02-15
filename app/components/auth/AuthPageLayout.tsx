import Image from 'next/image'
import React from 'react'
import GlowBackground from '@/app/components/layout/GlowBackground'

type AuthPageLayoutProps = {
  children: React.ReactNode
  topPaddingClassName: string
  contentGapClassName?: string
}

const SideDecor: React.FC = () => (
  <div className="hidden xl:block w-[386px] h-[732px] relative rounded-[20px] overflow-hidden border border-white/10 group">
    <Image
      src="/images/service-sidebar.webp"
      alt="Sidebar Decoration"
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-700"
    />
  </div>
)

const MobileDecor: React.FC = () => (
  <div className="xl:hidden flex flex-col gap-6 w-full px-4">
    <div className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden">
      <Image src="/images/service-sidebar.webp" alt="Sidebar Decoration" fill className="object-cover" />
    </div>
    <div className="w-full aspect-[159/103] relative rounded-[40px] overflow-hidden">
      <Image src="/images/service-sidebar.webp" alt="Sidebar Decoration" fill className="object-cover" />
    </div>
  </div>
)

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  children,
  topPaddingClassName,
  contentGapClassName = 'gap-10',
}) => {
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
            <SideDecor />
            {children}
            <SideDecor />
            <MobileDecor />
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthPageLayout
