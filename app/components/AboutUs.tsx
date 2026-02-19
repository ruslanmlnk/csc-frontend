import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AboutUsProps {
    data?: {
        badgeText?: string | null;
        title?: string | null;
        description?: string | null;
        buttonLink?: string | null;
    } | null;
}

const AboutUs: React.FC<AboutUsProps> = ({ data }) => {
    const badgeText = data?.badgeText?.trim() || 'What we do';
    const title = data?.title?.trim() || 'Performance marketing built on data';
    const description = data?.description?.trim()
        || 'ClickStorm is a performance-driven agency working at the intersection of traffic arbitrage, CPA marketing, and analytics. We launch, test, and scale traffic across multiple sources while keeping full control over metrics, budgets, and profitability.';
    const buttonHref = data?.buttonLink?.trim() || '/services';
    const isExternalLink = /^https?:\/\//i.test(buttonHref);
    const buttonClasses = 'flex w-[172px] lg:w-[180px] h-[50px] py-[12px] px-[20px] lg:px-[24px] justify-center items-center gap-[12px] rounded-[80px] bg-[#F29F04] transition-all hover:brightness-110 active:scale-95';

    return (
        <section className="relative w-full bg-[#0D0D0D] py-[80px] lg:py-[120px] flex flex-col items-center overflow-hidden">
            <div className="relative z-10 w-full max-w-[1280px] px-5 flex flex-col lg:flex-row items-center gap-[64px] self-center">

                {/* --- Left Side: Picture/Graphic (592x680) --- */}
                <div className="relative w-full max-w-[350px] lg:max-w-none lg:w-[592px] h-[402.03px] lg:h-[680px] bg-[#1A1A1A] rounded-[23.649px] lg:rounded-[40px] border border-[rgba(74,74,74,0.70)] overflow-hidden backdrop-blur-[2px] flex-shrink-0 shadow-lg">

                    {/* Decorative Vector Gradient Background - Filling the entire container */}
                    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                        <Image
                            src="/images/about-vector-bg.png"
                            alt="Vector Gradient"
                            fill
                            className="object-cover"
                        />
                    </div>



                    {/* iPhone Mockup (Center-ish) */}
                    <div className="absolute left-[60px] top-[30px] w-[231px] h-[383px] lg:left-[101px] lg:top-[50px] lg:w-[390px] lg:h-[630px] z-10">
                        <Image
                            src="/images/iphone-14-mockup.png"
                            alt="iPhone Mockup"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Floating Transaction Card: Converted ETH */}
                    <div
                        className="absolute left-[145px] top-[134px] w-[193px] h-[56px] rounded-[7.095px] lg:left-[245px] lg:top-[227px] lg:w-[327px] lg:h-[92px] lg:rounded-[12px] border border-[0.591px] border-white/30 lg:border lg:border-white/30 backdrop-blur-[23.6486px] lg:backdrop-blur-[40px] px-[11.824px] py-[11.824px] lg:px-[20px] lg:py-[20px] flex items-center gap-[7.095px] lg:gap-[12px] z-20 shadow-2xl transition-transform hover:scale-105 duration-500"
                        style={{
                            background: 'radial-gradient(114.2% 133.85% at 7.14% 3.6%, rgba(35, 35, 54, 0.80) 0%, #232336 0.01%, rgba(35, 35, 54, 0.30) 100%)'
                        }}
                    >
                        <div className="w-[15px] h-[15px] lg:w-[24px] lg:h-[24px] flex-shrink-0 text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.25 9.75004H3.75C3.55109 9.75004 3.36032 9.67102 3.21967 9.53037C3.07902 9.38972 3 9.19895 3 9.00004V4.50004C3 4.30113 3.07902 4.11036 3.21967 3.96971C3.36032 3.82906 3.55109 3.75004 3.75 3.75004C3.94891 3.75004 4.13968 3.82906 4.28033 3.96971C4.42098 4.11036 4.5 4.30113 4.5 4.50004V7.18973L5.87156 5.81816C7.54426 4.13705 9.816 3.18883 12.1875 3.18191H12.2372C14.5885 3.17586 16.8476 4.09639 18.525 5.7441C18.662 5.88422 18.7387 6.07238 18.7387 6.26832C18.7387 6.46426 18.662 6.65242 18.5251 6.79256C18.3881 6.93269 18.2018 7.01367 18.0059 7.01816C17.81 7.02266 17.6201 6.95031 17.4769 6.8166C16.0787 5.44417 14.1964 4.67732 12.2372 4.68191H12.195C10.2189 4.688 8.32601 5.478 6.93188 6.87848L5.56031 8.25004H8.25C8.44891 8.25004 8.63968 8.32906 8.78033 8.46971C8.92098 8.61036 9 8.80113 9 9.00004C9 9.19895 8.92098 9.38972 8.78033 9.53037C8.63968 9.67102 8.44891 9.75004 8.25 9.75004ZM20.25 14.25H15.75C15.5511 14.25 15.3603 14.3291 15.2197 14.4697C15.079 14.6104 15 14.8011 15 15C15 15.199 15.079 15.3897 15.2197 15.5304C15.3603 15.671 15.5511 15.75 15.75 15.75H18.4397L17.0681 17.1216C15.6742 18.5218 13.7817 19.3118 11.8059 19.3182H11.7638C9.80454 19.3228 7.92227 18.5559 6.52406 17.1835C6.45421 17.112 6.37077 17.0552 6.27866 17.0165C6.18655 16.9777 6.08762 16.9577 5.98769 16.9577C5.88775 16.9577 5.78883 16.9777 5.69672 17.0165C5.60461 17.0553 5.52119 17.1121 5.45134 17.1835C5.38149 17.255 5.32663 17.3397 5.28998 17.4327C5.25333 17.5257 5.23563 17.625 5.23793 17.7249C5.24022 17.8248 5.26245 17.9233 5.30333 18.0145C5.3442 18.1057 5.40289 18.1878 5.47594 18.256C7.15338 19.9037 9.41242 20.8242 11.7638 20.8182H11.8125C14.1837 20.811 16.455 19.8628 18.1275 18.1819L19.5 16.8104V19.5C19.5 19.699 19.579 19.8897 19.7197 20.0304C19.8603 20.171 20.0511 20.25 20.25 20.25C20.4489 20.25 20.6397 20.171 20.7803 20.0304C20.921 19.8897 21 19.699 21 19.5V15C21 14.8011 20.921 14.6104 20.7803 14.4697C20.6397 14.3291 20.4489 14.25 20.25 14.25Z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[#FCFCFC] font-poppins text-[9.459px] lg:text-[16px] font-medium leading-[15.372px] lg:leading-[26px]">Converted ETH</span>
                                <span className="text-[#FDD892] font-poppins text-[9.459px] lg:text-[16px] font-normal leading-[15.372px] lg:leading-[26px]">-0.7 ETH</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[#FCFCFC] font-poppins text-[9.459px] lg:text-[16px] font-medium leading-[15.372px] lg:leading-[26px]">+0.052 BTC</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Transaction Card: Solana */}
                    <div className="absolute left-[28px] top-[335px] w-[239px] h-[52px] bg-[#232336] rounded-[9.459px] px-[9.459px] py-[7.095px] lg:left-[47px] lg:top-[567px] lg:w-[405px] lg:h-[88px] lg:rounded-[16px] lg:px-[16px] lg:py-[12px] flex items-center gap-[9.459px] lg:gap-[16px] z-20 shadow-2xl transition-transform hover:scale-105 duration-500">
                        <div className="w-[28.378px] h-[28.378px] lg:w-[48px] lg:h-[48px] flex-shrink-0">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_sol)">
                                    <path d="M33.9024 17.904C33.7344 18.072 33.5088 18.168 33.2736 18.168H10.9776C10.1904 18.168 9.79201 17.2081 10.3392 16.6369L13.9968 12.8497C14.1648 12.6769 14.3952 12.576 14.6352 12.576H37.0128C37.8048 12.576 38.2032 13.5457 37.6416 14.1169L33.9024 17.904ZM33.9024 34.8288C33.7344 34.992 33.5088 35.0881 33.2736 35.0881H10.9776C10.1904 35.0881 9.79201 34.1521 10.3392 33.5953L13.9968 29.8993C14.1648 29.7313 14.3952 29.6353 14.6352 29.6353H37.0128C37.8048 29.6353 38.2032 30.5809 37.6416 31.1377L33.9024 34.8288ZM33.2736 21.1057C33.5088 21.1057 33.7344 21.1968 33.9024 21.3649L37.6416 25.0608C38.2032 25.6128 37.8048 26.5633 37.0128 26.5633H14.6352C14.3952 26.5633 14.1648 26.4673 13.9968 26.2993L10.3392 22.6032C9.78721 22.0464 10.1856 21.1104 10.9776 21.1104L33.2736 21.1057Z" fill="#00FFAD" />
                                    <path d="M24 0C37.2528 0 48 10.7472 48 24C48 37.2528 37.2528 48 24 48C10.7472 48 0 37.2528 0 24C0 10.7472 10.7472 0 24 0Z" fill="black" fillOpacity="0.2" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_sol"><rect width="48" height="48" fill="white" /></clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex-1 flex justify-between items-center text-white">
                            <div className="flex flex-col">
                                <span className="font-poppins text-[11.824px] lg:text-[20px] font-medium leading-[18.919px] lg:leading-[32px]">Solana</span>
                                <span className="text-[#BDBDBD] font-poppins text-[9.459px] lg:text-[16px] font-normal leading-[15.372px] lg:leading-[26px]">34.5 SOL</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-poppins text-[11.824px] lg:text-[20px] font-medium leading-[18.919px] lg:leading-[32px]">$1560.60</span>
                                <span className="text-[#20A12B] font-poppins text-[11.824px] lg:text-[20px] font-normal leading-[18.919px] lg:leading-[32px]">+0.64%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Content Area (Text & UI) --- */}
                <div className="w-full max-w-[350px] lg:max-w-none flex-1 flex flex-col items-center lg:items-start gap-[56px]">
                    <div className="flex flex-col items-center lg:items-start gap-[24px] self-stretch">
                        {/* Label / Badge */}
                        <div className="flex p-[4px] flex-col justify-center items-center gap-[10px] rounded-[40px] bg-[rgba(242,159,4,0.25)]">
                            <div className="flex py-[6px] px-[16px] pb-[8px] justify-center items-center gap-[10px] rounded-[24px] border border-[#F29F04]">
                                <span className="text-white text-center font-poltawski text-[16px] font-normal leading-[26px]">
                                    {badgeText}
                                </span>
                            </div>
                        </div>

                        {/* Title with Gradient */}
                        <h2
                            className="self-stretch text-center lg:text-left font-poppins text-[40px] lg:text-[56px] font-medium leading-[48px] lg:leading-[72px] tracking-[-0.8px] lg:tracking-[-2.24px] bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(180deg, #FFF 25.5%, #999 118.5%)' }}
                        >
                            {title}
                        </h2>

                        {/* Description */}
                        <p className="self-stretch text-center lg:text-left text-[#BDBDBD] font-poppins text-[16px] font-normal leading-[26px]">
                            {description}
                        </p>
                    </div>

                    {/* Learn More Button */}
                    {isExternalLink ? (
                        <a
                            href={buttonHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonClasses}
                        >
                            <span className="text-[#0D0D0D] text-center font-poppins text-[14px] lg:text-[16px] font-medium leading-[16px] lg:leading-[26px]">
                                Learn More
                            </span>
                        </a>
                    ) : (
                        <Link href={buttonHref} className={buttonClasses}>
                            <span className="text-[#0D0D0D] text-center font-poppins text-[14px] lg:text-[16px] font-medium leading-[16px] lg:leading-[26px]">
                                Learn More
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
