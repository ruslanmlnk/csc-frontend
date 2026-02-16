import React from 'react';
import Image from 'next/image';

interface BannerProps {
    src: string;
    alt: string;
    className?: string;
    containerStyle?: React.CSSProperties;
    sizes?: string;
}

const Banner: React.FC<BannerProps> = ({
    src,
    alt,
    className = "",
    containerStyle,
    sizes = "100vw",
}) => {
    return (
        <div
            className={`relative w-full max-w-[1240px] h-[158px] rounded-[40px] overflow-hidden shadow-2xl ${className}`}
            style={containerStyle}
        >
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover"
            />
        </div>
    );
};

export default Banner;
