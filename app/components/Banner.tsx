import React from 'react';
import Image from 'next/image';

interface BannerProps {
    src: string;
    alt: string;
    href?: string;
    className?: string;
    containerStyle?: React.CSSProperties;
    sizes?: string;
}

const Banner: React.FC<BannerProps> = ({
    src,
    alt,
    href,
    className = "",
    containerStyle,
    sizes = "100vw",
}) => {
    const containerClassName = `relative block w-full max-w-[1240px] h-[158px] rounded-[40px] overflow-hidden shadow-2xl ${className}`;
    const normalizedHref = href?.trim();
    const isExternalLink = Boolean(normalizedHref && /^https?:\/\//i.test(normalizedHref));

    const imageContent = (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
        />
    );

    if (normalizedHref) {
        return (
            <a
                href={normalizedHref}
                target={isExternalLink ? "_blank" : undefined}
                rel={isExternalLink ? "noopener noreferrer" : undefined}
                aria-label={alt}
                className={`${containerClassName} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F29F04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]`}
                style={containerStyle}
            >
                {imageContent}
            </a>
        );
    }

    return (
        <div className={containerClassName} style={containerStyle}>
            {imageContent}
        </div>
    );
};

export default Banner;
