import React from 'react';
import Image from 'next/image';
import BlogCard from '../BlogCard';

interface BlogPost {
    id: number | string;
    date: string;
    category: string;
    title: string;
    image: string;
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
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            <div className="flex flex-row gap-6 w-full">
                <BlogCard post={blogPosts[3]} />
                {/* Sidebar Promo */}
                <div className="relative w-[397px] h-[517px] rounded-[40px] overflow-hidden">
                    <Image
                        src="https://api.builder.io/api/v1/image/assets/TEMP/575debb1f4b5a5e3bc39f8bef505c2d24f8200f0?width=794"
                        alt="Promo Sidebar"
                        fill
                        className="object-cover"
                    />
                </div>
                <BlogCard post={extraPosts[0]} />
            </div>

            <div className="flex flex-row gap-6 w-full">
                {extraPosts.slice(1, 4).map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            <div className="flex flex-row gap-6 w-full">
                <BlogCard post={extraPosts[4]} />
                <div className="relative w-[397px] h-[517px] rounded-[40px] overflow-hidden">
                    <Image
                        src="https://api.builder.io/api/v1/image/assets/TEMP/575debb1f4b5a5e3bc39f8bef505c2d24f8200f0?width=794"
                        alt="Promo Sidebar"
                        fill
                        className="object-cover"
                    />
                </div>
                <BlogCard post={extraPosts[5]} />
                <BlogCard post={extraPosts[6]} />
            </div>
        </div>
    );
};

export default BlogGrid;
