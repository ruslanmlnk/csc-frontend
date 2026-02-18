import React from 'react';
import Link from 'next/link';

export interface ForumThreadCardData {
    categoryTitle: string;
    categoryDescription: string;
    threadTitle: string;
    authorName: string;
    date: string;
    href?: string;
}

const ForumThreadCard: React.FC<ForumThreadCardData> = ({
    categoryTitle,
    categoryDescription,
    threadTitle,
    authorName,
    date,
    href,
}) => {
    const card = (
        <div className="bg-[#1A1A1A] border border-[rgba(74,74,74,0.70)] rounded-[40px] p-6 flex flex-col gap-6 min-h-[199px] lg:min-h-0 lg:p-[23.2px]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-[50px] h-[50px] rounded-[14.286px] bg-[#F29F04] flex items-center justify-center p-[12.5px] lg:w-[64px] lg:h-[64px] lg:rounded-[18.286px] lg:p-4">
                        <svg className="w-[25px] h-[25px] lg:w-8 lg:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3C9.27125 3 4 6.075 4 10V22C4 25.925 9.27125 29 16 29C22.7288 29 28 25.925 28 22V10C28 6.075 22.7288 3 16 3ZM26 16C26 17.2025 25.015 18.4288 23.2987 19.365C21.3662 20.4188 18.7738 21 16 21C13.2262 21 10.6337 20.4188 8.70125 19.365C6.985 18.4288 6 17.2025 6 16V13.92C8.1325 15.795 11.7787 17 16 17C20.2213 17 23.8675 15.79 26 13.92V16ZM8.70125 6.635C10.6337 5.58125 13.2262 5 16 5C18.7738 5 21.3662 5.58125 23.2987 6.635C25.015 7.57125 26 8.7975 26 10C26 11.2025 25.015 12.4288 23.2987 13.365C21.3662 14.4187 18.7738 15 16 15C13.2262 15 10.6337 14.4187 8.70125 13.365C6.985 12.4288 6 11.2025 6 10C6 8.7975 6.985 7.57125 8.70125 6.635ZM23.2987 25.365C21.3662 26.4188 18.7738 27 16 27C13.2262 27 10.6337 26.4188 8.70125 25.365C6.985 24.4287 6 23.2025 6 22V19.92C8.1325 21.795 11.7787 23 16 23C20.2213 23 23.8675 21.79 26 19.92V22C26 23.2025 25.015 24.4287 23.2987 25.365Z" fill="#212121" />
                        </svg>
                    </div>

                    <div className="flex flex-col items-start gap-[5px]">
                        <h3 className="text-white text-[16px] lg:text-[20px] font-medium leading-[26px] lg:leading-[32px]">
                            {categoryTitle}
                        </h3>
                        <span className="text-[#6C6C6C] text-[14px] lg:text-[16px] font-normal leading-[16px]">
                            {categoryDescription}
                        </span>
                    </div>
                </div>

                <div className="w-full border-t border-white/20 pt-5 flex flex-col gap-[5px] lg:w-auto lg:pt-0 lg:pl-5 lg:border-t-0 lg:border-l lg:gap-[10px]">
                    <h4 className="text-[16px] font-normal leading-[26px] lg:leading-[32px] text-white line-clamp-1 w-[140px] text-ellipsis text-left">
                        {threadTitle}
                    </h4>
                    <div className="flex items-center gap-[10px] text-[#6C6C6C] text-[16px] font-normal leading-[26px] lg:leading-[16px]">
                        <span className="line-clamp-1 w-[100px] text-ellipsis">{authorName}</span>
                        <div className="w-[4px] h-[4px] bg-[#6C6C6C] rounded-full" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!href) {
        return card;
    }

    return (
        <Link href={href} className="block">
            {card}
        </Link>
    );
};

export default ForumThreadCard;
