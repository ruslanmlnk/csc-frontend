"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';
import { BackendUser } from '@/lib/backend/users';

type AvatarShape = {
    url?: string;
};

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    const normalizedBase = BACKEND_BASE_URL.endsWith('/')
        ? BACKEND_BASE_URL.slice(0, -1)
        : BACKEND_BASE_URL;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;

    return `${normalizedBase}${normalizedPath}`;
};

const Header: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
    const accountMenuRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    const fetchCurrentUser = async (): Promise<BackendUser | null> => {
        try {
            const response = await fetch('/api/auth/me', { cache: 'no-store' });
            const data = await response.json().catch(() => null);
            return data?.user ?? null;
        } catch {
            return null;
        }
    };

    const handleAccountNavigation = async () => {
        const user = currentUser ?? await fetchCurrentUser();
        setCurrentUser(user);
        window.location.href = user ? '/profile' : '/login';
    };

    const handleDesktopUserClick = async () => {
        if (isAccountPopupOpen) {
            setIsAccountPopupOpen(false);
            return;
        }

        const user = currentUser ?? await fetchCurrentUser();
        setCurrentUser(user);

        if (!user) {
            window.location.href = '/login';
            return;
        }

        setIsAccountPopupOpen(true);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
        setCurrentUser(null);
        setIsAccountPopupOpen(false);
        window.location.href = '/login';
    };

    const menuItems = [
        {
            label: 'Blog',
            href: '/blog',
            isActive: pathname === '/blog' || pathname?.startsWith('/blog/'),
        },
        {
            label: 'Conferences',
            href: '/conferences',
            isActive: pathname === '/conferences' || pathname?.startsWith('/conferences/'),
        },
        {
            label: 'Services',
            href: '/services',
            isActive: pathname === '/services' || pathname?.startsWith('/services/'),
        },
        {
            label: 'Forum',
            href: '/forum',
            isActive: pathname === '/forum' || pathname?.startsWith('/forum/'),
        },
        {
            label: 'Partnership',
            href: '/partnerships',
            isActive:
                pathname === '/partnership' ||
                pathname?.startsWith('/partnership/') ||
                pathname === '/partnerships' ||
                pathname?.startsWith('/partnerships/'),
        },
        {
            label: 'Jobs',
            href: '/jobs',
            isActive: pathname === '/jobs' || pathname?.startsWith('/jobs/'),
        },
    ];

    useEffect(() => {
        if (!isMobileMenuOpen) {
            document.body.style.overflow = '';
            return;
        }

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        let isMounted = true;

        const loadCurrentUser = async () => {
            const user = await fetchCurrentUser();

            if (isMounted) {
                setCurrentUser(user);
            }
        };

        void loadCurrentUser();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!isAccountPopupOpen) {
            return;
        }

        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!accountMenuRef.current?.contains(target)) {
                setIsAccountPopupOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsAccountPopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isAccountPopupOpen]);

    const avatarRaw =
        typeof currentUser?.avatar === 'string'
            ? currentUser.avatar
            : currentUser?.avatar && typeof currentUser.avatar === 'object'
                ? (currentUser.avatar as AvatarShape).url || null
                : null;
    const avatarUrl = toAbsoluteMediaUrl(avatarRaw);
    const avatarAlt = currentUser?.name || currentUser?.email || 'User avatar';
    const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Profile';

    return (
        <>
            <header className="absolute top-0 left-1/2 z-50 flex w-full max-w-[1320px] -translate-x-1/2 items-center justify-between bg-transparent px-5 py-4 lg:py-[32px]">
                {/* Logo Container */}
                <div className="flex items-center gap-[12px] shrink-0">
                    <Link href="/" className="relative w-[77px] h-[58.69px] block">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain brightness-0 invert"
                            priority
                        />
                    </Link>
                </div>

                {/* Menu */}
                <nav className="hidden lg:flex items-center gap-[40px] absolute left-1/2 -translate-x-1/2 top-[48px]">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            className={`text-[16px] font-normal leading-[26px] transition-colors ${item.isActive ? 'text-white' : 'text-[#BDBDBD] hover:text-white'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Icons Container */}
                <div className="hidden items-center gap-[25px] lg:flex">
                    {/* Search Button */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="relative w-[50px] h-[50px] group cursor-pointer border-none bg-transparent p-0 outline-none"
                    >
                        {/* Background Circle with Gradient Strokes */}
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-[#262626]">
                            <circle cx="25" cy="25" r="25" fill="currentColor" />
                            <circle cx="25" cy="25" r="24.5" stroke="url(#paint0_linear_search)" strokeOpacity="0.8" />
                            <circle cx="25" cy="25" r="24.5" stroke="url(#paint1_linear_search)" strokeOpacity="0.8" />
                            <defs>
                                <linearGradient id="paint0_linear_search" x1="22.6711" y1="-34.0703" x2="47.9897" y2="-23.9339" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="paint1_linear_search" x1="32.5043" y1="75.5217" x2="9.51162" y2="64.5383" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Search Icon */}
                        <div className="absolute left-[13px] top-[13px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.5306 20.4694L16.8365 15.7763C18.1971 14.1429 18.8755 12.0478 18.7307 9.92694C18.5859 7.80607 17.629 5.82268 16.0591 4.38935C14.4892 2.95602 12.4271 2.18311 10.3019 2.23141C8.17663 2.27971 6.15181 3.1455 4.64864 4.64867C3.14547 6.15184 2.27968 8.17666 2.23138 10.3019C2.18308 12.4272 2.95599 14.4892 4.38932 16.0591C5.82265 17.629 7.80604 18.5859 9.92691 18.7307C12.0478 18.8755 14.1428 18.1971 15.7762 16.8366L20.4693 21.5306C20.539 21.6003 20.6218 21.6556 20.7128 21.6933C20.8038 21.731 20.9014 21.7504 21 21.7504C21.0985 21.7504 21.1961 21.731 21.2871 21.6933C21.3782 21.6556 21.4609 21.6003 21.5306 21.5306C21.6003 21.4609 21.6556 21.3782 21.6933 21.2872C21.731 21.1961 21.7504 21.0985 21.7504 21C21.7504 20.9015 21.731 20.8039 21.6933 20.7128C21.6556 20.6218 21.6003 20.5391 21.5306 20.4694ZM3.74997 10.5C3.74997 9.16498 4.14585 7.85993 4.88755 6.7499C5.62925 5.63987 6.68346 4.77471 7.91686 4.26381C9.15026 3.75292 10.5075 3.61925 11.8168 3.8797C13.1262 4.14015 14.3289 4.78303 15.2729 5.72703C16.2169 6.67103 16.8598 7.87377 17.1203 9.18314C17.3807 10.4925 17.2471 11.8497 16.7362 13.0831C16.2253 14.3165 15.3601 15.3707 14.2501 16.1124C13.14 16.8541 11.835 17.25 10.5 17.25C8.71037 17.248 6.99463 16.5362 5.72919 15.2708C4.46375 14.0053 3.75196 12.2896 3.74997 10.5Z" fill="#9E9E9E" />
                            </svg>
                        </div>
                    </button>

                    {/* User Button */}
                    <div ref={accountMenuRef} className="relative">
                        <button
                            onClick={() => { void handleDesktopUserClick(); }}
                            aria-expanded={isAccountPopupOpen}
                            aria-haspopup="menu"
                            className="relative w-[50px] h-[50px] group cursor-pointer border-none bg-transparent p-0 outline-none"
                        >
                            {/* Background Circle with Gradient Strokes */}
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                                <circle cx="25" cy="25" r="25" fill="#F29F04" fillOpacity="0.08" />
                                <circle cx="25" cy="25" r="24.5" stroke="url(#paint0_linear_user)" strokeOpacity="0.8" />
                                <circle cx="25" cy="25" r="24.5" stroke="url(#paint1_linear_user)" strokeOpacity="0.8" />
                                <defs>
                                    <linearGradient id="paint0_linear_user" x1="22.6711" y1="-34.0703" x2="47.9897" y2="-23.9339" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F29F04" />
                                        <stop offset="1" stopColor="#F29F04" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_user" x1="32.5043" y1="75.5217" x2="9.51162" y2="64.5383" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F29F04" />
                                        <stop offset="1" stopColor="#F29F04" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {avatarUrl ? (
                                <div className="absolute inset-[1px] overflow-hidden rounded-full">
                                    <Image src={avatarUrl} alt={avatarAlt} fill sizes="50px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="absolute left-[13px] top-[13px]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.6486 19.875C20.2208 17.4066 18.0205 15.6366 15.4527 14.7975C16.7229 14.0414 17.7097 12.8892 18.2617 11.5179C18.8136 10.1467 18.9002 8.63212 18.5081 7.2069C18.116 5.78167 17.2668 4.52455 16.0911 3.62862C14.9154 2.73268 13.4781 2.24745 11.9999 2.24745C10.5217 2.24745 9.08438 2.73268 7.90866 3.62862C6.73294 4.52455 5.88382 5.78167 5.49171 7.2069C5.09959 8.63212 5.18616 10.1467 5.73813 11.5179C6.29009 12.8892 7.27692 14.0414 8.54708 14.7975C5.97926 15.6356 3.77895 17.4056 2.35114 19.875C2.29878 19.9604 2.26405 20.0554 2.249 20.1544C2.23394 20.2534 2.23888 20.3544 2.2635 20.4515C2.28813 20.5486 2.33195 20.6398 2.39238 20.7196C2.45281 20.7995 2.52862 20.8664 2.61535 20.9165C2.70207 20.9666 2.79795 20.9989 2.89733 21.0113C2.99671 21.0237 3.09757 21.0161 3.19397 20.989C3.29037 20.9618 3.38034 20.9156 3.45859 20.8531C3.53684 20.7906 3.60178 20.713 3.64958 20.625C5.41583 17.5725 8.5377 15.75 11.9999 15.75C15.4621 15.75 18.584 17.5725 20.3502 20.625C20.398 20.713 20.4629 20.7906 20.5412 20.8531C20.6194 20.9156 20.7094 20.9618 20.8058 20.989C20.9022 21.0161 21.0031 21.0237 21.1024 21.0113C21.2018 20.9989 21.2977 20.9666 21.3844 20.9165C21.4712 20.8664 21.547 20.7995 21.6074 20.7196C21.6678 20.6398 21.7116 20.5486 21.7363 20.4515C21.7609 20.3544 21.7658 20.2534 21.7508 20.1544C21.7357 20.0554 21.701 19.9604 21.6486 19.875ZM6.74989 9C6.74989 7.96165 7.05779 6.94661 7.63467 6.08326C8.21155 5.2199 9.03149 4.54699 9.9908 4.14963C10.9501 3.75227 12.0057 3.6483 13.0241 3.85088C14.0425 4.05345 14.978 4.55346 15.7122 5.28769C16.4464 6.02191 16.9464 6.95737 17.149 7.97577C17.3516 8.99417 17.2476 10.0498 16.8503 11.0091C16.4529 11.9684 15.78 12.7883 14.9166 13.3652C14.0533 13.9421 13.0382 14.25 11.9999 14.25C10.608 14.2485 9.27347 13.6949 8.28922 12.7107C7.30498 11.7264 6.75138 10.3919 6.74989 9Z" fill="#F29F04" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {isAccountPopupOpen && currentUser ? (
                            <div className="absolute right-0 top-[60px] z-[90] flex w-[240px] flex-col overflow-hidden rounded-[16px] border border-[#2D2D2D] bg-[#1A1A1A]">
                                <div className="flex items-center gap-[15px] border-b border-[#2D2D2D] px-4 py-[14px]">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-[0.656px] border-[#F29F04]">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt={avatarAlt} fill sizes="40px" className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#262626]">
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M21.1426 25C20.6032 25 20.166 24.5628 20.166 24.0234C20.166 20.2002 17.0556 17.0898 13.2324 17.0898H11.7676C7.94438 17.0898 4.83398 20.2002 4.83398 24.0234C4.83398 24.5628 4.39678 25 3.85742 25C3.31807 25 2.88086 24.5628 2.88086 24.0234C2.88086 19.1233 6.86743 15.1367 11.7676 15.1367H13.2324C18.1326 15.1367 22.1191 19.1233 22.1191 24.0234C22.1191 24.5628 21.6819 25 21.1426 25ZM12.4023 13.1836C8.76763 13.1836 5.81055 10.2265 5.81055 6.5918C5.81055 2.95708 8.76763 0 12.4023 0C16.0371 0 18.9941 2.95708 18.9941 6.5918C18.9941 10.2265 16.0371 13.1836 12.4023 13.1836ZM12.4023 1.95312C9.84458 1.95312 7.76367 4.03403 7.76367 6.5918C7.76367 9.14956 9.84458 11.2305 12.4023 11.2305C14.9601 11.2305 17.041 9.14956 17.041 6.5918C17.041 4.03403 14.9601 1.95312 12.4023 1.95312Z" fill="#F29F04" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-poppins text-[16px] font-normal leading-[26px] text-[#BDBDBD]">
                                        {displayName}
                                    </span>
                                </div>

                                <Link
                                    href="/profile"
                                    onClick={() => setIsAccountPopupOpen(false)}
                                    className="flex items-center gap-[10px] border-b border-[#2D2D2D] px-4 py-[14px] transition-colors hover:bg-[#262626]"
                                >
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.1426 25C20.6032 25 20.166 24.5628 20.166 24.0234C20.166 20.2002 17.0556 17.0898 13.2324 17.0898H11.7676C7.94438 17.0898 4.83398 20.2002 4.83398 24.0234C4.83398 24.5628 4.39678 25 3.85742 25C3.31807 25 2.88086 24.5628 2.88086 24.0234C2.88086 19.1233 6.86743 15.1367 11.7676 15.1367H13.2324C18.1326 15.1367 22.1191 19.1233 22.1191 24.0234C22.1191 24.5628 21.6819 25 21.1426 25ZM12.4023 13.1836C8.76763 13.1836 5.81055 10.2265 5.81055 6.5918C5.81055 2.95708 8.76763 0 12.4023 0C16.0371 0 18.9941 2.95708 18.9941 6.5918C18.9941 10.2265 16.0371 13.1836 12.4023 13.1836ZM12.4023 1.95312C9.84458 1.95312 7.76367 4.03403 7.76367 6.5918C7.76367 9.14956 9.84458 11.2305 12.4023 11.2305C14.9601 11.2305 17.041 9.14956 17.041 6.5918C17.041 4.03403 14.9601 1.95312 12.4023 1.95312Z" fill="#F29F04" />
                                    </svg>
                                    <span className="font-poppins text-[16px] font-normal leading-[26px] text-[#BDBDBD]">
                                        Profile
                                    </span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => { void handleLogout(); }}
                                    className="flex items-center gap-[10px] px-4 py-[14px] text-left transition-colors hover:bg-[#262626]"
                                >
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.5913 15.6362L20.8713 19.3563C20.7021 19.5228 20.4739 19.6157 20.2365 19.6148C19.9991 19.6138 19.7716 19.5191 19.6037 19.3512C19.4358 19.1834 19.3411 18.956 19.3401 18.7185C19.3391 18.4811 19.4319 18.2529 19.5984 18.0836L21.7671 15.9149H12.42C12.1813 15.9149 11.9524 15.8201 11.7836 15.6513C11.6148 15.4826 11.52 15.2536 11.52 15.0149C11.52 14.7763 11.6148 14.5473 11.7836 14.3786C11.9524 14.2098 12.1813 14.1149 12.42 14.1149H21.7971L19.5984 11.9162C19.4319 11.747 19.3391 11.5188 19.3401 11.2814C19.3411 11.0439 19.4358 10.8165 19.6037 10.6487C19.7716 10.4808 19.9991 10.3861 20.2365 10.3851C20.4739 10.3842 20.7021 10.4771 20.8713 10.6436L24.5913 14.3636C24.76 14.5324 24.8548 14.7613 24.8548 14.9999C24.8548 15.2386 24.76 15.4675 24.5913 15.6362Z" fill="#F29F04" />
                                        <path d="M16.6645 26.5311H7.54453C6.90821 26.5304 6.29813 26.2774 5.84818 25.8274C5.39823 25.3775 5.14517 24.7674 5.14453 24.1311V5.86887C5.14517 5.23255 5.39823 4.62247 5.84818 4.17252C6.29813 3.72257 6.90821 3.46951 7.54453 3.46887H16.6645C16.9032 3.46887 17.1321 3.56369 17.3009 3.73248C17.4697 3.90126 17.5645 4.13018 17.5645 4.36887C17.5645 4.60757 17.4697 4.83649 17.3009 5.00527C17.1321 5.17405 16.9032 5.26887 16.6645 5.26887H7.54453C7.3854 5.26887 7.23279 5.33209 7.12027 5.44461C7.00775 5.55713 6.94453 5.70974 6.94453 5.86887V24.1311C6.94453 24.2902 7.00775 24.4428 7.12027 24.5553C7.23279 24.6679 7.3854 24.7311 7.54453 24.7311H16.6645C16.9032 24.7311 17.1321 24.8259 17.3009 24.9947C17.4697 25.1635 17.5645 25.3924 17.5645 25.6311C17.5645 25.8698 17.4697 26.0987 17.3009 26.2675C17.1321 26.4363 16.9032 26.5311 16.6645 26.5311Z" fill="#F29F04" />
                                    </svg>
                                    <span className="font-poppins text-[16px] font-normal leading-[26px] text-[#BDBDBD]">
                                        Exit
                                    </span>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Mobile Burger */}
                <button
                    type="button"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex h-8 w-8 items-center justify-center lg:hidden"
                >
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.4853 20.4852C20.2977 20.6727 20.0434 20.7781 19.7782 20.7781C19.513 20.7781 19.2586 20.6727 19.0711 20.4852L12 13.4141L4.92893 20.4852C4.7414 20.6727 4.48704 20.7781 4.22183 20.7781C3.95661 20.7781 3.70226 20.6727 3.51472 20.4852C3.32718 20.2976 3.22183 20.0433 3.22183 19.7781C3.22183 19.5128 3.32718 19.2585 3.51472 19.071L10.5858 11.9999L3.51472 4.92882C3.32718 4.74129 3.22182 4.48693 3.22183 4.22172C3.22183 3.9565 3.32718 3.70215 3.51472 3.51461C3.70225 3.32707 3.95661 3.22172 4.22182 3.22172C4.48704 3.22172 4.7414 3.32707 4.92893 3.51461L12 10.5857L19.0711 3.51461C19.2586 3.32707 19.513 3.22172 19.7782 3.22172C20.0434 3.22172 20.2977 3.32707 20.4853 3.51461C20.6728 3.70215 20.7782 3.9565 20.7782 4.22172C20.7782 4.48693 20.6728 4.74129 20.4853 4.92882L13.4142 11.9999L20.4853 19.071C20.6728 19.2585 20.7782 19.5128 20.7782 19.7781C20.7782 20.0433 20.6728 20.2976 20.4853 20.4852Z" fill="white" />
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.33398 8H26.6673M5.33398 16H26.6673M5.33398 24H26.6673" stroke="white" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </header>

            {isMobileMenuOpen ? (
                <div
                    className="fixed inset-0 z-[80] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div className="absolute inset-0 bg-[rgba(0,0,0,0.78)]" />
                    <div className="absolute left-5 right-5 top-[92px]" onClick={(event) => event.stopPropagation()}>
                        <div className="rounded-[32px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-6 shadow-2xl">
                            <nav className="flex flex-col gap-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`rounded-[14px] px-4 py-3 font-poppins text-[18px] font-medium leading-[28px] transition-colors ${item.isActive
                                            ? 'bg-[rgba(242,159,4,0.16)] text-white'
                                            : 'text-[#BDBDBD] hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsSearchOpen(true);
                                    }}
                                    className="rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#262626] px-4 py-3 font-poppins text-[16px] font-medium leading-[26px] text-white"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        void handleAccountNavigation();
                                    }}
                                    className="rounded-[80px] bg-[#F29F04] px-4 py-3 font-poppins text-[16px] font-medium leading-[26px] text-[#0D0D0D]"
                                >
                                    Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};

export default Header;
