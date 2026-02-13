"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchModal from './SearchModal';

const Header: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleUserClick = async () => {
        try {
            const response = await fetch('/api/auth/me', { cache: 'no-store' });
            const data = await response.json().catch(() => null);
            window.location.href = data?.user ? '/profile' : '/login';
        } catch {
            window.location.href = '/login';
        }
    };

    const menuItems = [
        { label: 'Blog', active: true },
        { label: 'Conferences', active: false },
        { label: 'Services', active: false },
        { label: 'Forum', active: false },
        { label: 'Partnership', active: false },
        { label: 'Jobs', active: false }
    ];

    return (
        <>
            <header className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1320px] z-50 flex justify-between items-center px-[20px] py-[32px] bg-transparent">
                {/* Logo Container */}
                <div className="flex items-center gap-[12px] shrink-0">
                    <Link href="/" className="relative w-[77px] h-[59px] block">
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
                            href={`/${item.label.toLowerCase()}`}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            className={`text-[16px] font-normal leading-[26px] transition-colors ${item.active ? 'text-white' : 'text-[#BDBDBD] hover:text-white'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Icons Container */}
                <div className="flex items-center gap-[25px]">
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
                    <button
                        onClick={handleUserClick}
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
                        {/* User Icon */}
                        <div className="absolute left-[13px] top-[13px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.6486 19.875C20.2208 17.4066 18.0205 15.6366 15.4527 14.7975C16.7229 14.0414 17.7097 12.8892 18.2617 11.5179C18.8136 10.1467 18.9002 8.63212 18.5081 7.2069C18.116 5.78167 17.2668 4.52455 16.0911 3.62862C14.9154 2.73268 13.4781 2.24745 11.9999 2.24745C10.5217 2.24745 9.08438 2.73268 7.90866 3.62862C6.73294 4.52455 5.88382 5.78167 5.49171 7.2069C5.09959 8.63212 5.18616 10.1467 5.73813 11.5179C6.29009 12.8892 7.27692 14.0414 8.54708 14.7975C5.97926 15.6356 3.77895 17.4056 2.35114 19.875C2.29878 19.9604 2.26405 20.0554 2.249 20.1544C2.23394 20.2534 2.23888 20.3544 2.2635 20.4515C2.28813 20.5486 2.33195 20.6398 2.39238 20.7196C2.45281 20.7995 2.52862 20.8664 2.61535 20.9165C2.70207 20.9666 2.79795 20.9989 2.89733 21.0113C2.99671 21.0237 3.09757 21.0161 3.19397 20.989C3.29037 20.9618 3.38034 20.9156 3.45859 20.8531C3.53684 20.7906 3.60178 20.713 3.64958 20.625C5.41583 17.5725 8.5377 15.75 11.9999 15.75C15.4621 15.75 18.584 17.5725 20.3502 20.625C20.398 20.713 20.4629 20.7906 20.5412 20.8531C20.6194 20.9156 20.7094 20.9618 20.8058 20.989C20.9022 21.0161 21.0031 21.0237 21.1024 21.0113C21.2018 20.9989 21.2977 20.9666 21.3844 20.9165C21.4712 20.8664 21.547 20.7995 21.6074 20.7196C21.6678 20.6398 21.7116 20.5486 21.7363 20.4515C21.7609 20.3544 21.7658 20.2534 21.7508 20.1544C21.7357 20.0554 21.701 19.9604 21.6486 19.875ZM6.74989 9C6.74989 7.96165 7.05779 6.94661 7.63467 6.08326C8.21155 5.2199 9.03149 4.54699 9.9908 4.14963C10.9501 3.75227 12.0057 3.6483 13.0241 3.85088C14.0425 4.05345 14.978 4.55346 15.7122 5.28769C16.4464 6.02191 16.9464 6.95737 17.149 7.97577C17.3516 8.99417 17.2476 10.0498 16.8503 11.0091C16.4529 11.9684 15.78 12.7883 14.9166 13.3652C14.0533 13.9421 13.0382 14.25 11.9999 14.25C10.608 14.2485 9.27347 13.6949 8.28922 12.7107C7.30498 11.7264 6.75138 10.3919 6.74989 9Z" fill="#F29F04" />
                            </svg>
                        </div>
                    </button>
                </div>
            </header>

            {/* Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};

export default Header;
