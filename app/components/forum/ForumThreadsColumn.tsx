import React from 'react';
import ForumCategorySection from './ForumCategorySection';
import type { ForumThreadCardData } from './ForumThreadCard';

export interface ForumThreadsColumnSection {
    title: string;
    threads: ForumThreadCardData[];
    className?: string;
}

interface ForumThreadsColumnProps {
    sections: ForumThreadsColumnSection[];
}

const ForumThreadsColumn: React.FC<ForumThreadsColumnProps> = ({ sections }) => {
    return (
        <div className="flex flex-col gap-[24px] flex-1">
            {sections.map((section, index) => (
                <ForumCategorySection
                    key={`${section.title}-${index}`}
                    title={section.title}
                    threads={section.threads}
                    className={section.className}
                />
            ))}
        </div>
    );
};

export default ForumThreadsColumn;
