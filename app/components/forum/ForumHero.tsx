import React from 'react';
import GlowBackground from '@/app/components/layout/GlowBackground';

interface ForumHeroProps {
    title: React.ReactNode;
    description: React.ReactNode;
}

const ForumHero: React.FC<ForumHeroProps> = ({ title, description }) => {
    return (
        <section className="relative w-full overflow-hidden">
            <GlowBackground className="inset-0" showMobileGlow />

            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 pt-[210px] pb-[80px] md:pt-[242.69px] md:pb-[151.39px]">
                <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
                    <h1 className="max-w-[1020px] text-[56px] md:text-[80px] font-medium leading-[72px] md:leading-[88px] tracking-[-2.24px] md:tracking-[-3.2px] [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
                        {title}
                    </h1>
                    <p className="max-w-[720px] text-[#BDBDBD] text-[16px] leading-[26px] [text-shadow:0_4px_4px_rgba(0,0,0,0.4)] font-poppins">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ForumHero;
