import React from 'react';
import Image from 'next/image';

interface ForumFiltersSectionProps {
    categories: string[];
    activeCategory: string;
    searchPlaceholder: string;
    searchButtonLabel: string;
    createThreadLabel: string;
    mobileCategoryLabel?: string;
    bannerImage: string;
    bannerAlt?: string;
}

const ForumFiltersSection: React.FC<ForumFiltersSectionProps> = ({
    categories,
    activeCategory,
    searchPlaceholder,
    searchButtonLabel,
    createThreadLabel,
    mobileCategoryLabel,
    bannerImage,
    bannerAlt = 'Community Banner',
}) => {
    const currentMobileCategory = mobileCategoryLabel ?? activeCategory ?? categories[0] ?? '';

    return (
        <div className="w-full max-w-[1280px] px-5 flex flex-col items-center gap-[64px] mb-[64px]">
            <div className="hidden lg:block relative w-full h-[158px] rounded-[40px] overflow-hidden">
                <Image
                    src={bannerImage}
                    alt={bannerAlt}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="w-full flex flex-col gap-[32px]">
                <div className="w-full flex flex-col gap-[10px] lg:grid lg:grid-cols-3 lg:gap-[10px]">
                    <div className="hidden lg:flex h-[58px] min-w-0 items-center gap-[16px] bg-[#1A1A1A] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] p-[8px] pr-[16px]">
                        {categories.map((filter) => (
                            <button
                                key={filter}
                                className={`shrink-0 px-[16px] py-[8px] rounded-[80px] text-[16px] leading-[26px] transition-colors ${
                                    filter === activeCategory
                                        ? 'bg-[#F29F04] text-[#070707] font-medium'
                                        : 'text-[#FCFCFC] font-normal hover:bg-white/5'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="h-[46px] lg:h-[58px] min-w-0 flex items-center gap-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-[24px] lg:p-[8px] lg:pr-[16px]">
                        <div className="w-full flex items-center gap-[10px] lg:rounded-[80px] lg:px-[16px] lg:py-[8px]">
                            <svg className="w-[22px] h-[22px] lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.5299 20.4693L16.8358 15.7762C18.1963 14.1428 18.8748 12.0478 18.73 9.92691C18.5852 7.80604 17.6283 5.82265 16.0584 4.38932C14.4885 2.95599 12.4264 2.18308 10.3012 2.23138C8.1759 2.27968 6.15108 3.14547 4.64791 4.64864C3.14474 6.15181 2.27895 8.17663 2.23065 10.3019C2.18235 12.4271 2.95526 14.4892 4.38859 16.0591C5.82191 17.629 7.80531 18.5859 9.92618 18.7307C12.047 18.8755 14.1421 18.1971 15.7755 16.8365L20.4686 21.5306C20.5383 21.6003 20.621 21.6556 20.7121 21.6933C20.8031 21.731 20.9007 21.7504 20.9992 21.7504C21.0978 21.7504 21.1954 21.731 21.2864 21.6933C21.3775 21.6556 21.4602 21.6003 21.5299 21.5306C21.5995 21.4609 21.6548 21.3782 21.6925 21.2871C21.7302 21.1961 21.7497 21.0985 21.7497 21C21.7497 20.9014 21.7302 20.8038 21.6925 20.7128C21.6548 20.6218 21.5995 20.539 21.5299 20.4693ZM3.74924 10.5C3.74924 9.16495 4.14512 7.8599 4.88682 6.74987C5.62852 5.63984 6.68272 4.77467 7.91612 4.26378C9.14953 3.75289 10.5067 3.61922 11.8161 3.87967C13.1255 4.14012 14.3282 4.78299 15.2722 5.727C16.2162 6.671 16.8591 7.87374 17.1195 9.18311C17.38 10.4925 17.2463 11.8497 16.7354 13.0831C16.2245 14.3165 15.3594 15.3707 14.2493 16.1124C13.1393 16.8541 11.8343 17.25 10.4992 17.25C8.70964 17.248 6.9939 16.5362 5.72846 15.2708C4.46302 14.0053 3.75122 12.2896 3.74924 10.5Z" fill="#9E9E9E" />
                            </svg>
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="bg-transparent border-none outline-none text-white placeholder-white w-full font-poppins text-[16px] leading-[26px] font-normal lg:font-medium"
                            />
                        </div>
                    </div>

                    <div className="min-w-0 flex flex-col gap-[10px] lg:h-[58px] lg:grid lg:grid-cols-2 lg:gap-[10px]">
                        <button className="h-[50px] lg:h-full w-full inline-flex items-center justify-center gap-[12px] bg-[#F29F04] text-[#0D0D0D] rounded-[80px] px-[24px] font-medium text-[16px] leading-[26px] hover:brightness-110 transition-all">
                            {searchButtonLabel}
                        </button>
                        <button className="h-[50px] lg:h-full w-full inline-flex items-center justify-center gap-[12px] lg:gap-[5px] border border-[#FCC660] text-[#FCC660] rounded-[80px] px-[24px] font-medium text-[16px] leading-[26px] whitespace-nowrap hover:bg-[#FCC660]/10 transition-all">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H12.75V20.25C12.75 20.4489 12.671 20.6397 12.5303 20.7803C12.3897 20.921 12.1989 21 12 21C11.8011 21 11.6103 20.921 11.4697 20.7803C11.329 20.6397 11.25 20.4489 11.25 20.25V12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H11.25V3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3C12.1989 3 12.3897 3.07902 12.5303 3.21967C12.671 3.36032 12.75 3.55109 12.75 3.75V11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12Z" fill="#FCC660" />
                            </svg>
                            {createThreadLabel}
                        </button>
                    </div>
                </div>

                <button className="h-[46px] w-full lg:hidden flex items-center justify-between rounded-[80px] border border-[#FCC660] px-[24px] text-[#FCC660] font-normal text-[16px] leading-[26px]">
                    <span>{currentMobileCategory}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6673 6L8.00065 10.6667L3.33398 6" stroke="#FCC660" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ForumFiltersSection;
