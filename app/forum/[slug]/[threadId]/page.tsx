'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ForumThreadHero from '@/app/components/forum/ForumThreadHero';
import ForumThreadOriginalPost from '@/app/components/forum/ForumThreadOriginalPost';
import ForumThreadReply from '@/app/components/forum/ForumThreadReply';
import ForumPagination from '@/app/components/forum/ForumPagination';
import ForumThreadCommentInput from '@/app/components/forum/ForumThreadCommentInput';
import { useParams, useRouter } from 'next/navigation';
import { forumThreadPageData } from './data';

type UnknownRecord = Record<string, unknown>;

const DEFAULT_AVATAR = '/logo.svg';
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const asRecord = (value: unknown): UnknownRecord | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }

    return value as UnknownRecord;
};

const asString = (value: unknown): string | null => {
    if (typeof value === 'string' && value.trim()) {
        return value;
    }

    if (typeof value === 'number') {
        return String(value);
    }

    return null;
};

const toEntityId = (value: unknown): string | null => {
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    const objectValue = asRecord(value);
    if (!objectValue) {
        return null;
    }

    const id = objectValue.id;
    if (typeof id === 'string' || typeof id === 'number') {
        return String(id);
    }

    return null;
};

const toPublicProfileHref = (value: unknown): string | null => {
    const id = toEntityId(value);
    if (!id) {
        return null;
    }

    return `/profile/${encodeURIComponent(id)}`;
};

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
    if (!url) {
        return null;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    const normalizedBase = BACKEND_BASE_URL.endsWith('/')
        ? BACKEND_BASE_URL.slice(0, -1)
        : BACKEND_BASE_URL;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;

    return `${normalizedBase}${normalizedPath}`;
};

const resolveUserName = (user: unknown): string => {
    const userObject = asRecord(user);

    if (!userObject) {
        return 'Unknown user';
    }

    const name = userObject.name;
    if (typeof name === 'string' && name.trim()) {
        return name;
    }

    const email = userObject.email;
    if (typeof email === 'string' && email.trim()) {
        return email.split('@')[0];
    }

    return 'Unknown user';
};

const resolveUserAvatar = (user: unknown): string => {
    const userObject = asRecord(user);

    if (!userObject) {
        return DEFAULT_AVATAR;
    }

    const avatar = userObject.avatar;

    if (typeof avatar === 'string') {
        return toAbsoluteMediaUrl(avatar) || DEFAULT_AVATAR;
    }

    const avatarObject = asRecord(avatar);
    if (!avatarObject) {
        return DEFAULT_AVATAR;
    }

    const avatarUrl = avatarObject.url;
    if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
        return toAbsoluteMediaUrl(avatarUrl) || DEFAULT_AVATAR;
    }

    return DEFAULT_AVATAR;
};

const formatThreadDate = (value?: string): string => {
    if (!value) {
        return 'Unknown date';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return 'Unknown date';
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

const toCategorySlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const resolveThreadSubCategory = (value: unknown): { title: string | null; slug: string | null } => {
    const plainValue = asString(value);
    if (plainValue) {
        return {
            title: plainValue,
            slug: toCategorySlug(plainValue),
        };
    }

    const categoryObject = asRecord(value);
    if (!categoryObject) {
        return { title: null, slug: null };
    }

    const title = asString(categoryObject.name);
    const slugValue = asString(categoryObject.slug);

    return {
        title,
        slug: slugValue || (title ? toCategorySlug(title) : null),
    };
};

const resolveThreadDocument = (payload: unknown): UnknownRecord | null => {
    const payloadObject = asRecord(payload);
    if (!payloadObject) {
        return null;
    }

    const nestedDoc = asRecord(payloadObject.doc);
    if (nestedDoc) {
        return nestedDoc;
    }

    return payloadObject;
};

const extractThreadComments = (thread: UnknownRecord | null): UnknownRecord[] => {
    if (!thread || !Array.isArray(thread.comments)) {
        return [];
    }

    return thread.comments
        .map((comment) => asRecord(comment))
        .filter((comment): comment is UnknownRecord => Boolean(comment));
};

export default function ForumThreadPage() {
    const params = useParams();
    const router = useRouter();
    const slugParam = params.slug;
    const threadIdParam = params.threadId;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const threadId = Array.isArray(threadIdParam) ? threadIdParam[0] : threadIdParam;

    const [thread, setThread] = useState<UnknownRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isPublishingComment, setIsPublishingComment] = useState(false);
    const [publishError, setPublishError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;

        const loadAuthState = async () => {
            try {
                const response = await fetch('/api/auth/me', { cache: 'no-store' });
                const payload = await response.json().catch(() => null) as { user?: unknown } | null;

                if (active) {
                    setIsAuthenticated(Boolean(payload?.user));
                }
            } catch {
                if (active) {
                    setIsAuthenticated(false);
                }
            }
        };

        loadAuthState();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!threadId) {
            setThread(null);
            setError('Thread ID is missing.');
            setIsLoading(false);
            return;
        }

        let active = true;

        const loadThread = async () => {
            setIsLoading(true);
            setError('');
            setPublishError('');

            try {
                const threadResponse = await fetch(`/api/threads/${encodeURIComponent(threadId)}`, {
                    cache: 'no-store',
                });
                const threadPayload = await threadResponse.json().catch(() => null);

                if (!threadResponse.ok) {
                    const payloadObject = asRecord(threadPayload);
                    const message = typeof payloadObject?.error === 'string'
                        ? payloadObject.error
                        : 'Unable to load thread.';
                    throw new Error(message);
                }

                const resolvedThread = resolveThreadDocument(threadPayload);
                if (!resolvedThread) {
                    throw new Error('Invalid thread payload.');
                }

                if (active) {
                    setThread(resolvedThread);
                }
            } catch (threadError) {
                if (active) {
                    setThread(null);
                    setError(
                        threadError instanceof Error
                            ? threadError.message
                            : 'Unable to load thread.',
                    );
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadThread();

        return () => {
            active = false;
        };
    }, [threadId]);

    const subCategory = resolveThreadSubCategory(thread?.category);
    const categoryTitle = subCategory.title || forumThreadPageData.hero.title;
    const threadTitle = typeof thread?.title === 'string' && thread.title.trim()
        ? thread.title
        : forumThreadPageData.originalPost.threadTitle;
    const threadContent = typeof thread?.content === 'string' && thread.content.trim()
        ? thread.content
        : forumThreadPageData.originalPost.content;
    const threadDate = formatThreadDate(
        typeof thread?.createdAt === 'string' ? thread.createdAt : undefined,
    );

    const author = thread?.author;
    const authorName = resolveUserName(author);
    const authorAvatar = resolveUserAvatar(author);
    const isThreadLocked = thread?.isLocked === true;

    const replies = useMemo(() => {
        return extractThreadComments(thread)
            .map((comment, index) => {
                const content = typeof comment.comment === 'string'
                    ? comment.comment.trim()
                    : '';
                if (!content) {
                    return null;
                }

                const commentUser = comment.user;
                const commentAuthorId = toEntityId(commentUser);

                const createdAt = typeof comment.createdAt === 'string'
                    ? comment.createdAt
                    : undefined;

                return {
                    id: toEntityId(comment.id) || `${index}`,
                    authorName: resolveUserName(commentUser),
                    authorAvatar: resolveUserAvatar(commentUser),
                    authorProfileHref: toPublicProfileHref(commentAuthorId),
                    date: formatThreadDate(createdAt),
                    content,
                };
            })
            .filter((reply): reply is {
                id: string;
                authorName: string;
                authorAvatar: string;
                authorProfileHref: string | null;
                date: string;
                content: string;
            } => Boolean(reply));
    }, [thread]);

    const totalResponses = thread ? 1 + replies.length : 0;
    const fallbackSlug = subCategory.slug || toCategorySlug(categoryTitle);
    const backLink = slug ? `/forum/${slug}` : fallbackSlug ? `/forum/${fallbackSlug}` : '/forum';

    const handleCancelComment = () => {
        setNewComment('');
        setPublishError('');
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        if (typeof isAuthenticated === 'boolean') {
            return isAuthenticated;
        }

        try {
            const response = await fetch('/api/auth/me', { cache: 'no-store' });
            const payload = await response.json().catch(() => null) as { user?: unknown } | null;
            const nextState = Boolean(payload?.user);
            setIsAuthenticated(nextState);
            return nextState;
        } catch {
            setIsAuthenticated(false);
            return false;
        }
    };

    const handleAddCommentClick = async () => {
        const canComment = await checkAuthStatus();

        if (!canComment) {
            router.push('/login');
            return;
        }

        document.getElementById('thread-comment-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handlePublishComment = async () => {
        const commentToPublish = newComment.trim();

        if (!threadId || !commentToPublish) {
            return;
        }

        if (isAuthenticated === false) {
            router.push('/login');
            return;
        }

        if (isThreadLocked) {
            setPublishError('This thread is locked. New comments are disabled.');
            return;
        }

        setIsPublishingComment(true);
        setPublishError('');

        try {
            const response = await fetch(`/api/threads/${encodeURIComponent(threadId)}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: commentToPublish }),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                const payloadObject = asRecord(payload);
                const message = typeof payloadObject?.error === 'string'
                    ? payloadObject.error
                    : 'Unable to publish comment.';
                throw new Error(message);
            }

            const refreshResponse = await fetch(`/api/threads/${encodeURIComponent(threadId)}`, {
                cache: 'no-store',
            });
            const refreshPayload = await refreshResponse.json().catch(() => null);
            if (refreshResponse.ok) {
                const refreshedThread = resolveThreadDocument(refreshPayload);
                if (refreshedThread) {
                    setThread(refreshedThread);
                }
            }

            setNewComment('');
        } catch (commentError) {
            setPublishError(
                commentError instanceof Error
                    ? commentError.message
                    : 'Unable to publish comment.',
            );
        } finally {
            setIsPublishingComment(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center overflow-x-hidden">
            <div className="relative z-10 w-full flex flex-col items-center">
                <ForumThreadHero
                    title={categoryTitle}
                    backLink={backLink}
                    backText={forumThreadPageData.hero.backText}
                    addCommentLabel={forumThreadPageData.hero.addCommentLabel}
                    onAddCommentClick={handleAddCommentClick}
                />

                <div className="flex flex-col items-start gap-16 w-full max-w-[1280px] px-5 pb-32">
                    <div className="flex flex-col gap-4 w-full">
                        {isLoading && (
                            <div className="w-full rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 text-[#BDBDBD] text-[16px] leading-[26px]">
                                Loading thread...
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="w-full rounded-[40px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] p-6 text-[#FF9C9C] text-[16px] leading-[26px]">
                                {error}
                            </div>
                        )}

                        {!isLoading && !error && thread && (
                            <>
                                <ForumThreadOriginalPost
                                    threadTitle={threadTitle}
                                    authorName={authorName}
                                    authorRole={forumThreadPageData.originalPost.authorRole}
                                    date={threadDate}
                                    authorAvatar={authorAvatar}
                                    content={threadContent}
                                />

                                {replies.map((reply) => (
                                    <ForumThreadReply
                                        key={reply.id}
                                        authorName={reply.authorName}
                                        date={reply.date}
                                        authorAvatar={reply.authorAvatar}
                                        authorProfileHref={reply.authorProfileHref}
                                        content={reply.content}
                                    />
                                ))}
                            </>
                        )}
                    </div>

                    {!isLoading && !error && thread && (
                        <>
                            <ForumPagination
                                showingFrom={1}
                                showingTo={Math.max(totalResponses, 1)}
                                total={Math.max(totalResponses, 1)}
                                currentPage={1}
                                totalPages={1}
                                itemLabel="responses"
                                onPageChange={() => undefined}
                            />

                            {isThreadLocked ? null : (
                                <div id="thread-comment-section" className="w-full">
                                    {isAuthenticated === false ? (
                                        <div className="w-full rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 text-[#BDBDBD] text-[16px] leading-[26px] flex flex-col gap-4">
                                            <div>You need to log in to leave a comment.</div>
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push('/login')}
                                                    className="h-[50px] inline-flex items-center justify-center gap-[12px] rounded-[80px] border border-[#FCC660] px-[24px] text-[#FCC660] text-[16px] font-medium leading-[26px] hover:bg-[#FCC660]/10 transition-all"
                                                >
                                                    Log In
                                                </button>
                                            </div>
                                        </div>
                                    ) : isAuthenticated === null ? (
                                        <div className="w-full rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 text-[#BDBDBD] text-[16px] leading-[26px]">
                                            Checking access...
                                        </div>
                                    ) : (
                                        <ForumThreadCommentInput
                                            title={forumThreadPageData.commentInput.title}
                                            placeholder={forumThreadPageData.commentInput.placeholder}
                                            cancelLabel={forumThreadPageData.commentInput.cancelLabel}
                                            publishLabel={forumThreadPageData.commentInput.publishLabel}
                                            value={newComment}
                                            onChange={(value) => {
                                                setNewComment(value);
                                                if (publishError) {
                                                    setPublishError('');
                                                }
                                            }}
                                            onCancel={handleCancelComment}
                                            onPublish={handlePublishComment}
                                            isPublishing={isPublishingComment}
                                            error={publishError}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
