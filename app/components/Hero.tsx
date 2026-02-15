import React from 'react';
import Image from 'next/image';
import Banner from './Banner';

interface HeroProps {
  data?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    backgroundImage?: {
      url?: string;
    };
    bottomGraphic?: {
      url?: string;
    };
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  return (
    <section className="relative w-full min-h-[907px] bg-[#1A1A1A] flex flex-col items-center overflow-hidden">
      {/* --- Background Image & Effects --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data?.backgroundImage?.url || "/images/hero-bg.png"}
          alt="Hero Background"
          fill
          className="object-cover object-center brightness-[0.8] !h-auto"
          priority
        />
      </div>


      {/* --- Content Area --- */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[1440px] px-[100px] pt-[162px]">

        {/* Text Container (Gap 56 from Figma) */}
        <div className="flex flex-col items-center gap-[56px] w-full text-center">

          {/* Heading Group (Gap 24 from Figma) */}
          <div className="flex flex-col items-center gap-[24px]">
            {/* Top Badge (Product Hunt Style) */}
            <div
              className="relative flex items-center justify-center rounded-[99px] border border-[#F29F04] bg-[rgba(242,159,4,0.08)] backdrop-blur-[8px] overflow-hidden"
              style={{ width: '345px', height: '48px', padding: '12px 18px 12px 12px' }}
            >
              <span className="text-white font-poppins font-normal text-[14px] leading-[16px] whitespace-nowrap">
                {data?.badgeText || "Inferra — built on data, driven by profit"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="
              w-full max-w-[856px] 
              text-[80px] font-medium 
              leading-[88px] tracking-[-3.2px] 
              text-transparent bg-clip-text bg-gradient-to-b from-white to-[#999] 
              drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
            ">
              {data?.title || "Scaling traffic with data-driven decisions"}
            </h1>

            {/* Subheadline */}
            <p className="
              w-full max-w-[897px]
              text-[16px] font-normal 
              leading-[26px] text-[#BDBDBD] 
              drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]
            ">
              {data?.subtitle || "We help brands, advertisers, and affiliates grow through performance marketing, traffic arbitrage, and advanced analytics. Our focus is on stable ROI, scalable funnels, and long-term results — not short-term hacks."}
            </p>
          </div>

          {/* Button Container (Gap 24 from Figma) */}
          <div className="flex flex-col sm:flex-row items-center gap-[24px]">
            <button className="flex items-center justify-center w-[180px] h-[50px] bg-[#F29F04] rounded-[80px] text-[#0D0D0D] font-medium text-[16px] leading-[26px] transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(242,159,4,0.4)]">
              {data?.primaryButtonText || "Become a partner"}
            </button>

            <button className="flex items-center justify-center w-[180px] h-[50px] border border-[#FCC660] rounded-[80px] text-[#FCC660] font-medium text-[16px] leading-[26px] transition-all hover:bg-[#FCC660]/10 active:scale-95">
              {data?.secondaryButtonText || "Join the team"}
            </button>
          </div>
        </div>

        {/* Bottom Hero Image (Image 7 in Figma) */}
        <Banner
          src={data?.bottomGraphic?.url || "/images/hero-graphic.webp"}
          alt="Hero Graphic"
          className="mt-[137.93px]"
        />
      </div>

    </section>
  );
};

export default Hero;