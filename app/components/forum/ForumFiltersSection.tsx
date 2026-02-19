import React from 'react';
import Image from 'next/image';

interface ForumFiltersSectionProps {
    searchPlaceholder: string;
    searchButtonLabel: string;
    bannerImage: string;
    bannerAlt?: string;
    bannerHref?: string;
}

const ForumFiltersSection: React.FC<ForumFiltersSectionProps> = ({
    searchPlaceholder,
    searchButtonLabel,
    bannerImage,
    bannerAlt = 'Community Banner',
    bannerHref,
}) => {
    const normalizedHref = bannerHref?.trim();
    const isExternalLink = Boolean(normalizedHref && /^https?:\/\//i.test(normalizedHref));
    const bannerClassName = "hidden lg:block relative w-full h-[158px] rounded-[40px] overflow-hidden";
    const bannerImageContent = (
        <Image
            src={bannerImage}
            alt={bannerAlt}
            fill
            className="object-cover"
        />
    );

    return (
        <div className="w-full max-w-[1280px] px-5 flex flex-col items-center gap-[64px] mb-[64px]">
            {normalizedHref ? (
                <a
                    href={normalizedHref}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noopener noreferrer" : undefined}
                    aria-label={bannerAlt}
                    className={bannerClassName}
                >
                    {bannerImageContent}
                </a>
            ) : (
                <div className={bannerClassName}>
                    {bannerImageContent}
                </div>
            )}

            <div className="w-full flex flex-col gap-[32px]">
                <div className="w-full flex flex-col gap-[10px] lg:grid lg:grid-cols-6 lg:gap-[10px]">

                    <div className="h-[46px] lg:h-[58px] min-w-0 flex items-center gap-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-[24px] lg:p-[8px] lg:pr-[16px] lg:col-span-4">
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

                    <div className="min-w-0 flex flex-col gap-[10px] lg:h-[58px] lg:col-span-2">
                        <button className="h-[50px] lg:h-full w-full inline-flex items-center justify-center gap-[12px] bg-[#F29F04] text-[#0D0D0D] rounded-[80px] px-[24px] font-medium text-[16px] leading-[26px] hover:brightness-110 transition-all">
                            {searchButtonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumFiltersSection;
