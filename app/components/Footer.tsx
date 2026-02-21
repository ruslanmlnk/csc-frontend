"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  const menuItems = [
    { label: 'Agency', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Conferences', href: '/conferences' },
    { label: 'Services', href: '/services' },
    { label: 'Forum', href: '/forum' },
    { label: 'Partnership', href: '/partnerships' },
    { label: 'Jobs', href: '/jobs' },
  ];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-[1280px] mx-auto flex flex-col justify-center items-center gap-[32px] bg-[#0D0D0D] px-5 pb-[32px] relative lg:border-t lg:border-[#666]">
      <div className="flex flex-col lg:flex-row items-start lg:justify-between self-stretch pt-[80px] pb-[56px] gap-[80px] border-y-[0.5px] border-[#666] lg:py-[120px] lg:pb-[56px] lg:gap-0 lg:border-y-0 lg:border-b lg:border-[#666]">
        {/* Logo Section */}
        <div className="flex flex-col items-start gap-[56px] self-stretch lg:self-auto">
          <Link href="/" className="block">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={180}
              height={60}
              className="h-[60px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Menu Section */}
        <nav className="flex flex-col items-start gap-[40px] self-stretch lg:self-auto lg:flex-row lg:justify-center lg:items-center lg:gap-[40px]">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white font-['Poppins'] text-[20px] font-normal leading-[32px] hover:text-[#F29F04] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Copyright Section */}
      <div className="text-[#BDBDBD] text-center font-['Poppins'] text-[16px] font-normal leading-[26px] opacity-70">
        <span className="lg:hidden">
          &copy; {currentYear}, InferraMedia Corporation.
          <br />
          All Rights Reserved.
        </span>
        <span className="hidden lg:inline">&copy; {currentYear}, ClickStorm Corporation. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
