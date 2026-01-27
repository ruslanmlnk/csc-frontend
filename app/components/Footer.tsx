import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    'Agency', 'Blog', 'Conferences', 'Services', 'Forum', 'Partnership', 'Jobs'
  ];

  return (
    <footer className="w-full bg-[#0D0D0D] border-t border-[#666] mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-24 py-16 flex flex-col items-center gap-12">
        
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">

           <div className="flex items-center gap-3">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5L20 25L30 5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="15" r="3" fill="#F29F04"/>
              </svg>
              <span className="text-xl font-semibold tracking-wide text-white">Inferra</span>
           </div>

           <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {footerLinks.map(link => (
                <a key={link} href="#" className="text-white text-lg font-normal hover:text-[#F29F04] transition-colors">
                  {link}
                </a>
              ))}
           </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#666]"></div>

        {/* Copyright */}
        <div className="text-[#BDBDBD] text-base opacity-70">
          © 2025, СlickStorm Corporation. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;