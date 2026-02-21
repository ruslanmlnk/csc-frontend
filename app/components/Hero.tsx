import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Banner from './Banner';

interface HeroProps {
  data?: {
    valueProposition?: string;
    title?: string;
    description?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonLink?: string;
    backgroundImage?: {
      url?: string;
    };
  };
  banner?: {
    caption?: string | null;
    link?: string | null;
    image?: {
      url?: string | null;
    } | null;
  } | null;
}

const Hero: React.FC<HeroProps> = ({ data, banner }) => {
  return (
    <section className="relative w-full min-h-[760px] md:min-h-[907px] bg-[#1A1A1A] flex flex-col items-center overflow-hidden">
      {/* --- Background Image & Effects --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-mobile.webp"
          alt="Hero Background"
          fill
          className="object-cover object-center brightness-[0.8] !h-auto md:hidden"
        />
        <Image
          src={data?.backgroundImage?.url || '/images/hero-bg.png'}
          alt="Hero Background"
          fill
          className="hidden md:block object-cover object-center brightness-[0.8] !h-auto"
          priority
        />
      </div>

      {/* --- Content Area --- */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[1280px] px-5 pt-[120px] md:pt-[162px]">
        {/* Text Container (Gap 56 from Figma) */}
        <div className="flex flex-col items-center gap-10 md:gap-[56px] w-full text-center">
          {/* Heading Group (Gap 24 from Figma) */}
          <div className="flex flex-col items-center gap-5 md:gap-[24px]">
            {/* Top Badge (Product Hunt Style) */}
            <div className="relative flex items-center justify-center w-full max-w-[345px] h-[48px] px-[18px] pl-[12px] rounded-[99px] border border-[#F29F04] bg-[rgba(242,159,4,0.08)] backdrop-blur-[8px] overflow-hidden">
              <span className="text-white font-poppins font-normal text-[13px] md:text-[14px] leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {data?.valueProposition || 'Inferra - built on data, driven by profit'}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="
              w-full max-w-[856px] 
              text-[44px] md:text-[80px] font-medium 
              leading-[52px] md:leading-[88px] tracking-[-1.76px] md:tracking-[-3.2px] 
              text-transparent bg-clip-text bg-gradient-to-b from-white to-[#999] 
              drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
            "
            >
              {data?.title || 'Scaling traffic with data-driven decisions'}
            </h1>

            {/* Subheadline */}
            <p
              className="
              w-full max-w-[897px]
              text-[15px] md:text-[16px] font-normal 
              leading-[24px] md:leading-[26px] text-[#BDBDBD] 
              drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
            "
            >
              {data?.description ||
                'We help brands, advertisers, and affiliates grow through performance marketing, traffic arbitrage, and advanced analytics. Our focus is on stable ROI, scalable funnels, and long-term results - not short-term hacks.'}
            </p>
          </div>

          {/* Button Container (Gap 24 from Figma) */}
          <div className="flex flex-col sm:flex-row items-center gap-[16px] md:gap-[24px] w-full max-w-[380px]">
            <Link
              href={data?.primaryButtonLink || '/partnerships'}
              className="flex items-center justify-center w-full sm:w-[180px] h-[50px] bg-[#F29F04] rounded-[80px] text-[#0D0D0D] font-medium text-[16px] leading-[26px] transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(242,159,4,0.4)]"
            >
              {data?.primaryButtonText || 'Become a partner'}
            </Link>

            <Link
              href={data?.secondaryButtonLink || '/jobs'}
              className="flex items-center justify-center w-full sm:w-[180px] h-[50px] border border-[#FCC660] rounded-[80px] text-[#FCC660] font-medium text-[16px] leading-[26px] transition-all hover:bg-[#FCC660]/10 active:scale-95"
            >
              {data?.secondaryButtonText || 'Join the team'}
            </Link>
          </div>
        </div>

        {/* Bottom Hero Image (Image 7 in Figma) */}
        {banner?.image?.url && (
          <Banner
            src={banner.image.url}
            alt={banner.caption || 'Hero Graphic'}
            href={banner.link || undefined}
            className="mt-12 hidden md:block md:mt-[137.93px] h-[126px] sm:h-[140px] md:h-[158px] rounded-[24px] md:rounded-[40px]"
            containerStyle={{ maxWidth: '100%' }}
          />
        )}
      </div>
    </section>
  );
};

export default Hero;
