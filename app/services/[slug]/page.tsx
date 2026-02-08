"use client";

import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ServiceDetailPage: React.FC = () => {
    const params = useParams();
    const slug = params.slug as string;

    useEffect(() => {
        console.log("Service Detail Slug:", slug);
    }, [slug]);

    const service = {
        name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Service Detail',
        category: 'Proxy',
        price: '10/week, 28/month',
        telegram: '@keyproxy',
        promoCode: 'CLICKSTORM',
        promoDiscount: '15%',
        promoDetail: 'Ukrainian proxies and Multiport',
        description: 'KeyProxy — business-grade mobile proxies. We’ve been operating since 2017, with stability as our top priority!',
        detailedPoints: [
            '50+ GEOs',
            'From $10/week, $28/month',
            'Reliable support',
            '24-hour free trial (Ukraine, Poland, USA)',
            'No-questions-asked money-back',
            'Unique Multiport proxy',
            'Each request uses a new IP',
            'Support for 100+ concurrent threads',
            'Perfect for Mass DM, likes, comments'
        ],
        logo: (
            <svg width="77" height="56" viewBox="0 0 77 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.66134 27.1377L7.35891 20.8545L18.6149 8.99365H24.6629L14.5157 19.9137L11.4917 23.1392L7.66134 27.1377ZM2.78931 32.5137V8.99365H8.19892V32.5137H2.78931ZM18.8837 32.5137L10.5173 22.2657L14.0789 18.4017L25.2341 32.5137H18.8837Z" fill="white" />
                <path d="M48.631 8.9895H30.9468L29.4731 13.1158H47.0099L48.631 8.9895Z" fill="#253E8E" />
                <path d="M48.631 18.5684H30.9468L29.4731 22.6947H47.0099L48.631 18.5684Z" fill="#253E8E" />
                <path d="M48.631 28.2948H30.9468L29.4731 32.4211H47.0099L48.631 28.2948Z" fill="#253E8E" />
                <path d="M61.6879 32.5137V22.9041L62.931 26.1968L52.5823 8.99365H58.3614L66.291 22.1985H62.9647L70.9279 8.99365H76.2703L65.9214 26.1968L67.131 22.9041V32.5137H61.6879Z" fill="white" />
            </svg>
        )
    };

    const similarServices = [
        {
            id: 1,
            name: 'Dolphin{anty}',
            price: '10',
            period: '/month',
            description: 'Dolphin{anty} is a next-generation anti-detection browser built to simplify and protect multi-accounting. It replaces…',
            logo: '/images/dolphin-logo.webp'
        },
        {
            id: 2,
            name: 'Geonix',
            price: '1,65',
            period: '/month',
            description: 'Geonix — reliable and scalable proxies for any task. A provider focused on stability and speed: a wide network...',
            isSvg: true,
            logo: (
                <svg width="60" height="40" viewBox="0 0 140 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.78706 24.1632C10.1425 23.5044 10.5842 22.8873 11.1151 22.3132C12.7256 20.5733 14.8641 19.6885 17.5335 19.6587C19.3032 19.6305 20.8632 20.029 22.212 20.8559C23.5608 21.6827 24.5542 22.7921 25.1937 24.1855H32.0702C31.2582 21.0239 29.5465 18.4556 26.9351 16.4822C24.3237 14.5088 21.2052 13.5228 17.5781 13.5228C13.0513 13.5228 9.38851 15.0025 6.58974 17.9619C5.65136 18.9538 4.87359 20.0201 4.25049 21.1592C6.54513 21.2142 8.56762 22.3921 9.78706 24.1632Z" fill="#FFC42B" />
                    <path d="M32.7232 27.1017H20.7488V32.6725H25.8467C25.295 34.2681 24.2941 35.5382 22.8442 36.4795C21.3927 37.4223 19.6677 37.8804 17.666 37.8506C14.9683 37.8224 12.7986 36.9301 11.1598 35.1738C10.4044 34.3648 9.82437 33.4696 9.4169 32.4895C8.1454 34.0257 6.22552 35.0058 4.08109 35.0058C3.90412 35.0058 3.73012 34.9968 3.55762 34.9835C4.25954 36.6758 5.27525 38.212 6.61218 39.5906C9.42582 42.492 13.0678 43.9434 17.5351 43.9434C22.2359 43.9434 26.0222 42.3328 28.8938 39.1132C31.7654 35.8921 33.0414 31.8887 32.7232 27.1017Z" fill="#FFC42B" />
                </svg>
            )
        }
    ];

    return (
        <main className="min-h-screen bg-[#0D0D0D] overflow-x-hidden font-poppins">
            <Header />

            <div className="flex flex-col pt-32 px-[100px] gap-20">
                {/* Back Link */}
                <Link href="/services" className="flex items-center gap-4 text-[#FCFCFC] group">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="group-hover:-translate-x-1 transition-transform">
                        <path d="M27.9998 16C27.9998 16.2652 27.8945 16.5196 27.7069 16.7071C27.5194 16.8947 27.265 17 26.9998 17H7.41356L14.7073 24.2925C14.8002 24.3854 14.8739 24.4957 14.9242 24.6171C14.9745 24.7385 15.0004 24.8686 15.0004 25C15.0004 25.1314 14.9745 25.2615 14.9242 25.3829C14.8739 25.5043 14.8002 25.6146 14.7073 25.7075C14.6144 25.8004 14.5041 25.8741 14.3827 25.9244C14.2613 25.9747 14.1312 26.0006 13.9998 26.0006C13.8684 26.0006 13.7383 25.9747 13.6169 25.9244C13.4955 25.8741 13.3852 25.8004 13.2923 25.7075L4.29231 16.7075C4.19933 16.6146 4.12557 16.5043 4.07525 16.3829C4.02493 16.2615 3.99902 16.1314 3.99902 16C3.99902 15.8686 4.02493 15.7385 4.07525 15.6171C4.12557 15.4957 4.19933 15.3854 4.29231 15.2925L13.2923 6.29251C13.4799 6.10487 13.7344 5.99945 13.9998 5.99945C14.2652 5.99945 14.5197 6.10487 14.7073 6.29251C14.895 6.48015 15.0004 6.73464 15.0004 7.00001C15.0004 7.26537 14.895 7.51987 14.7073 7.70751L7.41356 15H26.9998C27.265 15 27.5194 15.1054 27.7069 15.2929C27.8945 15.4804 27.9998 15.7348 27.9998 16Z" fill="currentColor" />
                    </svg>
                    <span className="text-[24px]">Back to Services</span>
                </Link>

                {/* Hero Content Part */}
                <div className="flex flex-col items-center gap-12 w-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-6">
                            {service.logo}
                            <h1 className="text-[56px] font-semibold tracking-[-1.12px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
                                {service.name}
                            </h1>
                        </div>
                        <button className="px-6 py-3 rounded-[80px] bg-[#F29F04] text-[#0D0D0D] text-[16px] font-medium hover:bg-[#d98f04] transition-colors">
                            Go to the website
                        </button>
                    </div>

                    {/* Tags / Info Bar */}
                    <div className="flex gap-6 w-full overflow-x-auto pb-2">
                        <div className="flex px-6 py-3 items-center gap-2.5 rounded-[80px] bg-white text-[#0D0D0D]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.69 0.91H2.31C1.04 0.91 0.77 1.65 0.77 2.45v15.39c0 0.41 0.16 0.8 0.45 1.09s0.68 0.45 1.09 0.45h15.38c0.41 0 0.8-0.16 1.09-0.45s0.45-0.68 0.45-1.09V2.45c0-0.8-0.27-1.54-1.54-1.54z" fill="currentColor" opacity="0.1" />
                                <path d="M17.6926 0.913462H15.3849V0.144231C15.3849 -0.0597819 15.3039 -0.255439 15.1596 -0.399698C15.0154 -0.543956 14.8197 -0.625 14.6157 -0.625C14.4117 -0.625 14.216 -0.543956 14.0718 -0.399698C13.9275 -0.255439 13.8465 -0.0597819 13.8465 0.144231V0.913462H6.15415V0.144231C6.15415 -0.0597819 6.0731 -0.255439 5.92884 -0.399698C5.78459 -0.543956 5.58893 -0.625 5.38492 -0.625C5.1809 -0.625 4.98525 -0.543956 4.84099 -0.399698C4.69673 -0.255439 4.61569 -0.0597819 4.61569 0.144231V0.913462H2.30799C1.89997 0.913462 1.50865 1.07555 1.22014 1.36407C0.931619 1.65258 0.769531 2.0439 0.769531 2.45192V17.8365C0.769531 18.2446 0.931619 18.6359 1.22014 18.9244C1.50865 19.2129 1.89997 19.375 2.30799 19.375H17.6926C18.1006 19.375 18.4919 19.2129 18.7805 18.9244C19.069 18.6359 19.2311 18.2446 19.2311 17.8365V2.45192C19.2311 2.0439 19.069 1.65258 18.7805 1.36407C18.4919 1.07555 18.1006 0.913462 17.6926 0.913462Z" fill="#070707" />
                            </svg>
                            <span className="text-[16px] font-medium">{service.price}</span>
                        </div>
                        <div className="flex px-6 py-3 items-center gap-2.5 rounded-[80px] bg-white text-[#0D0D0D]">
                            <span className="text-[16px] font-medium">{service.telegram}</span>
                        </div>
                        <div className="flex px-6 py-3 items-center gap-3 rounded-[80px] border border-[#B3B3B3] text-[#B3B3B3]">
                            <span className="text-[16px] font-medium tracking-wide uppercase">{service.category}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex gap-16 w-full">
                    <div className="flex flex-col gap-20 flex-1">
                        <article className="flex flex-col gap-8">
                            <p className="text-[#9E9E9E] text-[20px] leading-[32px]">
                                {service.description}
                            </p>

                            <div className="flex flex-col gap-4">
                                <h2 className="text-[#FCFCFC] text-[32px] font-medium">Detailed description</h2>
                                <h3 className="text-white text-[20px]">Why choose {service.name}:</h3>
                                <ul className="flex flex-col gap-0">
                                    {service.detailedPoints.map((point, i) => (
                                        <li key={i} className="text-[#9E9E9E] text-[20px] leading-[40px]">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>

                        {/* Middle Banner Image */}
                        <div className="relative w-full h-[101px] rounded-[40px] overflow-hidden">
                            <Image src="/images/service-detail-banner.webp" alt="Service Banner" fill className="object-cover" />
                        </div>

                        {/* Promo Code Section */}
                        <div className="relative flex p-8 flex-col items-start gap-6 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] overflow-hidden group">
                            {/* Background Pattern SVG */}
                            <svg className="absolute -left-[30%] -top-[40%] opacity-40 group-hover:scale-105 transition-transform duration-1000" width="1284" height="1284" viewBox="0 0 1284 1284" fill="none">
                                <circle cx="642" cy="627" r="441" fill="url(#p0_rad)" fillOpacity="0.4" />
                                <defs>
                                    <radialGradient id="p0_rad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(642 407) rotate(90) scale(220 354)">
                                        <stop stopColor="#F29F04" stopOpacity="0.26" />
                                        <stop offset="1" stopColor="#F29F04" stopOpacity="0.5" />
                                    </radialGradient>
                                </defs>
                            </svg>

                            <div className="relative z-10 flex items-center gap-2.5 text-[#F29F04]">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.0674 4.81564L4.81737 16.0656" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <span className="text-[16px] font-medium">Promo code</span>
                            </div>

                            <div className="relative z-10 flex justify-between items-center w-full px-6 py-4 rounded-[16px] bg-[#0D0D0D]/50 border border-white/5 backdrop-blur-sm">
                                <span className="text-[32px] font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
                                    {service.promoCode}
                                </span>
                                <button className="px-6 py-2.5 rounded-[80px] bg-[#F29F04] text-[#0D0D0D] text-[16px] font-medium hover:scale-105 transition-transform active:scale-95">
                                    Copy
                                </button>
                            </div>

                            <div className="relative z-10 flex gap-2 text-[14px]">
                                <span className="text-[#F29F04] font-medium">What the promo code gives you:</span>
                                <span className="text-[#BDBDBD]">{service.promoCode} gives a {service.promoDiscount} discount on {service.promoDetail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Image */}
                    <aside className="w-[380px] sticky top-32 h-fit">
                        <div className="relative w-full h-[727px] rounded-[20px] overflow-hidden">
                            <Image src="/images/service-sidebar.webp" alt="Sidebar" fill className="object-cover" />
                        </div>
                    </aside>
                </div>

                {/* Similar Services Section */}
                <div className="flex flex-col gap-16 py-20">
                    <h2 className="text-[56px] text-center font-medium tracking-[-2.24px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
                        Similar Services
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similarServices.map((s, i) => (
                            <div key={i} className="flex p-8 flex-col gap-8 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group hover:border-[#F29F04] transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                                        {s.isSvg ? (
                                            s.logo
                                        ) : (
                                            <Image src={s.logo as string} alt={s.name} fill className="object-contain" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-[20px] font-medium">{s.name}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-white text-[14px] font-semibold">{s.price}</span>
                                            <span className="text-[#666] text-[14px] font-semibold">{s.period}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[#BDBDBD] text-[16px] leading-[26px] line-clamp-3">
                                    {s.description}
                                </p>
                            </div>
                        ))}
                        {/* Duplicate KeyProxy card as requested by design layout */}
                        <div className="flex p-8 flex-col gap-8 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group hover:border-[#F29F04] transition-all">
                            <div className="flex items-start gap-4">
                                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                                    {service.logo}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-[20px] font-medium">{service.name}</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-white text-[14px] font-semibold">10</span>
                                        <span className="text-[#666] text-[14px] font-semibold">/week</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#BDBDBD] text-[16px] leading-[26px] line-clamp-3">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default ServiceDetailPage;
