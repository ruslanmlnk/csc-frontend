const responseTemplate = {
    authorName: 'ClickStorm',
    date: 'Mar 10, 2025',
    authorAvatar:
        'https://api.builder.io/api/v1/image/assets/TEMP/974cdc90970800c6b446feb25a9442947437fafe?width=96',
    content:
        'Good evening!\nTomorrow, November 22, at 10 a.m. (server time), payments will be available on Payeer.',
};

export const forumThreadPageData = {
    hero: {
        title: 'News and announcements',
        backText: 'Back',
        addCommentLabel: 'Add a comment',
    },
    originalPost: {
        threadTitle: 'Payments on Payeer',
        authorName: 'ClickStorm',
        authorRole: 'Author',
        date: 'Mar 10, 2025',
        authorAvatar:
            'https://api.builder.io/api/v1/image/assets/TEMP/b1e32d00ed1395d8438e71e8e58f4ded16fa25c0?width=96',
        content:
            'Good evening!\nTomorrow, November 22, at 10 a.m. (server time), payments will be available on Payeer.',
    },
    replies: Array.from({ length: 3 }, () => ({ ...responseTemplate })),
    pagination: {
        showingFrom: 1,
        showingTo: 6,
        total: 73,
        currentPage: 1,
        totalPages: 3,
        itemLabel: 'responses',
    },
    commentInput: {
        title: 'New comment',
        placeholder: 'Enter your comment...',
        cancelLabel: 'Cancel',
        publishLabel: 'Publish',
    },
};
