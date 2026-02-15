"use client";

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Search, Facebook, Instagram, Linkedin } from 'lucide-react';
import GlowBackground from '../../components/layout/GlowBackground';
import BlogCard from '../../components/BlogCard';
import BlogCTA from '../../components/blog/BlogCTA';
import { getArticleBySlug, getArticles } from '@/lib/backend/blog';
import { Article } from '../../types/blog';

const BlogDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params);
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articleData, allArticles] = await Promise.all([
                    getArticleBySlug(slug),
                    getArticles()
                ]);
                setArticle(articleData);
                // Filter out current article and take first 3 for simplicity
                setRelatedArticles(allArticles.filter((a: any) => a.slug !== slug).slice(0, 3));
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">Loading...</div>;
    }

    if (!article) {
        return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">Article not found</div>;
    }

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] selection:bg-[#F29F04] selection:text-black pt-[100px]">
            <GlowBackground className="opacity-40" />

            <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-20 pb-20">
                {/* Navigation Back */}
                <Link href="/blog" className="flex items-center gap-4 text-white hover:text-[#F29F04] transition-colors group">
                    <ChevronLeft className="w-8 h-8" />
                    <span className="text-[24px] font-normal font-poppins">Back to News</span>
                </Link>

                {/* Hero Section */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-4">
                        <span className="text-[#BDBDBD] text-[20px] font-poppins">{article.author.name}</span>
                        <span className="text-white">•</span>
                        <div className="px-4 py-1.5 rounded-[40px] bg-[rgba(242,159,4,0.25)] border border-[#F29F04]">
                            <span className="text-white text-[14px] font-poppins">{article.category.name}</span>
                        </div>
                        <span className="text-white">•</span>
                        <span className="text-[#BDBDBD] text-[20px] font-poppins">
                            {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="max-w-[1074px] text-[56px] font-semibold leading-[72px] tracking-[-1.12px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">
                        {article.title}
                    </h1>

                    <div className="relative w-full aspect-[2480/1000] max-h-[500px] rounded-[40px] overflow-hidden border border-[rgba(74,74,74,0.7)] mt-6">
                        <Image
                            src={article.image.url}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Article */}
                    <article className="flex-1 flex flex-col gap-12">
                        <div className="text-[#9E9E9E] text-[20px] leading-[32px] font-poppins flex flex-col gap-8">
                            <p>{article.description}</p>

                            {/* Simple render of Lexical content (assuming plain paragraphs for now) */}
                            {/* In a real scenario, you'd use a Lexical serializer */}
                            <div className="article-content prose prose-invert max-w-none">
                                {/* Simplified: just displaying description as placeholder for content */}
                                <p>Detailed content would be rendered here using a proper Lexical serializer.</p>
                            </div>

                            {/* Blockquote with Glow */}
                            {article.blockquote && (
                                <div className="relative py-12 px-14 rounded-r-[10px] border-l-[5px] border-[#F29F04] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[rgba(255,58,41,0.1)] -z-10" />
                                    <p className="text-[#FCFCFC] text-[24px] font-medium italic leading-[32px] relative z-10">
                                        "{article.blockquote}"
                                    </p>
                                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#F29F04] blur-[100px] opacity-20 -mr-20 -mt-20" />
                                    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[#FCB42D] blur-[60px] opacity-10 -ml-20 -mb-20" />
                                </div>
                            )}
                        </div>

                        {/* Article Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-4 pt-10 border-t border-[rgba(74,74,74,0.7)]">
                                {article.tags.map(({ tag }) => (
                                    <div key={tag} className="px-3 py-1.5 rounded-[80px] bg-[#FCFCFC]">
                                        <span className="text-[#F29F04] text-[14px] font-poppins">#{tag}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Author Card */}
                        <div className="flex flex-col p-10 rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] gap-10">
                            <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                                <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden shrink-0 border-2 border-[#F29F04]/20">
                                    <Image
                                        src={article.author.avatar?.url || "https://api.builder.io/api/v1/image/assets/TEMP/d403b2967d1414c5cdaf1d01f28d5b82d6e3b18a?width=168"}
                                        alt={article.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <h3 className="text-white text-[32px] font-medium leading-[40px] tracking-[-0.64px]">{article.author.name}</h3>
                                    <p className="text-[#BDBDBD] text-[20px] leading-[32px]">Writer / Expert</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
                                        <Facebook className="w-4 h-4 fill-current" />
                                    </Link>
                                    <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
                                        <Instagram className="w-4 h-4" />
                                    </Link>
                                    <Link href="#" className="w-8 h-8 rounded-full bg-[#FCFCFC] flex items-center justify-center text-[#F29F04] hover:opacity-80 transition-opacity">
                                        <Linkedin className="w-4 h-4 fill-current" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-[#9E9E9E] text-[16px] leading-[26px]">
                                {article.author.bio || "Experienced writer and expert in performance marketing and digital industry."}
                            </p>
                        </div>
                    </article>

                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-[380px] flex flex-col gap-16 shrink-0">
                        {/* Sidebar Promo Image */}
                        <div className="relative w-full aspect-[380/727] rounded-[20px] overflow-hidden">
                            <Image
                                src="https://api.builder.io/api/v1/image/assets/TEMP/3e844bee26ad8ec77ac05689c0767ff3c1e8fc96?width=760"
                                alt="Sidebar Promo"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Search & Categories Sidebar */}
                        <div className="flex flex-col p-8 rounded-[20px] border border-[rgba(74,74,74,0.7)] bg-[#1A1A1A] gap-10">
                            <div className="flex items-center h-[50px] px-4 gap-2 rounded-[80px] border border-[#FCFCFC]">
                                <Search className="w-6 h-6 text-[#9E9E9E]" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="flex-1 bg-transparent border-none outline-none text-white text-[16px] placeholder:text-[#9E9E9E]"
                                />
                            </div>

                            {/* Popular Tags */}
                            <div className="flex flex-col gap-6">
                                <h3 className="text-[32px] font-medium leading-[40px] tracking-[-0.64px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">Popular Tags</h3>
                                <div className="flex flex-col">
                                    {(article.tags || []).map((t, idx, arr) => (
                                        <div key={t.tag} className={`py-4 ${idx !== arr.length - 1 ? 'border-b border-[#404040]' : ''}`}>
                                            <span className="text-[#BDBDBD] text-[16px] hover:text-[#F29F04] cursor-pointer transition-colors font-poppins">#{t.tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Articles Section */}
                <div className="flex flex-col gap-16 mt-20">
                    <h2 className="text-center text-[56px] font-medium leading-[72px] tracking-[-2.24px] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999] font-poppins">Related Article</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedArticles.map(a => (
                            <Link key={a.id} href={`/blog/${a.slug}`}>
                                <BlogCard post={{
                                    id: a.id,
                                    date: new Date(a.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                                    category: a.category.name,
                                    title: a.title,
                                    image: a.image.url
                                }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <BlogCTA />
        </div>
    );
};

export default BlogDetailPage;
