import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BlogPagination: React.FC = () => {
    return (
        <div className="w-full h-[122px] flex flex-row items-center justify-between px-5 py-8 rounded-[40px] border-2 border-[rgba(74,74,74,0.7)] bg-[#1A1A1A]">
            <span className="text-[#A5A5A5] text-[24px] leading-8 font-poppins">Showing 1-12 of 73 articles</span>
            <div className="flex items-center gap-[10px]">
                <button className="w-[48px] h-[58px] flex items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] text-[#A5A5A5]">
                    <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-[5px]">
                    <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-radial-gradient from-white/30 to-transparent bg-[#F29F04] text-[#070707] font-medium text-[24px] font-poppins">1</button>
                    <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] text-[#A5A5A5] font-medium text-[24px] font-poppins">2</button>
                    <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full border-2 border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] text-[#A5A5A5] font-medium text-[24px] font-poppins">3</button>
                </div>
                <button className="w-[48px] h-[58px] flex items-center justify-center rounded-[20px] border-2 border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] text-[#A5A5A5]">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default BlogPagination;
