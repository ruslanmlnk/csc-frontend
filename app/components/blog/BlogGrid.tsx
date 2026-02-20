import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '../BlogCard';

interface BlogPost {
    id: number | string;
    date: string;
    category: string;
    title: string;
    image: string;
    slug?: string;
    active?: boolean;
}

interface BlogGridProps {
    articles: BlogPost[];
    banner?: {
        src: string;
        alt: string;
        href?: string;
    } | null;
}

const BlogGrid: React.FC<BlogGridProps> = ({ articles, banner }) => {
    // Promo banner component
    const PromoBanner = () => (
        banner?.href ? (
            <a
                href={banner.href}
                target={/^https?:\/\//i.test(banner.href) ? '_blank' : undefined}
                rel={/^https?:\/\//i.test(banner.href) ? 'noopener noreferrer' : undefined}
                aria-label={banner.alt}
                className="relative block w-full aspect-[397/517] rounded-[40px] overflow-hidden border border-[rgba(74,74,74,0.7)]"
            >
                <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className="object-cover"
                />
            </a>
        ) : (
            <div className="relative w-full aspect-[397/517] rounded-[40px] overflow-hidden border border-[rgba(74,74,74,0.7)]">
                <Image
                    src={banner?.src || "https://api.builder.io/api/v1/image/assets/TEMP/575debb1f4b5a5e3bc39f8bef505c2d24f8200f0?width=794"}
                    alt={banner?.alt || 'Promo Sidebar'}
                    fill
                    className="object-cover"
                />
            </div>
        )
    );

    // Create a list with interjected banners
    // Logic: 4 articles -> 1 banner -> 4 articles -> 1 banner -> rest of articles
    const gridItems: (BlogPost | { type: 'banner'; id: string })[] = [];

    articles.forEach((article, index) => {
        gridItems.push(article);
        // Interject banner after the 4th, 8th etc item (index 3, 7...)
        if ((index + 1) % 4 === 0) {
            gridItems.push({ type: 'banner', id: `banner-${index}` });
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {gridItems.map((item, idx) => {
                if ('type' in item && item.type === 'banner') {
                    return (
                        <div key={item.id} className="w-full">
                            <PromoBanner />
                        </div>
                    );
                }

                const post = item as BlogPost;
                return (
                    <div key={post.id} className="w-full h-full flex">
                        <Link href={`/blog/${post.slug}`} className="flex-1 no-underline flex">
                            <BlogCard post={post} />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default BlogGrid;
