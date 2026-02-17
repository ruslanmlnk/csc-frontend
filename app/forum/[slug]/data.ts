const threadTemplate = {
    title: 'News and announcements',
    description: 'We read, delve into, discuss',
    authorName: 'ClickStorm',
    date: 'Mar 10, 2025',
    replyCount: 12,
    authorAvatar:
        'https://api.builder.io/api/v1/image/assets/TEMP/0b8497efb69f83a43046090b90fab29f59b439f2?width=136',
};

export const forumCategoryPageData = {
    hero: {
        title: 'News and announcements',
        subtitle: 'All threads in this category',
        backLink: '/forum',
        backText: 'Back to Forum',
        backgroundImage:
            'https://api.builder.io/api/v1/image/assets/TEMP/320fdcece1f77a65a87ca9821ec5eac14d2d2e21?width=1545',
    },
    threads: Array.from({ length: 4 }, () => ({ ...threadTemplate })),
    pagination: {
        showingFrom: 1,
        showingTo: 12,
        total: 73,
        currentPage: 1,
        totalPages: 3,
        itemLabel: 'threads',
    },
};
