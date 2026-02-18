import React from 'react';
import Image from 'next/image';

const BlogCTA: React.FC = () => {
    return (
        <section className="w-full overflow-hidden px-5 pb-20">
            <div className="relative mx-auto flex w-full max-w-[1340px] flex-col items-center justify-center gap-16 overflow-hidden rounded-[40px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] p-10 lg:min-h-[480px] lg:flex-row lg:gap-6">
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-146px] bottom-[-336px] h-[642px] w-[642px] opacity-40 lg:left-[-532px] lg:top-[-402px] lg:bottom-auto lg:h-[1284px] lg:w-[1284px]"
                    viewBox="0 0 1284 1284"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g filter="url(#filter0_f_blog_cta)">
                        <circle cx="641.997" cy="627.499" r="441.337" fill="url(#paint0_radial_blog_cta)" fillOpacity="0.4" />
                    </g>
                    <g filter="url(#filter1_f_blog_cta)">
                        <circle cx="641.997" cy="653.597" r="553.266" fill="url(#paint1_linear_blog_cta)" fillOpacity="0.5" />
                    </g>
                    <g filter="url(#filter2_f_blog_cta)">
                        <circle cx="641.998" cy="641.998" r="641.998" fill="url(#paint2_linear_blog_cta)" fillOpacity="0.2" />
                    </g>
                    <defs>
                        <filter id="filter0_f_blog_cta" x="130.66" y="116.162" width="1022.67" height="1022.67" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="35" result="effect1_foregroundBlur_blog_cta" />
                        </filter>
                        <filter id="filter1_f_blog_cta" x="48.7305" y="60.3311" width="1186.53" height="1186.53" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_blog_cta_2" />
                        </filter>
                        <filter id="filter2_f_blog_cta" x="-60" y="-60" width="1404" height="1404" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="30" result="effect1_foregroundBlur_blog_cta_3" />
                        </filter>
                        <radialGradient id="paint0_radial_blog_cta" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(641.997 406.831) rotate(90) scale(220.669 354.177)">
                            <stop stopColor="#F29F04" stopOpacity="0.26" />
                            <stop offset="1" stopColor="#F29F04" stopOpacity="0.5" />
                        </radialGradient>
                        <linearGradient id="paint1_linear_blog_cta" x1="641.997" y1="100.331" x2="641.997" y2="469.66" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFD8D4" stopOpacity="0.16" />
                            <stop offset="1" stopColor="#FF9C94" stopOpacity="0.19" />
                        </linearGradient>
                        <linearGradient id="paint2_linear_blog_cta" x1="641.998" y1="0" x2="641.998" y2="428.561" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFD8D4" stopOpacity="0.16" />
                            <stop offset="1" stopColor="#FF9C94" stopOpacity="0.19" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="relative z-10 order-2 h-[350px] w-full max-w-[350px] shrink-0 lg:order-1 lg:h-[400px] lg:max-w-[400px] lg:self-start">
                    <div className="absolute left-1/2 top-0 h-[540px] w-[263px] -translate-x-1/2 lg:left-[50px] lg:h-[617px] lg:w-[300px] lg:translate-x-0">
                        <Image
                            src="https://api.builder.io/api/v1/image/assets/TEMP/b293dd4a4e5fc8a66eecd786d41b3a5216c2c212?width=600"
                            alt="iPhone"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="absolute left-[11px] top-[277px] z-20 flex h-[79px] w-[280px] items-center gap-[10.5px] rounded-[8.75px] bg-[#232336] p-[10.5px] lg:left-3 lg:top-[300px] lg:h-[90px] lg:w-[320px] lg:gap-3 lg:rounded-[10px] lg:p-3 xl:top-[316px]">
                        <div className="h-[25px] w-[25px] shrink-0 lg:h-[29px] lg:w-[29px]">
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                                <path d="M6.50195 14.1895L14.7807 1.18164L23.0572 14.1895L14.7807 18.9186L6.50195 14.1895Z" fill="#9FA8DA" />
                                <path d="M14.7812 1.18164L23.0578 14.1895L14.7812 18.9186V1.18164Z" fill="#7986CB" />
                                <path d="M6.50195 15.9634L14.7807 20.6925L23.0572 15.9634L14.7807 27.1976L6.50195 15.9634Z" fill="#9FA8DA" />
                                <path d="M14.7807 20.6923L23.0572 15.9632L14.7807 27.1974V20.6923ZM6.50195 14.1895L14.7807 10.6421L23.0572 14.1895L14.7807 18.9186L6.50195 14.1895Z" fill="#7986CB" />
                                <path d="M14.7812 10.6421L23.0578 14.1895L14.7812 18.9186V10.6421Z" fill="#5C6BC0" />
                            </svg>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex w-full items-start justify-between gap-2 lg:w-[255.621px]">
                                <div className="min-w-0">
                                    <p className="font-poppins text-[14px] font-normal leading-[22.75px] text-[#FCFCFC] lg:text-[16px] lg:leading-[26px]">Bought ETH</p>
                                    <p className="font-poppins text-[12.25px] font-normal leading-[14px] text-[#A7A7CC] lg:text-[14px] lg:leading-[16px]">-$812.10</p>
                                </div>
                                <p className="whitespace-nowrap font-poppins text-[14px] font-medium leading-[22.75px] text-[#FCFCFC] lg:text-[16px] lg:leading-[26px]">+0.65 ETH</p>
                            </div>
                            <p className="text-right font-poppins text-[12.25px] font-normal leading-[14px] text-[#A7A7CC] lg:text-[14px] lg:leading-[16px]">30 March 2025, 3.30 PM</p>
                        </div>
                    </div>
                </div>

                <div className="z-10 order-1 flex w-full max-w-[796px] flex-1 flex-col items-start justify-center gap-6 lg:order-2">
                    <h2 className="bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent font-poppins text-[40px] font-medium leading-[48px] tracking-[-0.8px] md:text-[56px] md:leading-[72px] md:tracking-[-2.24px]">
                        Let&apos;s build scalable traffic systems together!
                    </h2>
                    <p className="max-w-[552px] text-[#BDBDBD] text-[20px] leading-[32px] font-normal font-poppins">
                        Partner with a team focused on performance, data, and long-term results - not experiments
                    </p>
                    <button className="flex h-[50px] w-[172px] items-center justify-center rounded-[80px] bg-[#F29F04] px-5 py-3 text-[14px] font-medium leading-4 text-[#0D0D0D] font-poppins transition-opacity hover:opacity-90 md:w-[180px] md:px-6 md:text-[16px] md:leading-[26px]">
                        Get in touch
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogCTA;
