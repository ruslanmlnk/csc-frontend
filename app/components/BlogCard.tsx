"use client";

import React from 'react';
import Image from 'next/image';

interface BlogCardProps {
    post: {
        id?: number | string;
        date: string;
        category: string;
        title: string;
        image: string;
        active?: boolean;
    };
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    return (
        <div className={`flex flex-col p-4 pb-8 gap-6 rounded-[40px] flex-1 border ${post.active ? 'border-2 border-[rgba(242,159,4,0.7)] bg-[#0D0D0D]' : 'border-[rgba(74,74,74,0.7)] bg-[#1A1A1A]'} transition-all duration-300 group cursor-pointer hover:border-[#FCC660]`}>
            <div className={`relative w-full h-[300px] rounded-[40px] overflow-hidden border ${post.active ? 'border-none' : 'border-[rgba(74,74,74,0.7)]'}`}>
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="flex flex-col gap-4 px-4">
                <span className="text-[#BDBDBD] text-[16px] leading-[26px] text-right font-poppins">{post.date}</span>
                <div className="flex flex-col gap-3 items-start">
                    <div className="px-3 py-1 rounded-[80px] border-[0.5px] border-[#FCC660] text-[#FCC660] text-[14px] leading-[16px] font-poppins">
                        {post.category}
                    </div>
                    <h3 className="text-white text-[20px] font-medium leading-[32px] font-poppins group-hover:text-[#FCC660] transition-colors">
                        {post.title}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
