"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  const menuItems = ['Agency', 'Blog', 'Conferences', 'Services', 'Forum', 'Partnership', 'Jobs'];

  return (
    <footer className="w-full max-w-[1280px] mx-auto flex flex-col justify-center items-center gap-[32px] bg-[#0D0D0D] px-5 relative border-t border-[#666]">
      <div className="flex justify-between items-start self-stretch py-[120px] pb-[56px] border-b border-[#666]">
        {/* Logo Section */}
        <div className="flex flex-col items-start gap-[56px]">
          <Link href="/" className="relative w-[89px] h-[68px]">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Menu Section */}
        <nav className="flex justify-center items-center gap-[40px]">
          {menuItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-white font-['Poppins'] text-[20px] font-normal leading-[32px] hover:text-[#F29F04] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {/* Copyright Section */}
      <div className="text-[#BDBDBD] text-center font-['Poppins'] text-[16px] font-normal leading-[26px] opacity-70">
        © 2025, СlickStorm Corporation. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;