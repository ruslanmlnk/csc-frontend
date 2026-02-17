import React from 'react';
import ForumThreadsColumn from './ForumThreadsColumn';
import ForumSidebar from './ForumSidebar';
import type { ForumThreadsColumnSection } from './ForumThreadsColumn';
import type { ForumSidebarThread } from './ForumSidebar';

interface ForumContentSectionProps {
    sections: ForumThreadsColumnSection[];
    sidebar: {
        title: string;
        popularThreads: ForumSidebarThread[];
        bannerImage: string;
        bannerAlt?: string;
    };
}

const ForumContentSection: React.FC<ForumContentSectionProps> = ({ sections, sidebar }) => {
    return (
        <div className="w-full max-w-[1280px] px-5 mx-auto flex flex-col lg:flex-row gap-[24px] pb-[80px]">
            <div className="order-1 lg:order-2">
                <ForumSidebar
                    title={sidebar.title}
                    popularThreads={sidebar.popularThreads}
                    bannerImage={sidebar.bannerImage}
                    bannerAlt={sidebar.bannerAlt}
                />
            </div>
            <div className="order-2 lg:order-1 flex-1 min-w-0">
                <ForumThreadsColumn sections={sections} />
            </div>
        </div>
    );
};

export default ForumContentSection;
