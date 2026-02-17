'use client';

import React from 'react';
import ForumHero from '@/app/components/forum/ForumHero';
import ForumFiltersSection from '@/app/components/forum/ForumFiltersSection';
import ForumContentSection from '@/app/components/forum/ForumContentSection';
import { forumPageData } from './data';

const ForumPage = () => {
    const title = forumPageData.hero.titleLines.map((line, index) => (
        <React.Fragment key={`${line}-${index}`}>
            {index > 0 && <br />}
            {line}
        </React.Fragment>
    ));

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden relative">
            <ForumHero
                title={title}
                description={forumPageData.hero.description}
            />

            <div className="relative z-10 flex flex-col items-center">
                <ForumFiltersSection
                    categories={forumPageData.filters.categories}
                    activeCategory={forumPageData.filters.activeCategory}
                    searchPlaceholder={forumPageData.filters.searchPlaceholder}
                    searchButtonLabel={forumPageData.filters.searchButtonLabel}
                    createThreadLabel={forumPageData.filters.createThreadLabel}
                    mobileCategoryLabel={forumPageData.filters.mobileCategoryLabel}
                    bannerImage={forumPageData.filters.bannerImage}
                    bannerAlt={forumPageData.filters.bannerAlt}
                />
                <ForumContentSection
                    sections={forumPageData.content.sections}
                    sidebar={forumPageData.content.sidebar}
                />
            </div>
        </main>
    );
};

export default ForumPage;
