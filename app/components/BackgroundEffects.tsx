import React from 'react';

const BackgroundEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">

      {/* Right Side Golden Glow Cluster */}
      <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-[#F29F04]/20 to-transparent rounded-full blur-[120px] mix-blend-screen opacity-60"></div>

      {/* Left Side Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#F29F04]/10 to-transparent rounded-full blur-[100px] mix-blend-screen opacity-40"></div>

      {/* Decorative Grid Lines (SVG approximation of the Figma lines) */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical Lines */}
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="url(#line-gradient)" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="url(#line-gradient)" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Glowing central vertical lines behind text */}
          <g filter="url(#glow)">
            <line x1="35%" y1="20%" x2="35%" y2="80%" stroke="#F29F04" strokeWidth="0.5" strokeOpacity="0.2" />
            <line x1="65%" y1="20%" x2="65%" y2="80%" stroke="#F29F04" strokeWidth="0.5" strokeOpacity="0.2" />
          </g>
        </svg>
      </div>

      {/* Decorative Sparkles/Noise overlay */}
      <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[url('/images/sparkles.webp')] opacity-40 mix-blend-lighten pointer-events-none"></div>

      {/* Large Central Dark Circle to create vignette focus */}
      <div className="absolute top-[-50%] left-1/2 transform -translate-x-1/2 w-[150%] h-[150%] rounded-full bg-[radial-gradient(from_transparent_via-[#0D0D0D]/50_to-[#0D0D0D])] pointer-events-none"></div>
    </div>
  );
};

export default BackgroundEffects;