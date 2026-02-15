"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Pencil, Plus, UserRound, Users, FileText, Loader2, Globe } from 'lucide-react';
import CreateThreadModal from './CreateThreadModal';
import { BackendUser } from '@/lib/backend/users';

const EditIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.95 23.5125H6.0875L9.75 23.175C10.2625 23.125 10.7375 22.9 11.1 22.5375L24.925 8.7125C25.575 8.0625 25.9375 7.2 25.9375 6.2875C25.9375 5.375 25.575 4.5125 24.925 3.8625L24.0375 2.975C22.7375 1.675 20.475 1.675 19.175 2.975L17.4125 4.7375L5.3625 16.7875C5 17.15 4.775 17.625 4.7375 18.1375L4.4 21.8C4.3625 22.2625 4.525 22.7125 4.85 23.05C5.15 23.35 5.5375 23.5125 5.95 23.5125ZM21.6125 3.8375C22.0125 3.8375 22.4125 3.9875 22.7125 4.3L23.6 5.1875C23.746 5.33106 23.862 5.50226 23.9412 5.69112C24.0204 5.87998 24.0612 6.08272 24.0612 6.2875C24.0612 6.49228 24.0204 6.69502 23.9412 6.88388C23.862 7.07274 23.746 7.24394 23.6 7.3875L22.5 8.4875L19.4125 5.4L20.5125 4.3C20.8125 4 21.2125 3.8375 21.6125 3.8375ZM6.6 18.3125C6.6 18.2375 6.6375 18.175 6.6875 18.125L18.075 6.725L21.1625 9.8125L9.775 21.2C9.775 21.2 9.65 21.2875 9.5875 21.2875L6.3 21.5875L6.6 18.3V18.3125ZM28.4375 27.5C28.4375 28.0125 28.0125 28.4375 27.5 28.4375H2.5C1.9875 28.4375 1.5625 28.0125 1.5625 27.5C1.5625 26.9875 1.9875 26.5625 2.5 26.5625H27.5C28.0125 26.5625 28.4375 26.9875 28.4375 27.5Z" fill="#F29F04" />
  </svg>
);

const ExitIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.5908 15.6363L20.8708 19.3563C20.7016 19.5228 20.4734 19.6158 20.236 19.6148C19.9986 19.6139 19.7711 19.5192 19.6032 19.3513C19.4353 19.1834 19.3406 18.956 19.3396 18.7186C19.3386 18.4812 19.4314 18.253 19.5979 18.0837L21.7666 15.915H12.4195C12.1808 15.915 11.9519 15.8202 11.7831 15.6514C11.6144 15.4826 11.5195 15.2537 11.5195 15.015C11.5195 14.7763 11.6144 14.5474 11.7831 14.3786C11.9519 14.2098 12.1808 14.115 12.4195 14.115H21.7966L19.5979 11.9163C19.4314 11.747 19.3386 11.5188 19.3396 11.2814C19.3406 11.044 19.4353 10.8166 19.6032 10.6487C19.7711 10.4809 19.9986 10.3861 20.236 10.3852C20.4734 10.3843 20.7016 10.4772 20.8708 10.6437L24.5908 14.3637C24.7596 14.5325 24.8543 14.7614 24.8543 15C24.8543 15.2387 24.7596 15.4675 24.5908 15.6363Z" fill="#F29F04" />
    <path d="M16.6645 26.5311H7.54453C6.90821 26.5305 6.29813 26.2774 5.84818 25.8275C5.39823 25.3775 5.14517 24.7674 5.14453 24.1311V5.8689C5.14517 5.23258 5.39823 4.6225 5.84818 4.17255C6.29813 3.7226 6.90821 3.46954 7.54453 3.4689H16.6645C16.9032 3.4689 17.1321 3.56372 17.3009 3.73251C17.4697 3.90129 17.5645 4.13021 17.5645 4.3689C17.5645 4.6076 17.4697 4.83652 17.3009 5.0053C17.1321 5.17408 16.9032 5.2689 16.6645 5.2689H7.54453C7.3854 5.2689 7.23279 5.33212 7.12027 5.44464C7.00775 5.55716 6.94453 5.70977 6.94453 5.8689V24.1311C6.94453 24.2902 7.00775 24.4428 7.12027 24.5554C7.23279 24.6679 7.3854 24.7311 7.54453 24.7311H16.6645C16.9032 24.7311 17.1321 24.8259 17.3009 24.9947C17.4697 25.1635 17.5645 25.3924 17.5645 25.6311C17.5645 25.8698 17.4697 26.0987 17.3009 26.2675C17.1321 26.4363 16.9032 26.5311 16.6645 26.5311Z" fill="#F29F04" />
  </svg>
);

const UserIcon = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45.1016 41.4063C42.127 36.2637 37.543 32.5762 32.1934 30.8282C34.8396 29.2529 36.8955 26.8525 38.0454 23.9957C39.1953 21.1389 39.3757 17.9836 38.5588 15.0144C37.7419 12.0452 35.9729 9.42619 33.5235 7.55965C31.074 5.69311 28.0796 4.68222 25.0001 4.68222C21.9205 4.68222 18.9261 5.69311 16.4767 7.55965C14.0273 9.42619 12.2583 12.0452 11.4414 15.0144C10.6245 17.9836 10.8048 21.1389 11.9547 23.9957C13.1047 26.8525 15.1606 29.2529 17.8067 30.8282C12.4571 32.5743 7.87312 36.2618 4.89851 41.4063C4.78942 41.5842 4.71707 41.7821 4.68571 41.9883C4.65436 42.1946 4.66463 42.4051 4.71594 42.6074C4.76724 42.8096 4.85854 42.9995 4.98443 43.1659C5.11032 43.3323 5.26827 43.4718 5.44895 43.5762C5.62963 43.6805 5.82938 43.7477 6.03641 43.7736C6.24345 43.7995 6.45358 43.7837 6.65441 43.7271C6.85524 43.6704 7.04269 43.5742 7.20571 43.4439C7.36873 43.3137 7.50402 43.1521 7.60359 42.9688C11.2833 36.6094 17.7872 32.8125 25.0001 32.8125C32.213 32.8125 38.7169 36.6094 42.3966 42.9688C42.4961 43.1521 42.6314 43.3137 42.7944 43.4439C42.9575 43.5742 43.1449 43.6704 43.3457 43.7271C43.5466 43.7837 43.7567 43.7995 43.9637 43.7736C44.1708 43.7477 44.3705 43.6805 44.5512 43.5762C44.7319 43.4718 44.8898 43.3323 45.0157 43.1659C45.1416 42.9995 45.2329 42.8096 45.2842 42.6074C45.3355 42.4051 45.3458 42.1946 45.3144 41.9883C45.2831 41.7821 45.2107 41.5842 45.1016 41.4063ZM14.0626 18.75C14.0626 16.5868 14.704 14.4721 15.9059 12.6735C17.1077 10.8748 18.8159 9.47293 20.8145 8.6451C22.813 7.81727 25.0122 7.60067 27.1339 8.02269C29.2555 8.44472 31.2044 9.48642 32.734 11.0161C34.2637 12.5457 35.3054 14.4946 35.7274 16.6162C36.1494 18.7379 35.9328 20.9371 35.105 22.9356C34.2772 24.9342 32.8753 26.6424 31.0766 27.8442C29.278 29.0461 27.1633 29.6875 25.0001 29.6875C22.1002 29.6844 19.32 28.5311 17.2695 26.4806C15.219 24.4301 14.0657 21.6499 14.0626 18.75Z" fill="#BDBDBD" />
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.9574 0H8.04255C5.9105 0.00315159 3.86668 0.851502 2.35909 2.35909C0.851502 3.86668 0.00315159 5.9105 0 8.04255V19.9574C0.00315159 22.0895 0.851502 24.1333 2.35909 25.6409C3.86668 27.1485 5.9105 27.9968 8.04255 28H19.9574C22.0895 27.9968 24.1333 27.1485 25.6409 25.6409C27.1485 24.1333 27.9968 22.0895 28 19.9574V8.04255C27.9968 5.9105 27.1485 3.86668 25.6409 2.35909C24.1333 0.851502 22.0895 0.00315159 19.9574 0ZM14 20.6604C12.6827 20.6604 11.395 20.2698 10.2997 19.5379C9.20436 18.8061 8.35068 17.7659 7.84657 16.5488C7.34246 15.3318 7.21056 13.9926 7.46755 12.7006C7.72455 11.4086 8.35889 10.2218 9.29037 9.29037C10.2218 8.35889 11.4086 7.72455 12.7006 7.46755C13.9926 7.21056 15.3318 7.34246 16.5488 7.84657C17.7659 8.35068 18.8061 9.20436 19.5379 10.2997C20.2698 11.395 20.6604 12.6827 20.6604 14C20.6573 15.7655 19.9545 17.4578 18.7062 18.7062C17.4578 19.9545 15.7655 20.6573 14 20.6604ZM23.4604 6.29106C23.4239 6.48282 23.3489 6.6652 23.24 6.82723C23.1835 6.90672 23.1218 6.98235 23.0553 7.05362C22.984 7.12014 22.9084 7.18184 22.8289 7.2383C22.7481 7.29205 22.6623 7.33793 22.5728 7.37532C22.4821 7.41128 22.3884 7.43919 22.2928 7.45872C22.0963 7.50003 21.8935 7.50003 21.697 7.45872C21.5053 7.42215 21.3229 7.34717 21.1609 7.2383C21.0802 7.18336 21.0045 7.12157 20.9345 7.05362C20.8679 6.98235 20.8062 6.90672 20.7498 6.82723C20.6409 6.6652 20.5659 6.48282 20.5294 6.29106C20.4881 6.09463 20.4881 5.89175 20.5294 5.69532C20.5659 5.50356 20.6409 5.32118 20.7498 5.15915C20.8062 5.07967 20.8679 5.00404 20.9345 4.93277C21.0045 4.86482 21.0802 4.80303 21.1609 4.74808C21.3229 4.63921 21.5053 4.56423 21.697 4.52766C21.8939 4.49042 22.0959 4.49042 22.2928 4.52766C22.3884 4.54719 22.4821 4.5751 22.5728 4.61106C22.6623 4.64845 22.7481 4.69433 22.8289 4.74808C22.9923 4.8559 23.1322 4.99574 23.24 5.15915C23.3489 5.32118 23.4239 5.50356 23.4604 5.69532C23.5017 5.89175 23.5017 6.09463 23.4604 6.29106ZM18.8732 14C18.8732 14.9638 18.5874 15.906 18.0519 16.7074C17.5164 17.5088 16.7554 18.1334 15.8649 18.5022C14.9744 18.8711 13.9946 18.9676 13.0493 18.7796C12.104 18.5915 11.2357 18.1274 10.5541 17.4459C9.8726 16.7643 9.40848 15.896 9.22045 14.9507C9.03241 14.0054 9.12892 13.0256 9.49776 12.1351C9.8666 11.2447 10.4912 10.4836 11.2926 9.94809C12.094 9.41262 13.0362 9.12681 14 9.12681C15.292 9.12838 16.5306 9.64232 17.4441 10.5559C18.3577 11.4694 18.8716 12.708 18.8732 14Z" fill="#F29F04" />
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.616926 13.8321L7.05698 16.0191L22.3481 6.67105C22.5701 6.53605 22.7971 6.83705 22.6061 7.01305L11.03 17.6681L11.03 17.6681L10.6 23.6332C10.593 23.7331 10.6165 23.8328 10.6674 23.9191C10.7184 24.0053 10.7943 24.074 10.8852 24.1161C10.9761 24.1582 11.0777 24.1717 11.1764 24.1547C11.2751 24.1378 11.3664 24.0912 11.438 24.0212L15.002 20.5162L21.5181 25.4482C22.2201 25.9802 23.2371 25.6052 23.4261 24.7452L27.9631 4.14503C28.2221 2.97002 27.0701 1.97802 25.9471 2.40802L0.584925 12.1201C-0.211081 12.4251 -0.189081 13.5581 0.616926 13.8321Z" fill="#F29F04" />
  </svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5727 0.900385C16.0051 0.87851 17.427 0.889885 18.848 0.87851C18.8952 2.65563 19.6162 4.25514 20.7633 5.43989L20.7616 5.43814C21.9962 6.55026 23.6027 7.27126 25.3737 7.39376L25.3982 7.39551V11.802C23.7252 11.76 22.152 11.3741 20.7336 10.7109L20.8053 10.7406C20.1193 10.4108 19.5392 10.0721 18.988 9.69414L19.0335 9.72389C19.023 12.9168 19.044 16.1096 19.0116 19.2911C18.9215 20.9125 18.3825 22.3913 17.518 23.6259L17.5355 23.5988C16.09 25.669 13.7485 27.0279 11.0858 27.1084H11.0736C10.966 27.1136 10.8391 27.1163 10.7113 27.1163C9.1976 27.1163 7.78272 26.6945 6.57697 25.9621L6.61197 25.9823C4.41747 24.6619 2.90372 22.4026 2.62372 19.775L2.62022 19.7391C2.59835 19.1923 2.58785 18.6454 2.60972 18.1099C3.03847 13.9283 6.54197 10.6934 10.8006 10.6934C11.2792 10.6934 11.7482 10.7345 12.2041 10.8124L12.1551 10.8054C12.177 12.4233 12.1113 14.042 12.1113 15.6599C11.7412 15.526 11.3142 15.4481 10.8688 15.4481C9.23435 15.4481 7.84397 16.4929 7.32947 17.9515L7.3216 17.9778C7.20522 18.3514 7.13785 18.781 7.13785 19.2255C7.13785 19.4058 7.14922 19.5843 7.17022 19.7593L7.16847 19.7383C7.45897 21.5285 8.99372 22.8795 10.8443 22.8795C10.8977 22.8795 10.9502 22.8786 11.0027 22.876H10.9948C12.275 22.8375 13.3862 22.1489 14.0145 21.1313L14.0232 21.1155C14.2568 20.79 14.417 20.3963 14.4703 19.9684L14.4712 19.9561C14.5806 17.9988 14.5368 16.0528 14.5473 14.0954C14.5578 9.68888 14.5368 5.29288 14.5692 0.89776L14.5727 0.900385Z" fill="#F29F04" />
  </svg>
);

const ProfilePage: React.FC = () => {
  const [threadsCount, setThreadsCount] = useState(0);
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

  const avatarUrl = user?.avatar && typeof user.avatar === 'object' ? (user.avatar as any).url : null;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black pb-20">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-0 z-0 w-full h-[1000px] pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 z-[-2] w-full h-full bg-repeat opacity-40" style={{ backgroundImage: "url('/images/noise.webp')", backgroundSize: "200px 200px" }} />
        <div className="absolute inset-0 z-[-1] w-full h-full" style={{ background: "linear-gradient(82.71deg, rgba(242, 159, 4, 0.7) 0.75%, #0d0d0d 30.5%, #0d0d0d 69.72%, rgba(242, 159, 4, 0.7) 99.19%)" }} />
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image src="/images/glow-desktop.webp" alt="" fill className="object-cover" priority />
        </div>
      </div>

      <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[90px] pt-[128px] md:pt-[202.69px] flex flex-col gap-6 mx-auto">
        {/* Profile Info Section */}
        <section className="rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] p-[29.2px_40px_59.2px_40px] flex flex-col items-end relative overflow-hidden self-stretch" style={{ backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(242, 159, 4, 0.15) 0%, transparent 50%)' }}>
          <div className="flex items-center gap-[30px] relative">
            <Link href="/profile/settings" className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer">
              <EditIcon /> <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">Edit</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer">
              <ExitIcon /> <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">Exit</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6 relative">
            <div className="flex items-center gap-10">
              <div className="h-[125px] w-[125px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0 relative overflow-hidden">
                {avatarUrl ? (
                  <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}${avatarUrl}`} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="p-[37.5px]"><UserIcon /></div>
                )}
              </div>
              <div className="flex flex-col items-start gap-5">
                <h1 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px] line-clamp-1 truncate block">{displayName}</h1>
                <div className="flex items-center gap-4">
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
            <p className="text-[#BDBDBD] text-[16px] leading-[26px] font-poppins text-right [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] md:max-w-[602.81px]">
              {user?.bio || 'Description not filled in'}
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <article className="flex flex-col gap-7">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center"><span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">Team</span></div>
              <svg className="absolute left-[27px] top-[58px]" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z" fill="#F29F04" /></svg>
            </div>
            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4"><Users size={32} color="#212121" /></div>
                <span className={`text-white leading-tight font-poppins ${user?.company ? 'text-[20px]' : 'text-[28px]'}`}>
                  {user?.company || '-'}
                </span>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-7">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center"><span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">Position</span></div>
              <svg className="absolute left-[27px] top-[58px]" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z" fill="#F29F04" /></svg>
            </div>
            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4"><UserRound size={32} color="#212121" /></div>
                <span className={`text-white leading-tight font-poppins ${user?.position ? 'text-[20px]' : 'text-[28px]'}`}>
                  {user?.position || '-'}
                </span>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-7">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center"><span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">Directions</span></div>
              <svg className="absolute left-[27px] top-[58px]" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z" fill="#F29F04" /></svg>
            </div>
            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
                  <Image src="/images/profile-directions.png" width={32} height={32} alt="Directions" className="w-8 h-8 object-contain brightness-0" />
                </div>
                <span className={`text-white leading-tight font-poppins ${user?.directions ? 'text-[20px]' : 'text-[28px]'}`}>
                  {user?.directions || '-'}
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* Banner */}
        <section className="relative w-full h-[158px] rounded-[40px] overflow-hidden mt-[54px]">
          <Image src="/images/profile-banner.png" alt="Profile banner" fill className="object-cover" />
        </section>

        {/* Threads Section */}
        <section className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-[30px]">
            <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">Threads</h2>
            <div className="flex items-center gap-[10px]">
              <Pencil size={20} className="text-[#F29F04]" />
              <span className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">{threadsCount}</span>
            </div>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="h-[58px] px-6 rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] flex items-center justify-center gap-[5px] hover:bg-[#FCC660] hover:text-[#0D0D0D] transition-all">
            <Plus size={24} /> Add a comment
          </button>
        </section>
      </main>

      <CreateThreadModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
