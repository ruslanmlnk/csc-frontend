"use client";

import React, { useState } from 'react';
import BlogHero from '../components/blog/BlogHero';
import Banner from '../components/Banner';
import BlogFilters from '../components/blog/BlogFilters';
import BlogGrid from '../components/blog/BlogGrid';
import BlogPagination from '../components/blog/BlogPagination';
import BlogCTA from '../components/blog/BlogCTA';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        'All Articles',
        'Agency accounts',
        'Google',
        'Facebook',
        'Case studies',
        'Gembla',
        'Interviews',
        'TikTok',
        'Inside industry'
    ];

    const blogPosts = [
        {
            id: 1,
            date: 'Mar 10, 2025',
            category: 'Security',
            title: 'Crypto Security: How to Keep Your Funds Safe',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/25870df7da2681df4539f16fd658fcd3811170fd?width=731'
        },
        {
            id: 2,
            date: 'Feb 20, 2025',
            category: 'Crypto Basics',
            title: 'How to Quickly Understand Cryptocurrency Basics',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/bcd2e2fa6ad8b199020eb2c3d86576da0bbf1f9e?width=731'
        },
        {
            id: 3,
            date: 'Jan 01, 2025',
            category: 'Trends',
            title: 'Exploring the Great Future of Cryptocurrency',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/15a2a2484d10382d64b79afa6817937e3ddf9321?width=731'
        },
        {
            id: 4,
            date: 'Dec 30, 2024',
            category: 'Technology',
            title: "Smart Contracts Explained: A Beginner's Guide",
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/997ada71185198b21aba1de2512487685d221978?width=731'
        }
    ];

    const extraPosts = [
        {
            id: 5,
            date: 'Dec 10, 2024',
            category: 'Trends & Innovations',
            title: 'Exploring the Future of Cryptocurrency',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/acb4a5c61b48a8d13e8e19296ac21c92596c1b8c?width=731',
            active: true
        },
        {
            id: 6,
            date: 'Mar 10, 2025',
            category: 'Security',
            title: 'Crypto Security: How to Keep Your Funds Safe',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/6bc1f6f0e25e1e183b3579f29c04bfc7300c8cc3?width=731'
        },
        {
            id: 7,
            date: 'Feb 20, 2025',
            category: 'Crypto Basics',
            title: 'How to Quickly Understand Cryptocurrency Basics',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/bcd2e2fa6ad8b199020eb2c3d86576da0bbf1f9e?width=731'
        },
        {
            id: 8,
            date: 'Jan 01, 2025',
            category: 'Trends',
            title: 'Exploring the Great Future of Cryptocurrency',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/15a2a2484d10382d64b79afa6817937e3ddf9321?width=731'
        },
        {
            id: 9,
            date: 'Dec 30, 2024',
            category: 'Technology',
            title: "Smart Contracts Explained: A Beginner's Guide",
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/37e30fc05c3fa150a87c041f925e464af3cc912e?width=731'
        },
        {
            id: 10,
            date: 'Dec 10, 2024',
            category: 'Trends & Innovations',
            title: 'Exploring the Future of Cryptocurrency',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/ad30794f1ecfb25b0164e3cd06af425cc92fa108?width=731',
            active: true
        },
        {
            id: 11,
            date: 'Nov 21, 2024',
            category: 'Market Insight',
            title: 'Top 10 Cryptocurrencies to Watch in 2025',
            image: 'https://api.builder.io/api/v1/image/assets/TEMP/bcdb9514e46e8d779579e5c39ff48844bc6af238?width=731'
        }
    ];

    return (
        <div className="relative flex flex-col items-start bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black">
            <BlogHero
                title="Inside performance marketing"
                description="Real cases, deep insights, and hands-on experience from live traffic, affiliate campaigns, and performance-driven strategies"
            />

            <main className="w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-[64px] pb-[120px]">
                <Banner
                    src="https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480"
                    alt="Promo Banner"
                />

                <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <BlogGrid
                    blogPosts={blogPosts}
                    extraPosts={extraPosts}
                />

                <BlogPagination />
            </main>

            <BlogCTA />
        </div>
    );
};

export default BlogPage;
