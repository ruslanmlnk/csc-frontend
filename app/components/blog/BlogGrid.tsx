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
    blogPosts: BlogPost[];
    extraPosts: BlogPost[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogPosts, extraPosts }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6 w-full">
                {blogPosts.slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex-1">
                        <BlogCard post={post} />
                    </Link>
                ))}
            </div>

            <div className="flex flex-row gap-6 w-full">
                {blogPosts[3] && (
                    <Link href={`/blog/${blogPosts[3].slug}`} className="flex-1 text-inherit decoration-none">
                        <BlogCard post={blogPosts[3]} />
                    </Link>
                )}
                {/* Sidebar Promo */}
                <div className="relative w-[397px] h-[517px] rounded-[40px] overflow-hidden">
                    <Image
                        src="https://api.builder.io/api/v1/image/assets/TEMP/575debb1f4b5a5e3bc39f8bef505c2d24f8200f0?width=794"
                        alt="Promo Sidebar"
                        fill
                        className="object-cover"
                    />
                </div>
                {extraPosts[0] && (
                    <Link href={`/blog/${extraPosts[0].slug}`} className="flex-1">
                        <BlogCard post={extraPosts[0]} />
                    </Link>
                )}
            </div>

            <div className="flex flex-row gap-6 w-full">
                {extraPosts.slice(1, 4).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex-1">
                        <BlogCard post={post} />
                    </Link>
                ))}
            </div>

            <div className="flex flex-row gap-6 w-full">
                {extraPosts[4] && (
                    <Link href={`/blog/${extraPosts[4].slug}`} className="flex-1">
                        <BlogCard post={extraPosts[4]} />
                    </Link>
                )}
                {/* Promo Image 2 */}
                <div className="relative w-[397px] h-[517px] rounded-[40px] overflow-hidden">
                    <Image
                        src="https://api.builder.io/api/v1/image/assets/TEMP/575debb1f4b5a5e3bc39f8bef505c2d24f8200f0?width=794"
                        alt="Promo Sidebar"
                        fill
                        className="object-cover"
                    />
                </div>
                {extraPosts.slice(5, 7).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="flex-1">
                        <BlogCard post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogGrid;
