import React from 'react';
import ForumThreadCard from './ForumThreadCard';

type ForumCategorySectionProps = {
    title: string;
    itemsCount: number;
    className?: string;
};

const ForumCategorySection: React.FC<ForumCategorySectionProps> = ({
    title,
    itemsCount,
    className = ''
}) => {
    return (
        <div className={`flex flex-col gap-[24px] ${className}`.trim()}>
            <div className="relative">
                <div className="w-full h-[58px] bg-[#F29F04] rounded-[80px] flex items-center px-[24px] text-[#0D0D0D] font-medium text-[16px]">
                    {title}
                </div>
                <div className="absolute left-[27px] top-[58px]">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L1.04907e-06 0L15.9882 1.39773e-06L9.5929 11.0769Z" fill="#F29F04" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-col gap-[16px]">
                {Array.from({ length: itemsCount }).map((_, index) => (
                    <ForumThreadCard key={`${title}-${index}`} />
                ))}
            </div>
        </div>
    );
};

export default ForumCategorySection;
