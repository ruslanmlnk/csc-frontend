'use client';

import React from 'react';
import ForumHero from '@/app/components/forum/ForumHero';
import ForumFiltersSection from '@/app/components/forum/ForumFiltersSection';
import ForumContentSection from '@/app/components/forum/ForumContentSection';

const ForumPage = () => {
    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden relative">
            <ForumHero
                title={
                    <>
                        Community
                        <br />
                        discussions
                    </>
                }
                description="A space to share experience, ask questions, and discuss traffic sources, platforms, strategies, and real-world affiliate cases"
            />

            <div className="relative z-10 flex flex-col items-center">
                <ForumFiltersSection />
                <ForumContentSection />
            </div>
        </main>
    );
};

export default ForumPage;
