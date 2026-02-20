"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, UserRound, Users, Loader2, Globe } from 'lucide-react';
import CreateThreadModal from './CreateThreadModal';
import { BackendUser } from '@/lib/backend/users';
import GlowBackground from '@/app/components/layout/GlowBackground';
import { InstagramIcon, TelegramIcon, TikTokIcon } from '@/app/components/profile/SocialIcons';
import ProfileStatCard from '@/app/components/profile/ProfileStatCard';
import ForumCategoryThreadCard from '@/app/components/forum/ForumCategoryThreadCard';

const EditIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.95 23.5125H6.0875L9.75 23.175C10.2625 23.125 10.7375 22.9 11.1 22.5375L24.925 8.7125C25.575 8.0625 25.9375 7.2 25.9375 6.2875C25.9375 5.375 25.575 4.5125 24.925 3.8625L24.0375 2.975C22.7375 1.675 20.475 1.675 19.175 2.975L17.4125 4.7375L5.3625 16.7875C5 17.15 4.775 17.625 4.7375 18.1375L4.4 21.8C4.3625 22.2625 4.525 22.7125 4.85 23.05C5.15 23.35 5.5375 23.5125 5.95 23.5125ZM21.6125 3.8375C22.0125 3.8375 22.4125 3.9875 22.7125 4.3L23.6 5.1875C23.746 5.33106 23.862 5.50226 23.9412 5.69112C24.0204 5.87998 24.0612 6.08272 24.0612 6.2875C24.0612 6.49228 24.0204 6.69502 23.9412 6.88388C23.862 7.07274 23.746 7.24394 23.6 7.3875L22.5 8.4875L19.4125 5.4L20.5125 4.3C20.8125 4 21.2125 3.8375 21.6125 3.8375ZM6.6 18.3125C6.6 18.2375 6.6375 18.175 6.6875 18.125L18.075 6.725L21.1625 9.8125L9.775 21.2C9.775 21.2 9.65 21.2875 9.5875 21.2875L6.3 21.5875L6.6 18.3V18.3125ZM28.4375 27.5C28.4375 28.0125 28.0125 28.4375 27.5 28.4375H2.5C1.9875 28.4375 1.5625 28.0125 1.5625 27.5C1.5625 26.9875 1.9875 26.5625 2.5 26.5625H27.5C28.0125 26.5625 28.4375 26.9875 28.4375 27.5Z" fill="#F29F04" />
  </svg>
);

const ExitIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.5908 15.6363L20.8708 19.3563C20.7016 19.5228 20.4734 19.6158 20.236 19.6148C19.9986 19.6139 19.7711 19.5192 19.6032 19.3513C19.4353 19.1834 19.3406 18.956 19.3396 18.7186C19.3386 18.4812 19.4314 18.253 19.5979 18.0837L21.7666 15.915H12.4195C12.1808 15.915 11.9519 15.8202 11.7831 15.6514C11.6144 15.4826 11.5195 15.2537 11.5195 15.015C11.5195 14.7763 11.6144 14.5474 11.7831 14.3786C11.9519 14.2098 12.1808 14.115 12.4195 14.115H21.7966L19.5979 11.9163C19.4314 11.747 19.3386 11.5188 19.3396 11.2814C19.3406 11.044 19.4353 10.8166 19.6032 10.6487C19.7711 10.4809 19.9986 10.3861 20.236 10.3852C20.4734 10.3843 20.7016 10.4772 20.8708 10.6437L24.5908 14.3637C24.7596 14.5325 24.8543 14.7614 24.8543 15C24.8543 15.2387 24.7596 15.4675 24.5908 15.6363Z" fill="#F29F04" />
    <path d="M16.6645 26.5311H7.54453C6.90821 26.5305 6.29813 26.2774 5.84818 25.8275C5.39823 25.3775 5.14517 24.7674 5.14453 24.1311V5.8689C5.14517 5.23258 5.39823 4.6225 5.84818 4.17255C6.29813 3.7226 6.90821 3.46954 7.54453 3.4689H16.6645C16.9032 3.4689 17.1321 3.56372 17.3009 3.73251C17.4697 3.90129 17.5645 4.13021 17.5645 4.3689C17.5645 4.6076 17.4697 4.83652 17.3009 5.0053C17.1321 5.17408 16.9032 5.2689 16.6645 5.2689H7.54453C7.3854 5.2689 7.23279 5.33212 7.12027 5.44464C7.00775 5.55716 6.94453 5.70977 6.94453 5.8689V24.1311C6.94453 24.2902 7.00775 24.4428 7.12027 24.5554C7.23279 24.6679 7.3854 24.7311 7.54453 24.7311H16.6645C16.9032 24.7311 17.1321 24.8259 17.3009 24.9947C17.4697 25.1635 17.5645 25.3924 17.5645 25.6311C17.5645 25.8698 17.4697 26.0987 17.3009 26.2675C17.1321 26.4363 16.9032 26.5311 16.6645 26.5311Z" fill="#F29F04" />
  </svg>
);

const UserIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45.1016 41.4063C42.127 36.2637 37.543 32.5762 32.1934 30.8282C34.8396 29.2529 36.8955 26.8525 38.0454 23.9957C39.1953 21.1389 39.3757 17.9836 38.5588 15.0144C37.7419 12.0452 35.9729 9.42619 33.5235 7.55965C31.074 5.69311 28.0796 4.68222 25.0001 4.68222C21.9205 4.68222 18.9261 5.69311 16.4767 7.55965C14.0273 9.42619 12.2583 12.0452 11.4414 15.0144C10.6245 17.9836 10.8048 21.1389 11.9547 23.9957C13.1047 26.8525 15.1606 29.2529 17.8067 30.8282C12.4571 32.5743 7.87312 36.2618 4.89851 41.4063C4.78942 41.5842 4.71707 41.7821 4.68571 41.9883C4.65436 42.1946 4.66463 42.4051 4.71594 42.6074C4.76724 42.8096 4.85854 42.9995 4.98443 43.1659C5.11032 43.3323 5.26827 43.4718 5.44895 43.5762C5.62963 43.6805 5.82938 43.7477 6.03641 43.7736C6.24345 43.7995 6.45358 43.7837 6.65441 43.7271C6.85524 43.6704 7.04269 43.5742 7.20571 43.4439C7.36873 43.3137 7.50402 43.1521 7.60359 42.9688C11.2833 36.6094 17.7872 32.8125 25.0001 32.8125C32.213 32.8125 38.7169 36.6094 42.3966 42.9688C42.4961 43.1521 42.6314 43.3137 42.7944 43.4439C42.9575 43.5742 43.1449 43.6704 43.3457 43.7271C43.5466 43.7837 43.7567 43.7995 43.9637 43.7736C44.1708 43.7477 44.3705 43.6805 44.5512 43.5762C44.7319 43.4718 44.8898 43.3323 45.0157 43.1659C45.1416 42.9995 45.2329 42.8096 45.2842 42.6074C45.3355 42.4051 45.3458 42.1946 45.3144 41.9883C45.2831 41.7821 45.2107 41.5842 45.1016 41.4063ZM14.0626 18.75C14.0626 16.5868 14.704 14.4721 15.9059 12.6735C17.1077 10.8748 18.8159 9.47293 20.8145 8.6451C22.813 7.81727 25.0122 7.60067 27.1339 8.02269C29.2555 8.44472 31.2044 9.48642 32.734 11.0161C34.2637 12.5457 35.3054 14.4946 35.7274 16.6162C36.1494 18.7379 35.9328 20.9371 35.105 22.9356C34.2772 24.9342 32.8753 26.6424 31.0766 27.8442C29.278 29.0461 27.1633 29.6875 25.0001 29.6875C22.1002 29.6844 19.32 28.5311 17.2695 26.4806C15.219 24.4301 14.0657 21.6499 14.0626 18.75Z" fill="#BDBDBD" />
  </svg>
);

const ThreadPencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.8428 4.62479L15.3749 0.155966C15.2264 0.00735903 15.05 -0.110524 14.8558 -0.190952C14.6617 -0.271379 14.4536 -0.312775 14.2435 -0.312775C14.0333 -0.312775 13.8253 -0.271379 13.6311 -0.190952C13.437 -0.110524 13.2606 0.00735903 13.112 0.155966L0.78149 12.4875C0.632275 12.6355 0.513974 12.8117 0.433463 13.0059C0.352951 13.2 0.311837 13.4083 0.312508 13.6185V18.0873C0.312508 18.5116 0.481073 18.9186 0.781119 19.2186C1.08117 19.5187 1.48812 19.6872 1.91245 19.6872H6.38128C6.59146 19.6879 6.79968 19.6468 6.99384 19.5663C7.18799 19.4858 7.3642 19.3675 7.51223 19.2182L19.8428 6.88771C19.9914 6.73914 20.1093 6.56274 20.1897 6.36861C20.2701 6.17447 20.3115 5.96639 20.3115 5.75625C20.3115 5.54611 20.2701 5.33803 20.1897 5.1439C20.1093 4.94976 19.9914 4.77337 19.8428 4.62479ZM2.24343 13.2875L10.7121 4.81879L12.381 6.48772L3.91237 14.9554L2.24343 13.2875ZM1.91245 15.2184L4.78134 18.0873H1.91245V15.2184ZM6.71226 17.7563L5.04333 16.0874L13.512 7.61868L15.1809 9.28762L6.71226 17.7563ZM16.3119 8.15666L11.8431 3.68783L14.243 1.28792L18.7118 5.75575L16.3119 8.15666Z" fill="#F29F04" />
  </svg>
);

type AvatarShape = {
  url?: string;
};

type ProfileThreadDoc = {
  id: string | number;
  title?: string | null;
  category?: string | number | {
    id?: string | number | null;
    name?: string | null;
    slug?: string | null;
  } | null;
  createdAt?: string;
  author?: { id?: string | number | null } | string | number | null;
  isLocked?: boolean | null;
};

type ProfileThreadWithCounts = ProfileThreadDoc & {
  commentsCount: number;
};

type ThreadsResponse = {
  docs?: ProfileThreadDoc[];
  totalDocs?: number;
  error?: string;
};

type ThreadCommentsResponse = {
  totalDocs?: number;
  docs?: unknown[];
};

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

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

const getThreadAuthorId = (author: ProfileThreadDoc['author']): string | null => {
  if (author === null || author === undefined) return null;
  if (typeof author === 'string' || typeof author === 'number') return String(author);
  if (typeof author === 'object' && author.id !== undefined && author.id !== null) {
    return String(author.id);
  }
  return null;
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

const toForumCategorySlug = (value?: string | null): string => {
  const normalized = (value || 'general')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'general';
};

const resolveThreadSubCategory = (
  value: ProfileThreadDoc['category'],
): { title: string; slug: string } => {
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

  if (value && typeof value === 'object') {
    const name = typeof value.name === 'string' && value.name.trim()
      ? value.name
      : 'General';
    const slug = typeof value.slug === 'string' && value.slug.trim()
      ? value.slug
      : toForumCategorySlug(name);

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

const getThreadCommentsCount = async (threadId: string): Promise<number> => {
  try {
    const response = await fetch(
      `/api/threads/${encodeURIComponent(threadId)}/comments?limit=1&depth=0`,
      { cache: 'no-store' },
    );
    const data = (await response.json().catch(() => null)) as ThreadCommentsResponse | null;

    if (!response.ok) {
      return 0;
    }

    if (typeof data?.totalDocs === 'number') {
      return data.totalDocs;
    }

    return Array.isArray(data?.docs) ? data.docs.length : 0;
  } catch {
    return 0;
  }
};

const ProfilePage: React.FC = () => {
  const [threadsCount, setThreadsCount] = useState(0);
  const [threads, setThreads] = useState<ProfileThreadWithCounts[]>([]);
  const [threadsError, setThreadsError] = useState('');
  const [isThreadsLoading, setIsThreadsLoading] = useState(false);
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const refreshUserThreads = useCallback(async () => {
    if (user?.id === undefined || user?.id === null) {
      setThreads([]);
      setThreadsCount(0);
      return;
    }

    const targetUserId = String(user.id);
    setIsThreadsLoading(true);
    setThreadsError('');

    try {
      const response = await fetch(
        `/api/threads?page=1&limit=100&authorId=${encodeURIComponent(targetUserId)}`,
        { cache: 'no-store' },
      );
      const data = (await response.json().catch(() => null)) as ThreadsResponse | null;

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load threads.');
      }

      const docs = Array.isArray(data?.docs) ? data.docs : [];
      const filteredThreads = docs.filter((thread) => {
        const authorId = getThreadAuthorId(thread.author);
        return !authorId || authorId === targetUserId;
      });

      const commentCountsByThread = Object.fromEntries(
        await Promise.all(
          filteredThreads.map(async (thread) => {
            const threadId = String(thread.id);
            const commentsCount = await getThreadCommentsCount(threadId);

            return [threadId, commentsCount] as const;
          }),
        ),
      );

      const threadsWithCounts = filteredThreads.map((thread) => ({
        ...thread,
        commentsCount: commentCountsByThread[String(thread.id)] ?? 0,
      }));

      setThreads(threadsWithCounts);
      setThreadsCount(typeof data?.totalDocs === 'number' ? data.totalDocs : filteredThreads.length);
    } catch (err) {
      setThreads([]);
      setThreadsCount(0);
      setThreadsError(err instanceof Error ? err.message : 'Unable to load threads.');
    } finally {
      setIsThreadsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshUserThreads();
  }, [refreshUserThreads]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F29F04] w-10 h-10" />
      </div>
    );
  }

  const avatarRaw =
    typeof user?.avatar === 'string'
      ? user.avatar
      : user?.avatar && typeof user.avatar === 'object'
        ? (user.avatar as AvatarShape).url || null
        : null;
  const avatarUrl = toAbsoluteMediaUrl(avatarRaw);
  const displayName = user?.name || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black pb-20">
      <GlowBackground className="-translate-y-12 md:translate-y-0" heightClassName="h-[1000px]" showMobileGlow />

      <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[90px] pt-[128px] md:pt-[202.69px] flex flex-col gap-6 mx-auto">
        <section className="rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] p-8 md:p-[29.2px_40px_59.2px_40px] flex flex-col items-stretch md:items-end gap-6 md:gap-0 relative overflow-hidden self-stretch" style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(242, 159, 4, 0.15) 0%, transparent 50%)' }}>
          <div className="order-3 md:order-none flex items-center justify-end gap-[30px] w-full md:w-auto relative">
            <Link href="/profile/settings" className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer">
              <span className="md:hidden"><EditIcon size={24} /></span>
              <span className="hidden md:block"><EditIcon /></span>
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">Edit</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer">
              <span className="md:hidden"><ExitIcon size={24} /></span>
              <span className="hidden md:block"><ExitIcon /></span>
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">Exit</span>
            </button>
          </div>

          <div className="order-1 md:order-none flex flex-col md:flex-row md:items-end justify-between w-full gap-6 relative">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="h-20 w-20 md:h-[125px] md:w-[125px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0 relative overflow-hidden">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="scale-[0.64] md:scale-100"><UserIcon /></div>
                )}
              </div>
              <div className="flex flex-col items-start gap-4 md:gap-5 w-[140px] md:w-auto min-w-0">
                <h1 className="text-white font-poppins text-[20px] md:text-[32px] font-medium leading-[32px] md:leading-[40px] tracking-[-0.64px] line-clamp-1 truncate block w-full">{displayName}</h1>
                <div className="flex items-center gap-6 md:gap-4">
                  {user?.instagram && (
                    <Link href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" className="hover:opacity-80 transition-opacity">
                      <InstagramIcon size={24} />
                    </Link>
                  )}
                  {user?.telegram && (
                    <Link href={`https://t.me/${user.telegram.replace('@', '')}`} target="_blank" className="hover:opacity-80 transition-opacity">
                      <TelegramIcon size={24} />
                    </Link>
                  )}
                  {user?.tiktok && (
                    <Link href={`https://tiktok.com/@${user.tiktok.replace('@', '')}`} target="_blank" className="hover:opacity-80 transition-opacity">
                      <TikTokIcon size={24} />
                    </Link>
                  )}
                  {user?.website && (
                    <Link href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" className="hover:opacity-80 transition-opacity text-[#F29F04]">
                      <Globe size={24} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[#BDBDBD] text-[16px] leading-[26px] font-poppins text-left md:text-right w-full [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] md:max-w-[602.81px]">
              {user?.bio || 'Description not filled in'}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProfileStatCard
            label="Team"
            value={user?.company as string | undefined}
            icon={<Users size={32} color="#212121" />}
          />
          <ProfileStatCard
            label="Position"
            value={user?.position as string | undefined}
            icon={<UserRound size={32} color="#212121" />}
          />
          <ProfileStatCard
            label="Directions"
            value={user?.directions as string | undefined}
            icon={<Image src="/images/profile-directions.png" width={32} height={32} alt="Directions" className="w-8 h-8 object-contain brightness-0" />}
          />
        </section>

        <section className="relative w-full h-[158px] rounded-[40px] overflow-hidden mt-[54px]">
          <Image src="/images/profile-banner.png" alt="Profile banner" fill className="object-cover" />
        </section>

        <section className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-[30px]">
            <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Threads</h2>
            <div className="flex items-center gap-[10px]">
              <ThreadPencilIcon />
              <span className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">{threadsCount}</span>
            </div>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="h-[58px] px-6 rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] flex items-center justify-center gap-[5px] hover:bg-[#FCC660] hover:text-[#0D0D0D] transition-all">
            <Plus size={24} /> Add a comment
          </button>
        </section>

        <section className="flex flex-col gap-4">
          {isThreadsLoading && (
            <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
              Loading threads...
            </div>
          )}

          {threadsError && (
            <div className="rounded-[24px] border border-[rgba(255,128,128,0.6)] bg-[rgba(255,128,128,0.08)] px-6 py-5 text-[#FF9C9C] text-[16px] leading-[26px]">
              {threadsError}
            </div>
          )}

          {!isThreadsLoading && !threadsError && threads.length === 0 && (
            <div className="rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-6 py-5 text-[#BDBDBD] text-[16px] leading-[26px]">
              No threads yet.
            </div>
          )}

          {threads.map((thread) => {
            const threadId = String(thread.id);
            const subCategory = resolveThreadSubCategory(thread.category);
            const categorySlug = subCategory.slug;
            const threadHref = `/forum/${categorySlug}/${threadId}`;
            const threadDescription = subCategory.title;

            return (
              <Link key={threadId} href={threadHref} className="block">
                <ForumCategoryThreadCard
                  title={thread.title || 'Untitled thread'}
                  description={threadDescription || 'We read, delve into, discuss'}
                  authorName={displayName}
                  date={formatThreadDate(thread.createdAt)}
                  replyCount={thread.commentsCount}
                  authorAvatar={avatarUrl || '/logo.svg'}
                />
              </Link>
            );
          })}
        </section>
      </main>

      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshUserThreads}
      />
    </div>
  );
};

export default ProfilePage;
