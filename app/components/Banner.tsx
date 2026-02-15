import React from 'react';
import Image from 'next/image';

interface BannerProps {
    src: string;
    alt: string;
    className?: string;
}

const Banner: React.FC<BannerProps> = ({ src, alt, className = "" }) => {
    return (
        <div className={`relative w-full max-w-[1240px] h-[158px] rounded-[40px] overflow-hidden shadow-2xl ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
            />
        </div>
    );
};

export default Banner;
