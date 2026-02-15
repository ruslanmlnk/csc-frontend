"use client";

import React, { useEffect, useState } from 'react';
import BlogHero from '../components/blog/BlogHero';
import Banner from '../components/Banner';
import BlogFilters from '../components/blog/BlogFilters';
import BlogGrid from '../components/blog/BlogGrid';
import BlogPagination from '../components/blog/BlogPagination';
import BlogCTA from '../components/blog/BlogCTA';
import { getArticles, getCategories } from '@/lib/backend/blog';
import { Article, Category } from '../types/blog';
import { getBackendUrl } from '@/lib/auth-server';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>(['All Articles']);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const backendUrl = getBackendUrl();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesData, categoriesData] = await Promise.all([
                    getArticles(),
                    getCategories()
                ]);
                setArticles(articlesData);
                setCategories(['All Articles', ...categoriesData.map((c: any) => c.name)]);
            } catch (error) {
                console.error('Error fetching blog data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesCategory = activeCategory === 'All Articles' || article.category.name === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const limit = isMobile ? 4 : 13; // 4 articles + 1 banner = 5 items (mobile), 13 articles + 2 banners = 15 items (desktop)
    const limitedArticles = filteredArticles.slice(0, limit);

    // Map articles to the format expected by components
    const formatArticle = (article: Article) => {
        let imageUrl = article.image.url;
        if (imageUrl.startsWith('/')) {
            imageUrl = `${backendUrl}${imageUrl}`;
        }

        return {
            id: article.id,
            date: new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            category: article.category.name,
            title: article.title,
            image: imageUrl,
            slug: article.slug
        };
    };

    const formattedArticles = limitedArticles.map(formatArticle);

    if (loading) {
        return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="relative flex flex-col items-start bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black">
            <BlogHero
                title="Inside performance marketing"
                description="Real cases, deep insights, and hands-on experience from live traffic, affiliate campaigns, and performance-driven strategies"
            />

            <main className="w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-[64px] pb-[120px]">
                <Banner
                    src="https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480"
                    alt="Promo Banner"
                />

                <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <BlogGrid
                    articles={formattedArticles}
                />

                <BlogPagination />
            </main>

            <BlogCTA />
        </div>
    );
};

export default BlogPage;
