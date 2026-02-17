import React from 'react';
import ForumCategorySection from './ForumCategorySection';

const ForumThreadsColumn: React.FC = () => {
    return (
        <div className="flex flex-col gap-[24px] flex-1">
            <ForumCategorySection title="Welcome to SCS Agency" itemsCount={3} />
            <ForumCategorySection title="Free communication" itemsCount={3} />
            <ForumCategorySection title="Welcome to SCS Agency" itemsCount={3} />
        </div>
    );
};

export default ForumThreadsColumn;
