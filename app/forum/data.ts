import type { ForumThreadsColumnSection } from '@/app/components/forum/ForumThreadsColumn';
import type { ForumSidebarThread } from '@/app/components/forum/ForumSidebar';

const threadCardTemplate = {
    categoryTitle: 'News and announcements',
    categoryDescription: 'We read, delve into, discuss',
    threadTitle: 'News and announcements',
    authorName: 'ClickStorm',
    date: 'Mar 10, 2025',
};

const createThreads = (count: number) =>
    Array.from({ length: count }, () => ({ ...threadCardTemplate }));

const popularThreads: ForumSidebarThread[] = [
    {
        title: 'Can you recommend where to watch videos on learning TikTok UBT?',
        authorName: 'ClickStorm',
        date: 'Mar 10, 2025',
    },
    {
        title: 'Best beginner setup for Keitaro tracking in 2025',
        authorName: 'AdWave',
        date: 'Mar 08, 2025',
    },
    {
        title: 'How to avoid account bans while scaling Facebook ads?',
        authorName: 'TrafficPilot',
        date: 'Mar 06, 2025',
    },
];

const sections: ForumThreadsColumnSection[] = [
    {
        title: 'Welcome to SCS Agency',
        threads: createThreads(3),
    },
    {
        title: 'Free communication',
        threads: createThreads(3),
    },
    {
        title: 'Welcome to SCS Agency',
        threads: createThreads(3),
    },
];

export const forumPageData = {
    hero: {
        titleLines: ['Community', 'discussions'],
        description:
            'A space to share experience, ask questions, and discuss traffic sources, platforms, strategies, and real-world affiliate cases',
    },
    filters: {
        categories: ['All', 'Facebook', 'Keitaro', 'TikTok'],
        activeCategory: 'All',
        searchPlaceholder: 'Search thread',
        searchButtonLabel: 'Search',
        createThreadLabel: 'Create a thread',
        mobileCategoryLabel: 'All',
        bannerImage:
            'https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480',
        bannerAlt: 'Community Banner',
    },
    content: {
        sections,
        sidebar: {
            title: 'Popular threads',
            popularThreads,
            bannerImage:
                'https://api.builder.io/api/v1/image/assets/TEMP/1df77007f20fb9ad313a0326ef07f148489cc4a4?width=794',
            bannerAlt: 'Advertisement',
        },
    },
};
