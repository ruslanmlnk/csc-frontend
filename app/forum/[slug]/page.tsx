'use client';

import React from 'react';
import ForumCategoryHero from '@/app/components/forum/ForumCategoryHero';
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard';
import ForumPagination from '@/app/components/forum/ForumPagination';
import { forumCategoryPageData } from './data';

export default function ForumCategoryPage() {
    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center">
            <ForumCategoryHero
                title={forumCategoryPageData.hero.title}
                subtitle={forumCategoryPageData.hero.subtitle}
                backLink={forumCategoryPageData.hero.backLink}
                backText={forumCategoryPageData.hero.backText}
                backgroundImage={forumCategoryPageData.hero.backgroundImage}
            />

            <div className="flex flex-col items-center w-full max-w-[1280px] px-5 gap-16 pb-20">
                <div className="flex flex-col gap-4 w-full">
                    {forumCategoryPageData.threads.map((thread, index) => (
                        <ForumCategoryThreadCard
                            key={index}
                            title={thread.title}
                            description={thread.description}
                            authorName={thread.authorName}
                            date={thread.date}
                            replyCount={thread.replyCount}
                            authorAvatar={thread.authorAvatar}
                        />
                    ))}
                </div>

                <ForumPagination
                    showingFrom={forumCategoryPageData.pagination.showingFrom}
                    showingTo={forumCategoryPageData.pagination.showingTo}
                    total={forumCategoryPageData.pagination.total}
                    currentPage={forumCategoryPageData.pagination.currentPage}
                    totalPages={forumCategoryPageData.pagination.totalPages}
                    itemLabel={forumCategoryPageData.pagination.itemLabel}
                    onPageChange={(page) => console.log('Page changed to:', page)}
                />
            </div>
        </main>
    );
}
