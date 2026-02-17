import React from 'react';
import ForumThreadsColumn from './ForumThreadsColumn';
import ForumSidebar from './ForumSidebar';

const ForumContentSection: React.FC = () => {
    return (
        <div className="w-full max-w-[1280px] px-5 mx-auto flex flex-col lg:flex-row gap-[24px] pb-[80px]">
            <div className="order-1 lg:order-2">
                <ForumSidebar />
            </div>
            <div className="order-2 lg:order-1 flex-1 min-w-0">
                <ForumThreadsColumn />
            </div>
        </div>
    );
};

export default ForumContentSection;
