// app/components/Navbar.tsx (Next.js)
'use client';

import React from 'react';
import { Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Next.js 13+ useRouter replacement

const Navbar: React.FC = () => {
  const pathname = usePathname(); // поточний шлях

  const navLinks = [
    { name: 'Blog', path: '/blog', active: pathname === '/blog' },
    { name: 'Conferences', path: '/conferences', active: pathname === '/conferences' },
    { name: 'Services', path: '/services', active: pathname === '/services' },
    { name: 'Forum', path: '/forum', active: pathname === '/forum' },
    { name: 'Partnership', path: '/partnership/detail', active: pathname?.includes('partnership') },
    { name: 'Jobs', path: '/jobs', active: pathname === '/jobs' },
  ];

  return (
    <nav className="flex w-full max-w-[1320px] mx-auto items-center justify-between px-[20px] py-8 relative z-50 bg-[#0D0D0D]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5L20 25L30 5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="15" r="3" fill="#F29F04" />
        </svg>
        <span className="text-xl font-semibold tracking-wide text-white hidden sm:block">Inferra</span>
      </Link>

      {/* Center Links - Desktop */}
      <div className="hidden lg:flex items-center gap-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`text-base font-normal transition-colors duration-300 ${link.active ? 'text-white' : 'text-[#BDBDBD] hover:text-white'
              }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center border border-white/20 bg-[#262626] hover:bg-[#333] transition-colors group">
            <Search className="w-5 h-5 text-[#9E9E9E] group-hover:text-white transition-colors" />
          </button>
          <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center border border-[#F29F04] bg-[#F29F04]/10 hover:bg-[#F29F04]/20 transition-colors group">
            <User className="w-5 h-5 text-[#F29F04]" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
