"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const ServicesPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All Services');

    const categories = [
        'All Services', 'SPY Services', 'Anti-detection browsers',
        'Cloaking', 'Creatives', 'Payment instruments', 'Proxy', 'Trackers'
    ];

    const services = [
        {
            id: 1,
            name: 'KeyProxy',
            description: 'KeyProxy — business-grade mobile proxies. Operating since 2017, stability is our priority!',
            category: 'Proxy',
            price: '10/week, 28/month',
            offer: 'CLICKSTORM offers a 15% discount on...',
            brand: 'Clickstorm',
            logo: (
                <svg width="77" height="56" viewBox="0 0 77 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.66134 27.1377L7.35891 20.8545L18.6149 8.99365H24.6629L14.5157 19.9137L11.4917 23.1392L7.66134 27.1377ZM2.78931 32.5137V8.99365H8.19892V32.5137H2.78931ZM18.8837 32.5137L10.5173 22.2657L14.0789 18.4017L25.2341 32.5137H18.8837Z" fill="white" />
                    <path d="M48.631 8.9895H30.9468L29.4731 13.1158H47.0099L48.631 8.9895Z" fill="#253E8E" />
                    <path d="M48.631 18.5684H30.9468L29.4731 22.6947H47.0099L48.631 18.5684Z" fill="#253E8E" />
                    <path d="M48.631 28.2948H30.9468L29.4731 32.4211H47.0099L48.631 28.2948Z" fill="#253E8E" />
                    <path d="M61.6879 32.5137V22.9041L62.931 26.1968L52.5823 8.99365H58.3614L66.291 22.1985H62.9647L70.9279 8.99365H76.2703L65.9214 26.1968L67.131 22.9041V32.5137H61.6879Z" fill="white" />
                </svg>
            )
        },
        {
            id: 2,
            name: 'Geonix',
            description: 'Geonix — reliable and scalable proxies for any task. A provider focused on stability and speed: a wide network...',
            category: 'Proxy',
            price: '1,65/month',
            offer: 'CSC - 15% discount on RU versions',
            brand: 'CSC',
            logo: (
                <svg width="140" height="56" viewBox="0 0 140 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.8277 21.0089C49.4251 21.0089 52.2685 22.2864 54.3579 24.8383C56.4473 27.3917 57.2875 30.5979 56.8815 34.4555H40.5187C40.6927 35.6155 41.2504 36.5955 42.1947 37.3926C43.1375 38.1912 44.3347 38.618 45.7846 38.676C46.8003 38.734 47.7491 38.5525 48.6354 38.1317C49.5203 37.7108 50.1508 37.1532 50.5285 36.4557H56.6644C55.9685 38.8351 54.633 40.6851 52.6611 42.0042C50.6877 43.3247 48.396 43.9835 45.7846 43.9835C42.2735 43.9835 39.5179 42.8741 37.5162 40.6539C35.5145 38.4336 34.5137 35.7136 34.5137 32.494C34.5137 29.2446 35.5799 26.5172 37.7125 24.3118C39.8435 22.1109 42.5486 21.0089 45.8277 21.0089ZM49.0697 27.2311C48.1551 26.5931 47.0606 26.2733 45.7846 26.2733C44.5072 26.2733 43.3978 26.599 42.4549 27.2519C41.5121 27.9047 40.8801 28.7821 40.5618 29.8841H50.9197C50.5999 28.7554 49.9843 27.8705 49.0697 27.2311Z" fill="#FFC42B" />
                    <path d="M78.8228 40.7223C76.6753 42.898 73.8617 43.9865 70.3803 43.9865C66.899 43.9865 64.0838 42.898 61.9379 40.7223C59.7905 38.5466 58.7168 35.8044 58.7168 32.497C58.7168 29.2194 59.7905 26.4845 61.9379 24.294C64.0838 22.1035 66.899 21.0074 70.3803 21.0074C73.8617 21.0074 76.6753 22.1035 78.8228 24.294C80.9687 26.4845 82.0439 29.2194 82.0439 32.497C82.0439 35.8058 80.9702 38.5466 78.8228 40.7223ZM70.3803 38.2864C72.0623 38.2864 73.4483 37.7287 74.5369 36.6104C75.6239 35.4936 76.1682 34.1224 76.1682 32.4985C76.1682 30.8448 75.6314 29.4603 74.5577 28.342C73.484 27.2251 72.0905 26.666 70.3788 26.666C68.6672 26.666 67.2737 27.2251 66.2015 28.342C65.1278 29.4588 64.5909 30.8448 64.5909 32.4985C64.5909 34.1522 65.1278 35.5307 66.2015 36.6327C67.2752 37.7347 68.6672 38.2864 70.3803 38.2864Z" fill="#FFC42B" />
                    <path d="M96.5192 21.0522C99.1886 21.0522 101.291 21.9088 102.829 23.6205C104.367 25.3322 105.136 27.7265 105.136 30.8019V43.3354H99.26V31.6718C99.26 30.1639 98.8391 28.9742 97.9974 28.1027C97.1557 27.2327 96.0969 26.797 94.8209 26.797C93.4572 26.797 92.2973 27.2833 91.3395 28.2544C90.3818 29.227 89.903 30.5104 89.903 32.1061V43.3339H84.0273V21.662H89.729V24.2734H89.9461C91.4853 22.126 93.6758 21.0522 96.5192 21.0522Z" fill="white" />
                    <path d="M108.055 12H113.931V18.8765H108.055V12ZM108.055 21.6619H113.931V43.3338H108.055V21.6619Z" fill="white" />
                    <path d="M131.506 32.323L139.688 43.3337H132.159L127.632 36.936L123.236 43.3337H115.837L124.02 32.4538L115.925 21.6603H123.454L127.937 28.101L132.289 21.6603H139.209L131.506 32.323Z" fill="white" />
                    <path d="M9.78706 24.1632C10.1425 23.5044 10.5842 22.8873 11.1151 22.3132C12.7256 20.5733 14.8641 19.6885 17.5335 19.6587C19.3032 19.6305 20.8632 20.029 22.212 20.8559C23.5608 21.6827 24.5542 22.7921 25.1937 24.1855H32.0702C31.2582 21.0239 29.5465 18.4556 26.9351 16.4822C24.3237 14.5088 21.2052 13.5228 17.5781 13.5228C13.0513 13.5228 9.38851 15.0025 6.58974 17.9619C5.65136 18.9538 4.87359 20.0201 4.25049 21.1592C6.54513 21.2142 8.56762 22.3921 9.78706 24.1632Z" fill="#FFC42B" />
                    <path d="M32.7232 27.1017H20.7488V32.6725H25.8467C25.295 34.2681 24.2941 35.5382 22.8442 36.4795C21.3927 37.4223 19.6677 37.8804 17.666 37.8506C14.9683 37.8224 12.7986 36.9301 11.1598 35.1738C10.4044 34.3648 9.82437 33.4696 9.4169 32.4895C8.1454 34.0257 6.22552 35.0058 4.08109 35.0058C3.90412 35.0058 3.73012 34.9968 3.55762 34.9835C4.25954 36.6758 5.27525 38.212 6.61218 39.5906C9.42582 42.492 13.0678 43.9434 17.5351 43.9434C22.2359 43.9434 26.0222 42.3328 28.8938 39.1132C31.7654 35.8921 33.0414 31.8887 32.7232 27.1017Z" fill="#FFC42B" />
                    <path d="M4.07954 23.7825C3.73898 23.7825 3.41033 23.8256 3.09357 23.9C1.196 24.3461 -0.218262 26.0459 -0.218262 28.0803C-0.218262 29.9734 1.00713 31.5765 2.70692 32.1505C3.13818 32.2963 3.59919 32.3781 4.08102 32.3781C6.45448 32.3781 8.37882 30.4537 8.37882 28.0803C8.37882 25.7068 6.45448 23.7825 4.07954 23.7825Z" fill="white" />
                </svg>
            )
        },
        {
            id: 3,
            name: 'Dolphin{anty}',
            description: 'Dolphin{anty} is a next-generation anti-detection browser built to simplify and protect multi-accounting. It replaces…',
            category: 'ANTI-DETECTION BROWSERS',
            price: '10/month',
            offer: null,
            brand: 'Dolphin',
            logo: (
                <div className="relative w-[56px] h-[56px] flex items-center justify-center">
                    <Image
                        src="/dolphin.svg"
                        alt="Dolphin{anty}"
                        width={56}
                        height={56}
                        className="object-contain"
                    />
                </div>
            )
        }
    ];

    return (
        <main className="min-h-screen bg-[#0D0D0D] overflow-x-hidden font-poppins">
            <Header />

            {/* Top Section */}
            <section className="relative w-full h-[646px] flex flex-col items-center pt-[120px] px-[100px] overflow-hidden">
                {/* Background Pattern and Gradients */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-40 mix-blend-soft-light"
                        style={{
                            backgroundImage: "url('/images/services-top-bg.webp')",
                            backgroundSize: '100px 100px',
                            backgroundRepeat: 'repeat'
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(83deg, rgba(242, 159, 4, 0.70) 0.75%, #0D0D0D 30.5%, #0D0D0D 69.72%, rgba(242, 159, 4, 0.70) 99.19%)'
                        }}
                    />
                    {/* SVG Gradients (translated from Figma) */}
                    <div className="absolute inset-0 flex justify-center items-center scale-150">
                        <svg width="100%" height="100%" viewBox="0 0 3522 3818" fill="none" className="opacity-60">
                            <g filter="url(#filter0_f)">
                                <circle cx="926" cy="2892" r="926" fill="#0D0D0D" />
                            </g>
                            <g filter="url(#filter1_f)">
                                <circle cx="2596" cy="2892" r="926" fill="#0D0D0D" />
                            </g>
                            <g filter="url(#filter2_f)">
                                <circle cx="926" cy="926" r="926" fill="#0D0D0D" />
                            </g>
                            <g filter="url(#filter3_f)">
                                <circle cx="2596" cy="926" r="926" fill="#0D0D0D" />
                            </g>
                            <defs>
                                <filter id="filter0_f" x="-200" y="1766" width="2252" height="2252" filterUnits="userSpaceOnUse">
                                    <feGaussianBlur stdDeviation="100" />
                                </filter>
                                <filter id="filter1_f" x="1470" y="1766" width="2252" height="2252" filterUnits="userSpaceOnUse">
                                    <feGaussianBlur stdDeviation="100" />
                                </filter>
                                <filter id="filter2_f" x="-200" y="-200" width="2252" height="2252" filterUnits="userSpaceOnUse">
                                    <feGaussianBlur stdDeviation="100" />
                                </filter>
                                <filter id="filter3_f" x="1470" y="-200" width="2252" height="2252" filterUnits="userSpaceOnUse">
                                    <feGaussianBlur stdDeviation="100" />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col items-center gap-6 text-center pt-20">
                    <h1 className="text-[80px] font-medium leading-[88px] tracking-[-3.2px] text-transparent bg-clip-text bg-gradient-to-b from-white to-[#999] max-w-[1020px] drop-shadow-lg">
                        Sharing experience with the industry
                    </h1>
                    <p className="text-[16px] leading-[26px] text-[#BDBDBD] max-w-[720px] drop-shadow-md">
                        We participate in and speak at major affiliate and marketing conferences, sharing insights, strategies, and real case studies from active campaigns
                    </p>
                </div>
            </section>

            {/* Body Section */}
            <section className="relative w-full px-[100px] pb-[80px] flex flex-col gap-20 -mt-[40px]">
                {/* Banner Image */}
                <div className="relative w-full h-[158px] rounded-[40px] overflow-hidden z-20 bg-gradient-to-r from-[#1A1A1A] to-[#333] border border-white/10 flex items-center justify-center">
                    <span className="text-white/20 text-[24px] font-medium">Special Offers Banner</span>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-col items-center gap-8 self-stretch">
                    <div className="flex p-2 items-start gap-4 rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A]">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-[80px] transition-all text-[16px] font-medium leading-[26px] ${activeCategory === cat
                                    ? 'bg-[#F29F04] text-[#070707]'
                                    : 'text-[#FCFCFC] hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="flex p-8 flex-col justify-center items-start gap-8 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group hover:border-[#F29F04] transition-all">
                            {/* Card Header */}
                            <div className="flex w-full justify-between items-center h-[56px]">
                                {service.logo}
                                <div className="px-3 py-1.5 rounded-[80px] border border-[#B3B3B3] text-[#B3B3B3] text-[14px]">
                                    {service.category}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex flex-col gap-4 self-stretch">
                                <h3 className="text-white text-[20px] font-medium leading-[32px]">{service.name}</h3>
                                <p className="text-[#BDBDBD] text-[16px] leading-[26px] h-20 overflow-hidden line-clamp-3">{service.description}</p>
                            </div>

                            {/* Card Footer (Price & Offer) */}
                            <div className="flex flex-col gap-4 self-stretch pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1.5">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M11.6 3.3C12.2 3.3 12.9 3.6 13.4 4C13.8 4.5 14.1 5.2 14.1 5.8C14.1 6.1 14.2 6.3 14.4 6.4C14.5 6.6 14.7 6.7 14.9 6.7C15.2 6.7 15.4 6.6 15.5 6.4C15.7 6.3 15.8 6.1 15.8 5.8V5.7C15.8 4.6 15.3 3.6 14.5 2.8C13.7 2 12.7 1.6 11.6 1.6H10.8V0.8C10.8 0.6 10.7 0.4 10.5 0.2C10.4 0 10.2 0 9.9 0C9.7 0 9.5 0 9.4 0.2C9.2 0.4 9.1 0.6 9.1 0.8V1.6H8.3C7.3 1.6 6.4 2 5.6 2.6C4.8 3.3 4.3 4.2 4.2 5.2C4 6.2 4.2 7.2 4.7 8C5.2 8.9 6.1 9.5 7 9.8L9.1 10.6V16.6H8.3C7.7 16.6 7 16.3 6.5 15.9C6.1 15.4 5.8 14.7 5.8 14.1C5.8 13.8 5.7 13.6 5.5 13.5C5.4 13.3 5.2 13.2 4.9 13.2C4.7 13.2 4.5 13.3 4.4 13.5C4.2 13.6 4.1 13.8 4.1 14.1V14.2C4.1 15.3 4.6 16.3 5.4 17.1C6.2 17.9 7.2 18.3 8.3 18.3H9.1V19.1C9.1 19.3 9.2 19.5 9.4 19.7C9.5 19.9 9.7 20 9.9 20C10.2 20 10.4 19.9 10.5 19.7C10.7 19.5 10.8 19.3 10.8 19.1V18.3H11.6C12.6 18.3 13.5 17.9 14.3 17.3C15.1 16.6 15.6 15.7 15.7 14.7C15.9 13.7 15.7 12.7 15.2 11.9C14.7 11 13.8 10.4 12.9 10.1L10.8 9.4V3.3H11.6Z" fill="white" />
                                    </svg>
                                    <div className="text-[20px] font-semibold text-white">
                                        {service.price}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center h-10">
                                    <div className="px-3 py-1 rounded-[80px] border border-[#06DF73] text-[#06DF73] text-[14px] uppercase font-medium">
                                        {service.brand}
                                    </div>
                                    <span className="text-[#BDBDBD] text-[14px] text-right font-light italic max-w-[200px]">
                                        {service.offer}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex p-10 justify-between items-center self-stretch rounded-[40px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A]">
                    <div className="text-[#A5A5A5] text-[24px]">Showing 1-6 of 15 services</div>
                    <div className="flex items-center gap-2.5">
                        <button className="w-[48px] h-[58px] flex items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] hover:bg-white/5 transition-colors group">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3.6 8L11.1 0.2C11.4 -0.1 11.8 -0.1 12.1 0.2C12.4 0.5 12.4 1 12.1 1.2L5.3 8L12.1 14.8C12.4 15.1 12.4 15.6 12.1 15.9C11.8 16.2 11.4 16.2 11.1 15.9L3.6 8.5C3.5 8.2 3.5 7.8 3.6 8Z" fill="#A5A5A5" className="group-hover:fill-white transition-colors" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                            <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#F29F04] text-[#070707] text-[24px] font-medium shadow-[inset_0_4px_4px_rgba(255,255,255,0.3)]">1</button>
                            <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] text-[#A5A5A5] text-[24px] hover:bg-white/5 hover:text-white transition-all">2</button>
                            <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] text-[#A5A5A5] text-[24px] hover:bg-white/5 hover:text-white transition-all">3</button>
                        </div>
                        <button className="w-[48px] h-[58px] flex items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] hover:bg-white/5 transition-colors group">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.4 8L4.9 0.2C4.6 -0.1 4.2 -0.1 3.9 0.2C3.6 0.5 3.6 1 3.9 1.2L10.7 8L3.9 14.8C3.6 15.1 3.6 15.6 3.9 15.9C4.2 16.2 4.6 16.2 4.9 15.9L12.4 8.5C12.5 8.2 12.5 7.8 12.4 8Z" fill="#A5A5A5" className="group-hover:fill-white transition-colors" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="relative w-full h-[158px] rounded-[40px] overflow-hidden z-20 mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#333] border border-white/10 flex items-center justify-center">
                    <span className="text-white/20 text-[24px] font-medium">Special Offers Banner</span>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ServicesPage;
