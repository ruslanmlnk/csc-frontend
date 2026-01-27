import React from 'react';
import BackgroundEffects from './BackgroundEffects';

const Hero: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center w-full min-h-[900px] overflow-hidden pt-10 pb-20">
      
      {/* Abstract Background Layer */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4 w-full max-w-[1440px] mt-10">
        
        {/* Text Container */}
        <div className="flex flex-col items-center gap-8 w-full">
          
          {/* Pill Label */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#F29F04] bg-[#F29F04]/10 backdrop-blur-md animate-fade-in-up">
            <span className="text-white text-sm font-normal">
              Inferra — built on data, driven by profit
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-medium text-center leading-[1.1] tracking-tight max-w-[900px] text-gradient-hero drop-shadow-2xl">
            Scaling traffic with data-driven decisions
          </h1>

          {/* Subheading */}
          <p className="text-[#BDBDBD] text-center text-base md:text-lg max-w-[850px] leading-relaxed font-light">
            We help brands, advertisers, and affiliates grow through performance marketing, 
            traffic arbitrage, and advanced analytics. Our focus is on stable ROI, scalable 
            funnels, and long-term results — not short-term hacks.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <button className="min-w-[180px] px-8 py-3 rounded-full bg-[#F29F04] text-[#0D0D0D] font-medium text-base hover:bg-[#e09204] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(242,159,4,0.3)]">
              Become a partner
            </button>
            <button className="min-w-[180px] px-8 py-3 rounded-full border border-[#FCC660] text-[#FCC660] font-medium text-base hover:bg-[#FCC660]/10 transition-all transform hover:scale-105 active:scale-95">
              Join the team
            </button>
          </div>

        </div>

        {/* Hero Image */}
        <div className="relative mt-16 w-full max-w-[1240px] aspect-[1240/400] md:aspect-[1240/250] rounded-[40px] overflow-hidden group">
            {/* Image Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-t from-[#F29F04]/20 to-transparent opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-700"></div>
            
            <img 
                src="https://picsum.photos/1240/400?grayscale" 
                alt="Inferra Dashboard Abstract" 
                className="w-full h-full object-cover object-center rounded-[40px] border border-white/10 shadow-2xl relative z-10 opacity-80 hover:opacity-100 transition-opacity duration-700"
            />
            
            {/* Overlay Gradient on Image to blend with bottom if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-20 pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};

export default Hero;