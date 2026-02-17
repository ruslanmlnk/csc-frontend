'use client';

import React from 'react';
import ForumThreadHero from '@/app/components/forum/ForumThreadHero';
import ForumThreadOriginalPost from '@/app/components/forum/ForumThreadOriginalPost';
import ForumThreadReply from '@/app/components/forum/ForumThreadReply';
import ForumPagination from '@/app/components/forum/ForumPagination';
import ForumThreadCommentInput from '@/app/components/forum/ForumThreadCommentInput';
import { useParams } from 'next/navigation';
import { forumThreadPageData } from './data';

export default function ForumThreadPage() {
    const params = useParams();

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center overflow-x-hidden">
            <div className="relative z-10 w-full flex flex-col items-center">
                <ForumThreadHero
                    title={forumThreadPageData.hero.title}
                    backLink={`/forum/${params.slug}`}
                    backText={forumThreadPageData.hero.backText}
                    addCommentLabel={forumThreadPageData.hero.addCommentLabel}
                />

                <div className="flex flex-col items-start gap-16 w-full max-w-[1280px] px-5 pb-32">
                    <div className="flex flex-col gap-4 w-full">
                        <ForumThreadOriginalPost
                            threadTitle={forumThreadPageData.originalPost.threadTitle}
                            authorName={forumThreadPageData.originalPost.authorName}
                            authorRole={forumThreadPageData.originalPost.authorRole}
                            date={forumThreadPageData.originalPost.date}
                            authorAvatar={forumThreadPageData.originalPost.authorAvatar}
                            content={forumThreadPageData.originalPost.content}
                        />

                        {forumThreadPageData.replies.map((reply, index) => (
                            <ForumThreadReply
                                key={index}
                                authorName={reply.authorName}
                                date={reply.date}
                                authorAvatar={reply.authorAvatar}
                                content={reply.content}
                            />
                        ))}
                    </div>

                    <ForumPagination
                        showingFrom={forumThreadPageData.pagination.showingFrom}
                        showingTo={forumThreadPageData.pagination.showingTo}
                        total={forumThreadPageData.pagination.total}
                        currentPage={forumThreadPageData.pagination.currentPage}
                        totalPages={forumThreadPageData.pagination.totalPages}
                        itemLabel={forumThreadPageData.pagination.itemLabel}
                        onPageChange={(page) => console.log('Page changed:', page)}
                    />

                    <ForumThreadCommentInput
                        title={forumThreadPageData.commentInput.title}
                        placeholder={forumThreadPageData.commentInput.placeholder}
                        cancelLabel={forumThreadPageData.commentInput.cancelLabel}
                        publishLabel={forumThreadPageData.commentInput.publishLabel}
                    />
                </div>
            </div>
        </main>
    );
}
