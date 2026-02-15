import React from 'react';
import Image from 'next/image';

const BlogCTA: React.FC = () => {
    return (
        <section className="w-full px-5 pb-20 overflow-hidden">
            <div className="relative w-full max-w-[1280px] mx-auto rounded-[40px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] p-10 flex flex-row items-center gap-6 overflow-hidden">
                {/* Background SVG from Figma */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg className="absolute left-[-532px] top-[-402px] w-[1284px] h-[1284px]" viewBox="0 0 1284 1284" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_cta)">
                            <circle cx="641.997" cy="627.499" r="441.337" fill="url(#paint0_radial_cta)" fillOpacity="0.4" />
                        </g>
                        <defs>
                            <filter id="filter0_f_cta" x="130.66" y="116.162" width="1022.67" height="1022.67" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feGaussianBlur stdDeviation="35" result="effect1_foregroundBlur" />
                            </filter>
                            <radialGradient id="paint0_radial_cta" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(641.997 406.831) rotate(90) scale(220.669 354.177)">
                                <stop stopColor="#F29F04" stopOpacity="0.26" />
                                <stop offset="1" stopColor="#F29F04" stopOpacity="0.5" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>

                <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center">
                    <div className="relative w-[300px] h-[617px]">
                        <Image
                            src="https://api.builder.io/api/v1/image/assets/TEMP/dd60aaa297bd160ce7c4545e039cbfca07366e88?width=600"
                            alt="iPhone"
                            fill
                            className="object-contain"
                        />
                    </div>
                    {/* Transaction Card Overlay */}
                    <div className="absolute left-[12px] top-[316px] w-[320px] h-[90px] p-3 bg-[#232336] rounded-[10px] flex items-center gap-3 border border-white/5 shadow-2xl z-20">
                        <div className="w-[29px] h-[29px] shrink-0">
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                                <path d="M6.50195 14.1895L14.7807 1.18164L23.0572 14.1895L14.7807 18.9186L6.50195 14.1895Z" fill="#9FA8DA" />
                                <path d="M14.7812 1.18164L23.0578 14.1895L14.7812 18.9186V1.18164Z" fill="#7986CB" />
                                <path d="M6.50195 15.9634L14.7807 20.6925L23.0572 15.9634L14.7807 27.1976L6.50195 15.9634Z" fill="#9FA8DA" />
                            </svg>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[16px] leading-[26px]">
                                <span className="text-[#FCFCFC] font-poppins">Bought ETH</span>
                                <span className="text-[#FCFCFC] font-medium font-poppins">+0.65 ETH</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px] leading-[16px] text-[#A7A7CC]">
                                <span className="font-poppins">-$812.10</span>
                                <span className="text-right font-poppins">30 March 2025, 3.30 PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col gap-6 items-start">
                    <h2 className="text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
                        Let’s build scalable traffic systems together!
                    </h2>
                    <p className="max-w-[552px] text-[#BDBDBD] text-[20px] leading-[32px] font-poppins">
                        Partner with a team focused on performance, data, and long-term results — not experiments
                    </p>
                    <button className="px-[24px] py-[12px] h-[58px] min-w-[180px] rounded-[80px] bg-[#F29F04] text-[#0D0D0D] font-medium text-[16px] transition-all hover:opacity-90 font-poppins">
                        Get in touch
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogCTA;
