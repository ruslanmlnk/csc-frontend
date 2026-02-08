"use client";

import React from 'react';
import Image from 'next/image';

const UsefulServices: React.FC = () => {
    const services = [
        {
            name: 'KeyProxy',
            category: 'Proxy',
            description: 'KeyProxy — business-grade mobile proxies. Operating since 2017, stability is our priority!',
            logo: (
                <svg width="77" height="56" viewBox="0 0 77 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.66134 27.1377L7.35891 20.8545L18.6149 8.99365H24.6629L14.5157 19.9137L11.4917 23.1392L7.66134 27.1377ZM2.78931 32.5137V8.99365H8.19892V32.5137H2.78931ZM18.8837 32.5137L10.5173 22.2657L14.0789 18.4017L25.2341 32.5137H18.8837Z" fill="white" />
                    <path d="M48.631 8.9895H30.9468L29.4731 13.1158H47.0099L48.631 8.9895Z" fill="#253E8E" />
                    <path d="M48.631 18.5684H30.9468L29.4731 22.6947H47.0099L48.631 18.5684Z" fill="#253E8E" />
                    <path d="M48.631 28.2948H30.9468L29.4731 32.4211H47.0099L48.631 28.2948Z" fill="#253E8E" />
                    <path d="M61.6879 32.5137V22.9041L62.931 26.1968L52.5823 8.99365H58.3614L66.291 22.1985H62.9647L70.9279 8.99365H76.2703L65.9214 26.1968L67.131 22.9041V32.5137H61.6879Z" fill="white" />
                </svg>
            ),
            pricing: '$ 10/week, 28/month',
            offer: '(CLICKSTORM offers a 15% discount on...)',
            offerBrand: 'Clickstorm'
        },
        {
            name: 'Geonix',
            category: 'Proxy',
            description: 'Geonix — reliable and scalable proxies for any task. A provider focused on stability and speed.',
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
            ),
            pricing: '$ 1,65/month',
            offer: '(CSC - 15% discount on RU versions)',
            offerBrand: 'CSC'
        },
        {
            name: 'Dolphin{anty}',
            category: 'ANTI-DETECTION BROWSERS',
            description: 'Dolphin{anty} is a next-generation anti-detection browser built to simplify and protect multi-accounting.',
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
            ),
            pricing: '$ 10/month',
            offer: '',
            offerBrand: 'Dolphin'
        }
    ];

    return (
        <section className="w-full px-5 flex flex-col gap-16 bg-[#0D0D0D] max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
                <h2 className="font-['Poppins'] text-[32px] md:text-[56px] font-medium leading-tight md:leading-[72px] tracking-[-1.28px] md:tracking-[-2.24px] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#999] text-center md:text-left">
                    Useful Services
                </h2>
                <button className="flex py-[11px] px-[24px] justify-center items-center gap-[10px] rounded-[80px] border border-[#F29F04] text-[#F29F04] font-['Poppins'] text-[16px] font-medium leading-[26px] hover:bg-[#F29F04]/10 transition-all active:scale-95">
                    See More
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {services.map((service, index) => (
                    <div key={index} className="flex p-[32px] flex-col gap-[32px] rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group hover:border-[#F29F04] transition-all">
                        <div className="flex items-center w-full justify-between h-[56px]">
                            <div className="flex items-center">
                                {service.logo}
                            </div>
                            <div className="flex px-[12px] py-[6px] justify-center items-center gap-[10px] rounded-[80px] border border-[rgba(179,179,179,0.5)] text-[#B3B3B3] text-[14px] font-normal leading-[16px]">
                                {service.category}
                            </div>
                        </div>

                        <div className="flex flex-col gap-[12px] self-stretch">
                            <h3 className="text-white text-[20px] font-medium leading-[32px]">{service.name}</h3>
                            <p className="text-[#BDBDBD] text-[16px] font-normal leading-[26px]">
                                {service.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-[30px] self-stretch">
                            <div className="flex items-center gap-1 flex-wrap ml-[3px]">
                                {service.pricing.split(', ').map((part, i) => {
                                    const [amount, period] = part.split('/');
                                    return (
                                        <React.Fragment key={i}>
                                            {i > 0 && <span className="text-white text-[20px] font-semibold leading-[32px]">, </span>}
                                            <span className="text-white text-[20px] font-semibold leading-[32px]">{amount}</span>
                                            {period && (
                                                <span className="text-[#666] text-[20px] font-semibold leading-[32px]">/{period}</span>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {service.offerBrand && (
                                <div className="flex justify-between items-center gap-4 w-full">
                                    <div className="flex h-[32px] px-[12px] justify-center items-center gap-[10px] rounded-[80px] border border-[#06DF73] text-[#06DF73] text-[14px] font-normal leading-[16px] uppercase shrink-0">
                                        {service.offerBrand}
                                    </div>
                                    <span className="text-[#BDBDBD] text-[14px] font-normal leading-[16px] text-right">
                                        {service.offer || ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UsefulServices;
