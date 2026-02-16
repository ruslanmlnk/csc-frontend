import React from 'react';
import Image from 'next/image';

const BlogCTA: React.FC = () => {
    return (
        <section className="w-full overflow-hidden px-5 pb-20">
            <div className="relative mx-auto flex w-full max-w-[1340px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[40px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] p-6 md:p-10 lg:min-h-[480px] lg:flex-row">
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-532px] top-[-402px] h-[1284px] w-[1284px] opacity-40"
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

                <div className="relative z-10 h-[400px] w-full max-w-[400px] shrink-0 lg:self-start">
                    <div className="absolute left-1/2 top-0 h-[617px] w-[300px] -translate-x-1/2 lg:left-[50px] lg:translate-x-0">
                        <Image
                            src="https://api.builder.io/api/v1/image/assets/TEMP/b293dd4a4e5fc8a66eecd786d41b3a5216c2c212?width=600"
                            alt="iPhone"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="absolute left-3 top-[300px] z-20 flex h-[90px] w-[280px] items-center gap-3 rounded-[10px] bg-[#232336] p-3 sm:top-[316px] sm:w-[320px]">
                        <div className="h-[29px] w-[29px] shrink-0">
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.50195 14.1895L14.7807 1.18164L23.0572 14.1895L14.7807 18.9186L6.50195 14.1895Z" fill="#9FA8DA" />
                                <path d="M14.7812 1.18164L23.0578 14.1895L14.7812 18.9186V1.18164Z" fill="#7986CB" />
                                <path d="M6.50195 15.9634L14.7807 20.6925L23.0572 15.9634L14.7807 27.1976L6.50195 15.9634Z" fill="#9FA8DA" />
                                <path d="M14.7807 20.6923L23.0572 15.9632L14.7807 27.1974V20.6923ZM6.50195 14.1895L14.7807 10.6421L23.0572 14.1895L14.7807 18.9186L6.50195 14.1895Z" fill="#7986CB" />
                                <path d="M14.7812 10.6421L23.0578 14.1895L14.7812 18.9186V10.6421Z" fill="#5C6BC0" />
                            </svg>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex w-full items-start justify-between gap-2 sm:w-[255.621px]">
                                <div className="min-w-0">
                                    <p className="text-[16px] leading-[26px] font-normal text-[#FCFCFC] font-poppins">Bought ETH</p>
                                    <p className="text-[14px] leading-[16px] font-normal text-[#A7A7CC] font-poppins">-$812.10</p>
                                </div>
                                <p className="text-[16px] leading-[26px] font-medium text-[#FCFCFC] font-poppins whitespace-nowrap">+0.65 ETH</p>
                            </div>
                            <p className="text-right text-[14px] leading-[16px] font-normal text-[#A7A7CC] font-poppins">30 March 2025, 3.30 PM</p>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex w-full max-w-[796px] flex-1 flex-col items-start justify-center gap-6">
                    <h2 className="bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent font-poppins text-[36px] font-medium leading-[46px] tracking-[-1px] md:text-[56px] md:leading-[72px] md:tracking-[-2.24px]">
                        Let&apos;s build scalable traffic systems together!
                    </h2>
                    <p className="max-w-[552px] text-[#BDBDBD] text-[18px] leading-[30px] font-normal font-poppins md:text-[20px] md:leading-[32px]">
                        Partner with a team focused on performance, data, and long-term results - not experiments
                    </p>
                    <button className="flex h-[50px] w-[180px] items-center justify-center rounded-[80px] bg-[#F29F04] px-6 py-3 text-[16px] font-medium leading-[26px] text-[#0D0D0D] font-poppins transition-opacity hover:opacity-90">
                        Get in touch
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogCTA;
