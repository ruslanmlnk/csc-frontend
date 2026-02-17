'use client';

import React from 'react';
import ForumCategoryHero from '@/app/components/forum/ForumCategoryHero';
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard';
import ForumPagination from '@/app/components/forum/ForumPagination';
import { useParams } from 'next/navigation';

export default function ForumCategoryPage() {
    const params = useParams();
    // In a real app, uses params.slug to fetch data. 
    // For now, we use static data matching the Figma design.

    const threads = Array(4).fill({
        title: "News and announcements",
        authorName: "ClickStorm",
        date: "Mar 10, 2025",
        replyCount: 12,
        authorAvatar: "https://api.builder.io/api/v1/image/assets/TEMP/0b8497efb69f83a43046090b90fab29f59b439f2?width=136"
    });

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center">
            <ForumCategoryHero
                title="News and announcements"
                subtitle="All threads in this category"
                backLink="/forum"
                backText="Back to Forum"
                backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/320fdcece1f77a65a87ca9821ec5eac14d2d2e21?width=1545"
            />

            <div className="flex flex-col items-center w-full max-w-[1280px] px-5 gap-16 pb-20">
                <div className="flex flex-col gap-4 w-full">
                    {threads.map((thread, index) => (
                        <ForumCategoryThreadCard
                            key={index}
                            title={thread.title}
                            authorName={thread.authorName}
                            date={thread.date}
                            replyCount={thread.replyCount}
                            authorAvatar={thread.authorAvatar}
                        />
                    ))}
                </div>

                <ForumPagination
                    showingFrom={1}
                    showingTo={12}
                    total={73}
                    currentPage={1}
                    totalPages={3}
                    onPageChange={(page) => console.log('Page changed to:', page)}
                />
            </div>
        </main>
    );
}
