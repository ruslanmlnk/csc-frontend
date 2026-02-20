import Image from 'next/image';
import Link from 'next/link';
import { Globe, UserRound, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import GlowBackground from '@/app/components/layout/GlowBackground';
import { InstagramIcon, TelegramIcon, TikTokIcon } from '@/app/components/profile/SocialIcons';
import ProfileStatCard from '@/app/components/profile/ProfileStatCard';
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard';
import { backendRequest } from '@/lib/backend/client';
import { getThreadComments } from '@/lib/backend/comments';
import { getThreads } from '@/lib/backend/threads';

type UnknownRecord = Record<string, unknown>;

type PublicUser = {
    id: string;
    name: string | null;
    bio: string | null;
    company: string | null;
    position: string | null;
    directions: string | null;
    instagram: string | null;
    telegram: string | null;
    tiktok: string | null;
    website: string | null;
    avatarUrl: string | null;
};

type PublicThread = {
    id: string;
    title: string;
    categoryTitle: string;
    categorySlug: string;
    createdAt?: string;
    commentsCount: number;
};

const DEFAULT_AVATAR = '/logo.svg';
const BACKEND_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3000';

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

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('https//')) return `https://${trimmed.slice('https//'.length)}`;
    if (trimmed.startsWith('http//')) return `http://${trimmed.slice('http//'.length)}`;
    if (trimmed.startsWith('//')) return `https:${trimmed}`;

    const normalizedBase = BACKEND_BASE_URL.endsWith('/')
        ? BACKEND_BASE_URL.slice(0, -1)
        : BACKEND_BASE_URL;
    const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

    return `${normalizedBase}${normalizedPath}`;
};

const toForumCategorySlug = (value?: string | null): string => {
    const normalized = (value || 'general')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalized || 'general';
};

const resolveThreadSubCategory = (value: unknown): { title: string; slug: string } => {
    if (typeof value === 'string' && value.trim()) {
        return {
            title: value,
            slug: toForumCategorySlug(value),
        };
    }

    if (typeof value === 'number') {
        const title = String(value);
        return {
            title,
            slug: toForumCategorySlug(title),
        };
    }

    const categoryObject = asRecord(value);
    if (categoryObject) {
        const name = asString(categoryObject.name) || 'General';
        const slug = asString(categoryObject.slug) || toForumCategorySlug(name);

        return {
            title: name,
            slug,
        };
    }

    return {
        title: 'General',
        slug: 'general',
    };
};

const formatThreadDate = (value?: string): string => {
    if (!value) return 'Unknown date';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Unknown date';

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

const getThreadAuthorId = (author: unknown): string | null => {
    if (author === null || author === undefined) return null;
    if (typeof author === 'string' || typeof author === 'number') return String(author);

    const authorObject = asRecord(author);
    if (!authorObject) return null;

    return toEntityId(authorObject.id);
};

const normalizeSocialHandle = (value: string | null): string | null => {
    if (!value) return null;

    const normalized = value.trim().replace(/^@+/, '').replace(/^\/+/, '');
    return normalized || null;
};

const toWebsiteHref = (value: string | null): string | null => {
    if (!value) return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;

    try {
        const parsed = new URL(normalized);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null;
        }

        return parsed.toString();
    } catch {
        return null;
    }
};

const getCommentsCount = async (threadId: string): Promise<number> => {
    const response = await getThreadComments(threadId, '1', '0');
    if (!response.ok || !response.data) {
        return 0;
    }

    const payload = asRecord(response.data);
    if (!payload) {
        return 0;
    }

    if (typeof payload.totalDocs === 'number') {
        return payload.totalDocs;
    }

    return Array.isArray(payload.docs) ? payload.docs.length : 0;
};

const getPublicUser = async (rawUserId: string): Promise<PublicUser | null> => {
    const userId = rawUserId.trim();
    if (!userId) {
        return null;
    }

    const response = await backendRequest<Record<string, unknown>>(
        `/api/users/${encodeURIComponent(userId)}?depth=1`,
        { cache: 'no-store' },
    );

    if (!response.ok || !response.data) {
        return null;
    }

    const payload = asRecord(response.data);
    if (!payload) {
        return null;
    }

    const userObject = asRecord(payload.doc) || payload;
    const resolvedId = toEntityId(userObject.id);
    if (!resolvedId) {
        return null;
    }

    const avatar = userObject.avatar;
    const avatarUrl = typeof avatar === 'string'
        ? toAbsoluteMediaUrl(avatar)
        : toAbsoluteMediaUrl(asString(asRecord(avatar)?.url));

    return {
        id: resolvedId,
        name: asString(userObject.name),
        bio: asString(userObject.bio),
        company: asString(userObject.company),
        position: asString(userObject.position),
        directions: asString(userObject.directions),
        instagram: asString(userObject.instagram),
        telegram: asString(userObject.telegram),
        tiktok: asString(userObject.tiktok),
        website: asString(userObject.website),
        avatarUrl,
    };
};

const getPublicThreads = async (authorId: string): Promise<PublicThread[]> => {
    const response = await getThreads({
        page: '1',
        limit: '100',
        authorId,
        depth: '1',
        sort: '-createdAt',
    });

    if (!response.ok || !response.data) {
        return [];
    }

    const payload = asRecord(response.data);
    if (!payload || !Array.isArray(payload.docs)) {
        return [];
    }

    const docs = payload.docs
        .map((doc) => asRecord(doc))
        .filter((doc): doc is UnknownRecord => Boolean(doc));

    const normalizedThreads = docs.filter((doc) => {
        const threadId = toEntityId(doc.id);
        if (!threadId) {
            return false;
        }

        const threadAuthorId = getThreadAuthorId(doc.author);
        return !threadAuthorId || threadAuthorId === authorId;
    });

    const threads = await Promise.all(
        normalizedThreads.map(async (thread): Promise<PublicThread | null> => {
            const threadId = toEntityId(thread.id);
            if (!threadId) {
                return null;
            }

            const category = resolveThreadSubCategory(thread.category);

            return {
                id: threadId,
                title: asString(thread.title) || 'Untitled thread',
                categoryTitle: category.title,
                categorySlug: category.slug,
                createdAt: asString(thread.createdAt) || undefined,
                commentsCount: await getCommentsCount(threadId),
            };
        }),
    );

    return threads.filter((thread): thread is PublicThread => Boolean(thread));
};

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ userId?: string }> | { userId?: string };
}) {
    const resolvedParams = await params;
    const userId = typeof resolvedParams.userId === 'string' ? resolvedParams.userId.trim() : '';

    if (!userId) {
        notFound();
    }

    const user = await getPublicUser(userId);
    if (!user) {
        notFound();
    }

    const threads = await getPublicThreads(user.id);
    const displayName = user.name || 'Member';
    const bio = user.bio || 'Description not filled in';
    const avatarUrl = user.avatarUrl || DEFAULT_AVATAR;
    const instagramHandle = normalizeSocialHandle(user.instagram);
    const telegramHandle = normalizeSocialHandle(user.telegram);
    const tiktokHandle = normalizeSocialHandle(user.tiktok);
    const websiteHref = toWebsiteHref(user.website);

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black pb-20">
            <GlowBackground className="-translate-y-12 md:translate-y-0" heightClassName="h-[1000px]" showMobileGlow />

            <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[90px] pt-[128px] md:pt-[202.69px] flex flex-col gap-6 mx-auto">
                <section className="rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] p-8 md:p-[29.2px_40px_59.2px_40px] flex flex-col items-stretch gap-6 relative overflow-hidden self-stretch" style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(242, 159, 4, 0.15) 0%, transparent 50%)' }}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6 relative">
                        <div className="flex items-center gap-6 md:gap-10">
                            <div className="h-20 w-20 md:h-[125px] md:w-[125px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0 relative overflow-hidden">
                                <Image src={avatarUrl} alt={`${displayName} avatar`} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col items-start gap-4 md:gap-5 w-[140px] md:w-auto min-w-0">
                                <h1 className="text-white font-poppins text-[20px] md:text-[32px] font-medium leading-[32px] md:leading-[40px] tracking-[-0.64px] line-clamp-1 truncate block w-full">{displayName}</h1>
                                <div className="flex items-center gap-6 md:gap-4">
                                    {instagramHandle ? (
                                        <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                                            <InstagramIcon size={24} />
                                        </a>
                                    ) : null}
                                    {telegramHandle ? (
                                        <a href={`https://t.me/${telegramHandle}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Telegram">
                                            <TelegramIcon size={24} />
                                        </a>
                                    ) : null}
                                    {tiktokHandle ? (
                                        <a href={`https://tiktok.com/@${tiktokHandle}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="TikTok">
                                            <TikTokIcon size={24} />
                                        </a>
                                    ) : null}
                                    {websiteHref ? (
                                        <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity text-[#F29F04]" aria-label="Website">
                                            <Globe size={24} />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <p className="text-[#BDBDBD] text-[16px] leading-[26px] font-poppins text-left md:text-right w-full [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] md:max-w-[602.81px]">
                            {bio}
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <ProfileStatCard
                        label="Team"
                        value={user.company || undefined}
                        icon={<Users size={32} color="#212121" />}
                    />
                    <ProfileStatCard
                        label="Position"
                        value={user.position || undefined}
                        icon={<UserRound size={32} color="#212121" />}
                    />
                    <ProfileStatCard
                        label="Directions"
                        value={user.directions || undefined}
                        icon={<Image src="/images/profile-directions.png" width={32} height={32} alt="Directions" className="w-8 h-8 object-contain brightness-0" />}
                    />
                </section>

                <section className="relative w-full h-[158px] rounded-[40px] overflow-hidden mt-[54px]">
                    <Image src="/images/profile-banner.png" alt="Profile banner" fill className="object-cover" />
                </section>

                <section className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Threads</h2>
                    <span className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">{threads.length}</span>
                </section>

                <section className="flex flex-col gap-4">
                    {threads.length === 0 ? (
                        <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
                            No threads yet.
                        </div>
                    ) : (
                        threads.map((thread) => {
                            const threadHref = `/forum/${thread.categorySlug}/${thread.id}`;

                            return (
                                <Link key={thread.id} href={threadHref} className="block">
                                    <ForumCategoryThreadCard
                                        title={thread.title}
                                        description={thread.categoryTitle || 'We read, delve into, discuss'}
                                        authorName={displayName}
                                        date={formatThreadDate(thread.createdAt)}
                                        replyCount={thread.commentsCount}
                                        authorAvatar={avatarUrl}
                                    />
                                </Link>
                            );
                        })
                    )}
                </section>
            </main>
        </div>
    );
}
