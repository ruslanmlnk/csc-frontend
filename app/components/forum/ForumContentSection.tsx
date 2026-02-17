import React from 'react';
import ForumThreadsColumn from './ForumThreadsColumn';
import ForumSidebar from './ForumSidebar';

const ForumContentSection: React.FC = () => {
    return (
        <div className="w-full max-w-[1440px] px-[100px] flex gap-[24px] pb-[100px] justify-between">
            <ForumThreadsColumn />
            <ForumSidebar />
        </div>
    );
};

export default ForumContentSection;
