"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const LatestPosts: React.FC = () => {
    const categories = ['All Articles', 'Agency accounts', 'Google', 'Facebook', 'Case studies', 'Gembla', 'Interviews', 'TikTok', 'Inside industry'];
    const [activeCategory, setActiveCategory] = useState('All Articles');

    const posts = [
        {
            title: 'Crypto Security: How to Keep Your Funds Safe',
            date: 'Mar 10, 2025',
            category: 'Security',
            image: '/images/blog-post-1.png'
        },
        {
            title: 'How to Quickly Understand Cryptocurrency Basics',
            date: 'Feb 20, 2025',
            category: 'Crypto Basics',
            image: '/images/blog-post-2.png'
        },
        {
            title: 'Exploring the Great Future of Cryptocurrency',
            date: 'Jan 01, 2025',
            category: 'Trends',
            image: '/images/blog-post-3.png'
        }
    ];

    const filteredPosts = activeCategory === 'All Articles'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <section className="w-full py-[120px] px-5 flex flex-col items-center max-w-[1280px] mx-auto overflow-hidden">

            <h2 className="text-center font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)]">
                Latest Post
            </h2>

            {/* Categories Filter */}
            <div className="flex items-center justify-start lg:justify-center gap-[16px] p-[8px] pr-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] w-full mt-7">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-[16px] py-[8px] rounded-[80px] text-[16px] font-medium leading-[26px] transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                            ? 'bg-[#F29F04] text-[#070707]'
                            : 'text-[#FCFCFC] font-normal hover:bg-white/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full max-w-[1240px] mt-16">
                {filteredPosts.map((post, index) => (
                    <div key={index} className="flex flex-col items-start gap-[24px] p-[16px] pb-[32px] rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] group cursor-pointer transition-all duration-300 hover:border-[#FCC660]">
                        <div className="relative h-[300px] w-full rounded-[20px] overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="flex flex-col items-start gap-[16px] w-full px-[16px]">
                            <div className="w-full text-right text-[#BDBDBD] font-poppins text-[16px] leading-[26px] pr-5">
                                {post.date}
                            </div>

                            <div className="flex flex-col items-start gap-[12px] w-full">
                                <div className="px-[12px] py-[4px] rounded-[80px] border-[0.5px] border-[#FCC660] text-[#FCC660] text-[14px] leading-[16px]">
                                    {post.category}
                                </div>
                                <h3 className="text-white font-poppins text-[20px] font-medium leading-[32px] group-hover:text-[#FCC660] transition-colors">
                                    {post.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* See More Button */}
            <button className="flex mt-16 justify-center items-center px-[24px] py-[11px] gap-[16px] rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] transition-all hover:bg-[#FCC660]/10 active:scale-95">
                See More Posts
            </button>

            {/* Bottom Banner Image */}
            <div className="w-full max-w-[1240px] mt-16">
                <div className="relative w-full aspect-[675/86] rounded-[40px] overflow-hidden">
                    <Image
                        src="/images/latest-posts-bottom-banner.png"
                        alt="Join Us Banner"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default LatestPosts;
