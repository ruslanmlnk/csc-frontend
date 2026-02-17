import React from 'react';
import ForumThreadsColumn from './ForumThreadsColumn';
import ForumSidebar from './ForumSidebar';

const ForumContentSection: React.FC = () => {
    return (
        <div className="w-full max-w-[1280px] px-5 mx-auto flex gap-[24px] pb-[80px] justify-between">
            <ForumThreadsColumn />
            <ForumSidebar />
        </div>
    );
};

export default ForumContentSection;
