"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { LogOut, Pencil, Plus, UserRound, Users, FileText } from 'lucide-react';

type MeResponse = {
  user?: {
    email?: string;
  } | null;
};

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

const ProfilePage: React.FC = () => {
  const [threadsCount, setThreadsCount] = useState(0);
  const [displayName, setDisplayName] = useState('Mellaile');

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const data: MeResponse = await response.json().catch(() => ({ user: null }));

        if (!mounted) return;

        const email = data?.user?.email;

        if (!email) {
          window.location.href = '/login';
          return;
        }

        const nameFromEmail = email.split('@')[0]?.trim();
        if (nameFromEmail) {
          setDisplayName(nameFromEmail);
        }
      } catch {
        if (mounted) {
          window.location.href = '/login';
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const formattedName = useMemo(() => {
    if (!displayName) return 'Member';
    return displayName;
  }, [displayName]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    window.location.href = '/login';
  };

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black pb-20">
      {/* Background Glow Logic from /login */}
      <div className="absolute inset-x-0 top-0 z-0 w-full h-[1000px] pointer-events-none select-none overflow-hidden">
        <div
          className="absolute inset-0 z-[-2] w-full h-full bg-repeat opacity-40"
          style={{ backgroundImage: "url('/images/noise.webp')", backgroundSize: "200px 200px" }}
        />
        <div
          className="absolute inset-0 z-[-1] w-full h-full"
          style={{
            background: "linear-gradient(82.71deg, rgba(242, 159, 4, 0.7) 0.75%, #0d0d0d 30.5%, #0d0d0d 69.72%, rgba(242, 159, 4, 0.7) 99.19%)"
          }}
        />
        {/* Mobile Glow */}
        <div className="md:hidden absolute inset-0 w-full h-full">
          <Image src="/images/glow-mobile.webp" alt="" fill className="object-cover" priority />
        </div>
        {/* Desktop Glow */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image src="/images/glow-desktop.webp" alt="" fill className="object-cover" priority />
        </div>
      </div>
      <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[90px] pt-[128px] md:pt-[202.69px] flex flex-col gap-6 mx-auto">
        {/* Profile Info Section */}
        <section
          className="rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] p-[29.2px_40px_59.2px_40px] flex flex-col items-end relative overflow-hidden self-stretch"
          style={{
            backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(242, 159, 4, 0. 15) 0%, transparent 50%)'
          }}
        >
          {/* Top Row: Action Buttons */}
          <div className="flex items-center gap-[30px] relative">
            <button className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer">
              <EditIcon />
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
                Edit
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors cursor-pointer"
            >
              <ExitIcon />
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
                Exit
              </span>
            </button>
          </div>

          {/* Bottom Row: Profile Details */}
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6 relative">
            <div className="flex items-center gap-10">
              {/* Avatar */}
              <div className="h-[125px] w-[125px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0 relative overflow-hidden p-[37.5px]">
                <UserIcon />
              </div>

              {/* Name */}
              <div className="flex flex-col items-start gap-5">
                <h1 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px] line-clamp-1 truncate block">
                  {formattedName}
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#BDBDBD] text-[16px] leading-[26px] font-poppins text-right [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] max-w-sm">
              Description not filled in
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Team Card */}
          <article className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center">
                <span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">
                  Team
                </span>
              </div>
              <svg
                className="absolute left-[27px] top-[58px]"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1556 16.9137H13.8444C12.4344 16.9153 11.0826 17.4761 10.0855 18.4732C9.08849 19.4702 8.52765 20.822 8.52606 22.2321V24.3579C8.52638 24.6296 8.63448 24.8901 8.82665 25.0822C9.01882 25.2743 9.27935 25.3823 9.55106 25.3825H22.4492C22.721 25.3823 22.9815 25.2743 23.1737 25.0822C23.3658 24.8901 23.4739 24.6296 23.4743 24.3579V22.2321C23.4727 20.822 22.9118 19.4701 21.9147 18.473C20.9176 17.476 19.5657 16.9152 18.1556 16.9137ZM21.9145 23.8231H10.0855V22.2321C10.0866 21.2355 10.483 20.28 11.1877 19.5754C11.8924 18.8707 12.8479 18.4743 13.8444 18.4732H18.1556C19.1521 18.4743 20.1076 18.8707 20.8123 19.5754C21.517 20.28 21.9134 21.2355 21.9145 22.2321V23.8231ZM16 15.5604C16.8844 15.5604 17.7489 15.2982 18.4842 14.8069C19.2196 14.3155 19.7927 13.6172 20.1311 12.8001C20.4696 11.983 20.5581 11.084 20.3856 10.2166C20.213 9.3492 19.7872 8.55246 19.1618 7.92711C18.5365 7.30176 17.7397 6.87589 16.8723 6.70335C16.005 6.53082 15.1059 6.61937 14.2888 6.95781C13.4718 7.29624 12.7734 7.86937 12.2821 8.6047C11.7907 9.34004 11.5285 10.2046 11.5285 11.0889C11.5298 12.2744 12.0014 13.411 12.8397 14.2493C13.6779 15.0876 14.8145 15.5591 16 15.5604ZM16 8.17693C16.576 8.17693 17.139 8.34772 17.6179 8.66771C18.0967 8.98769 18.47 9.4425 18.6904 9.97461C18.9108 10.5067 18.9685 11.0922 18.8561 11.6571C18.7437 12.222 18.4664 12.7409 18.0591 13.1482C17.6519 13.5554 17.133 13.8328 16.5681 13.9451C16.0032 14.0575 15.4177 13.9998 14.8856 13.7794C14.3535 13.559 13.8987 13.1857 13.5787 12.7068C13.2587 12.2279 13.0879 11.6649 13.0879 11.0889C13.0888 10.3169 13.3959 9.57672 13.9419 9.0308C14.4878 8.48489 15.228 8.17781 16 8.17693" fill="#212121" />
                    <path d="M5.01506 17.5721H7.58575C8.00754 17.5713 8.42586 17.6482 8.81987 17.7987C9.01215 17.8688 9.2243 17.8605 9.41052 17.7756C9.59674 17.6907 9.7421 17.5359 9.81523 17.3448C9.88836 17.1536 9.8834 16.9414 9.80141 16.7539C9.71942 16.5663 9.56699 16.4186 9.377 16.3424C8.80517 16.1237 8.19799 16.0119 7.58575 16.0128H5.01506C3.68549 16.0143 2.4108 16.5431 1.47063 17.4833C0.530455 18.4234 0.00157149 19.698 0 21.0276L0 21.7625C0.0003143 22.0398 0.110592 22.3056 0.30664 22.5016C0.502688 22.6977 0.768496 22.8079 1.04575 22.8082H6.677C6.77998 22.8092 6.88213 22.7897 6.97753 22.7509C7.07294 22.7121 7.15973 22.6549 7.23287 22.5824C7.30602 22.5099 7.36408 22.4236 7.40371 22.3285C7.44333 22.2335 7.46373 22.1315 7.46373 22.0285C7.46373 21.9255 7.44333 21.8236 7.40371 21.7285C7.36408 21.6335 7.30602 21.5472 7.23287 21.4747C7.15973 21.4022 7.07294 21.3449 6.97753 21.3061C6.88213 21.2674 6.77998 21.2479 6.677 21.2488H1.55944V21.0274C1.56053 20.1113 1.92496 19.233 2.57279 18.5852C3.22061 17.9375 4.09893 17.5731 5.01506 17.5721ZM6.30044 15.3646C7.00802 15.3646 7.69972 15.1547 8.28806 14.7616C8.87640 14.3685 9.33495 13.8098 9.60573 13.1560C9.87651 12.5023 9.94736 11.7830 9.80932 11.0890C9.67128 10.3950 9.33054 9.75751 8.83020 9.25717C8.32986 8.75683 7.69239 8.41609 6.99840 8.27805C6.30441 8.14001 5.58507 8.21086 4.93134 8.48164C4.27761 8.75242 3.71887 9.21097 3.32575 9.79931C2.93264 10.3876 2.72281 11.0793 2.72281 11.7869C2.72389 12.7354 3.10116 13.6448 3.77186 14.3155C4.44256 14.9862 5.35192 15.3635 6.30044 15.3646ZM6.30044 9.76881C6.69960 9.76881 7.08980 9.88717 7.42169 10.1089" fill="#212121" />
                    <path d="M26.9849 16.0125H24.4142C23.802 16.0116 23.1948 16.1234 22.623 16.3421C22.433 16.4182 22.2806 16.566 22.1986 16.7535C22.1166 16.9411 22.1116 17.1533 22.1848 17.3445C22.2579 17.5356 22.4033 17.6904 22.5895 17.7753C22.7757 17.8602 22.9878 17.8685 23.1801 17.7984C23.5741 17.6478 23.9925 17.571 24.4142 17.5717H26.9849C27.9011 17.5728 28.7794 17.9372 29.4273 18.585C30.0751 19.2328 30.4395 20.1111 30.4406 21.0273V21.2487H25.3232C25.2203 21.2478 25.1181 21.2673 25.0227 21.306C24.9273 21.3448 24.8405 21.4021 24.7674 21.4746C24.6942 21.5471 24.6362 21.6333 24.5965 21.7284C24.5569 21.8235 24.5365 21.9254 24.5365 22.0284C24.5365 22.1314 24.5569 22.2334 24.5965 22.3284C24.6362 22.4235 24.6942 22.5097 24.7674 22.5822C24.8405 22.6547 24.9273 22.712 25.0227 22.7508C25.1181 22.7896 25.2203 22.809 25.3232 22.8081H30.9545C31.2317 22.8077 31.4974 22.6975 31.6934 22.5014C31.8894 22.3054 31.9997 22.0397 32 21.7625V21.0276C31.9985 19.698 31.4697 18.4233 30.5295 17.4831C29.5893 16.5429 28.3146 16.014 26.9849 16.0125ZM25.6996 15.3646C26.4072 15.3646 27.0988 15.1547 27.6872 14.7616C28.2755 14.3685 28.7341 13.8098 29.0049 13.1560C29.2756 12.5023 29.3465 11.7830 29.2084 11.0890C29.0704 10.3950 28.7297 9.75751 28.2293 9.25717C27.7290 8.75683 27.0915 8.41609 26.3975 8.27805C25.7035 8.14001 24.9842 8.21086 24.3305 8.48164C23.6767 8.75242 23.1180 9.21097 22.7249 9.79931C22.3318 10.3876 22.1219 11.0793 22.1219 11.7869C22.1230 12.7354 22.5003 13.6448 23.1710 14.3155C23.8417 14.9862 24.7510 15.3635 25.6996 15.3646ZM25.6996 9.76881" fill="#212121" />
                  </svg>
                </div>
                <span className="text-white text-[28px] leading-none font-poppins">-</span>
              </div>
            </div>
          </article>

          {/* Position Card */}
          <article className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center">
                <span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">
                  Position
                </span>
              </div>
              <svg
                className="absolute left-[27px] top-[58px]"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.3168 31.9848H3.82692C2.81921 31.9848 1.85277 31.5845 1.14021 30.8719C0.427655 30.1594 0.0273438 29.1929 0.0273438 28.1852L0.0273438 3.79957C0.0273438 2.79186 0.427655 1.82543 1.14021 1.11287C1.85277 0.400311 2.81921 0 3.82692 0L21.4189 0C22.4266 0 23.3931 0.400311 24.1056 1.11287C24.8182 1.82543 25.2185 2.79186 25.2185 3.79957V12.9185C25.2297 13.0376 25.216 13.1577 25.1781 13.2711C25.1403 13.3845 25.0792 13.4888 24.9987 13.5772C24.9182 13.6656 24.8202 13.7363 24.7108 13.7846C24.6014 13.833 24.4832 13.8579 24.3636 13.8579C24.244 13.8579 24.1258 13.833 24.0164 13.7846C23.9071 13.7363 23.809 13.6656 23.7285 13.5772C23.648 13.4888 23.5869 13.3845 23.5491 13.2711C23.5112 13.1577 23.4975 13.0376 23.5087 12.9185V3.79957C23.5087 3.52849 23.4552 3.26008 23.3512 3.00973C23.2472 2.75938 23.0949 2.53202 22.9028 2.34069C22.7108 2.14936 22.4829 1.99782 22.2322 1.89478C21.9814 1.79173 21.7128 1.7392 21.4417 1.7402H3.82692C3.55456 1.73719 3.28432 1.78823 3.03183 1.89037C2.77934 1.99251 2.54961 2.14373 2.35596 2.33526C2.16231 2.52679 2.00858 2.75483 1.90366 3.00619C1.79875 3.25754 1.74473 3.5272 1.74475 3.79957V28.208C1.74473 28.4804 1.79875 28.7501 1.90366 29.0014C2.00858 29.2528 2.16231 29.4808 2.35596 29.6723C2.54961 29.8639 2.77934 30.0151 3.03183 30.1172C3.28432 30.2194 3.55456 30.2704 3.82692 30.2674H15.3168C15.5446 30.2674 15.763 30.3579 15.924 30.5189C16.0851 30.6799 16.1755 30.8984 16.1755 31.1261C16.1755 31.3538 16.0851 31.5723 15.924 31.7333C15.763 31.8943 15.5446 31.9848 15.3168 31.9848Z" fill="#212121" />
                  </svg>
                </div>
                <span className="text-white text-[28px] leading-none font-poppins">-</span>
              </div>
            </div>
          </article>

          {/* Directions Card */}
          <article className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="h-[58px] w-full rounded-[80px] bg-[#F29F04] px-6 flex items-center">
                <span className="font-poppins text-[16px] leading-[26px] font-medium text-[#0D0D0D]">
                  Directions
                </span>
              </div>
              <svg
                className="absolute left-[27px] top-[58px]"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L0 0L15.9882 0L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/349e72cf1034ce07ead426b12ed300b1573dfff2?width=64"
                    width={32}
                    height={32}
                    alt="Directions"
                    className="w-8 h-8 object-contain brightness-0"
                  />
                </div>
                <span className="text-white text-[28px] leading-none font-poppins">-</span>
              </div>
            </div>
          </article>

        </section>

        {/* Banner Section */}
        <section className="relative w-full h-[158px] rounded-[40px] overflow-hidden border border-[#1f1f1f]">
          <Image
            src="/images/profile-banner.png"
            alt="Profile banner"
            fill
            className="object-cover"
          />
        </section>

        {/* Threads Section */}
        <section className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-[30px]">
            <h2 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">
              Threads
            </h2>
            <div className="flex items-center gap-[10px]">
              <Pencil size={20} className="text-[#F29F04]" />
              <span className="text-[#F29F04] font-poppins text-[20px] font-medium leading-[32px]">
                {threadsCount}
              </span>
            </div>
          </div>

          <button
            onClick={() => setThreadsCount((prev) => prev + 1)}
            className="h-[58px] px-6 rounded-[80px] border border-[#FCC660] text-[#FCC660] font-poppins text-[16px] font-medium leading-[26px] flex items-center justify-center gap-[5px] hover:bg-[#FCC660] hover:text-[#0D0D0D] transition-all"
          >
            <Plus size={24} />
            Add a comment
          </button>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
