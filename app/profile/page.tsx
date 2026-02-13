"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { LogOut, Pencil, Plus, UserRound, Users, FileText } from 'lucide-react';

type MeResponse = {
  user?: {
    email?: string;
  } | null;
};

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
    <div
      className="min-h-screen w-full text-white font-poppins selection:bg-[#F29F04] selection:text-black pb-20"
      style={{
        background: `url('/images/profile-bg-pattern.png') lightgray 0% 0% / 100px 100px repeat, linear-gradient(86deg, rgba(242, 159, 4, 0.70) -1.57%, #0D0D0D 29.57%, #0D0D0D 70.61%, rgba(242, 159, 4, 0.70) 101.45%)`,
        backgroundBlendMode: 'soft-light, normal'
      }}
    >
      <main className="relative z-10 w-full max-w-[1280px] px-5 pb-[90px] pt-[128px] md:pt-[202.69px] flex flex-col gap-6 mx-auto">
        {/* Profile Info Section */}
        <section className="rounded-[40px] border border-[#F29F04] bg-[#1A1A1A] p-[30px_40px_60px_40px] flex flex-col items-end gap-6 relative overflow-hidden">
          <div className="flex items-center gap-[30px]">
            <button className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors">
              <Pencil size={30} className="text-[#F29F04]" />
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
                Edit
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[10px] text-[#BDBDBD] group transition-colors"
            >
              <LogOut size={30} className="text-[#F29F04]" />
              <span className="text-[16px] leading-[26px] font-poppins font-normal group-hover:text-white transition-colors [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
                Exit
              </span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
            <div className="flex items-center gap-10">
              <div className="h-[125px] w-[125px] rounded-full bg-[#262626] border border-white/50 flex items-center justify-center shrink-0">
                <UserRound size={50} className="text-[#BDBDBD]" />
              </div>
              <h1 className="text-white font-poppins text-[32px] font-medium leading-[40px] tracking-[-0.64px]">
                {formattedName}
              </h1>
            </div>
            <p className="text-[#BDBDBD] text-[16px] leading-[26px] font-poppins text-right [text-shadow:0_4px_4px_rgba(0,0,0,0.4)]">
              Description not filled in
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L5.24537e-07 0L15.9882 6.98865e-07L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0">
                  <Users size={32} className="text-[#212121]" />
                </div>
                <span className="text-white text-[28px] leading-none font-poppins">-</span>
              </div>
            </div>
          </article>

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
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L5.24537e-07 0L15.9882 6.98865e-07L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0">
                  <FileText size={32} className="text-[#212121]" />
                </div>
                <span className="text-white text-[28px] leading-none font-poppins">-</span>
              </div>
            </div>
          </article>

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
                  d="M9.5929 11.0769C8.88231 12.3077 7.10585 12.3077 6.39526 11.0769L5.24537e-07 0L15.9882 6.98865e-07L9.5929 11.0769Z"
                  fill="#F29F04"
                />
              </svg>
            </div>

            <div className="rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 h-full min-h-[110px] flex items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[18.286px] bg-[#F29F04] flex items-center justify-center shrink-0 p-4">
                  <Image
                    src="/images/directions-icon.png"
                    width={32}
                    height={32}
                    alt="Directions"
                    className="w-8 h-8 object-contain"
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
