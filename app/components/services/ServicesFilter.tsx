import React, { useState } from 'react';

interface ServicesFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const ServicesFilter: React.FC<ServicesFilterProps> = ({
    categories,
    activeCategory,
    onCategoryChange,
}) => {
    return (
        <div className="flex p-[7.2px] items-start gap-4 rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] max-w-full overflow-x-auto no-scrollbar">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`flex px-4 py-2 justify-center items-center gap-4 rounded-[80px] transition-all whitespace-nowrap ${activeCategory === category
                            ? 'bg-[#F29F04] text-[#070707] font-medium'
                            : 'text-[#FCFCFC] font-normal hover:text-[#F29F04]'
                        }`}
                >
                    <span className="font-poppins text-[16px] leading-[26px]">
                        {category}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ServicesFilter;
