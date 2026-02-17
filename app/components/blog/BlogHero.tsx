import React from 'react';
import GlowBackground from '@/app/components/layout/GlowBackground';

interface BlogHeroProps {
    title: React.ReactNode;
    description: React.ReactNode;
}

const BlogHero: React.FC<BlogHeroProps> = ({ title, description }) => {
    return (
        <section className="relative w-full pb-[151.39px] flex flex-col items-center justify-center overflow-hidden">
            <GlowBackground className="inset-0" showMobileGlow />

            <div className="relative z-10 flex flex-col justify-center items-center gap-6 w-full text-center px-5 mt-[60px] md:mt-[242.69px]">
                <h1 className="max-w-[1020px] text-[40px] md:text-[80px] font-medium leading-[1.1] md:leading-[88px] tracking-[-1.5px] md:tracking-[-3.2px] [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
                    {title}
                </h1>
                <p className="max-w-[720px] text-[#BDBDBD] text-[14px] md:text-[16px] leading-[22px] md:leading-[26px] [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] font-poppins">
                    {description}
                </p>
            </div>
        </section>
    );
};

export default BlogHero;
