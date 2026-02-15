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

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>(['All Articles']);
    const [loading, setLoading] = useState(true);

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

    // Map articles to the format expected by components
    const formatArticle = (article: Article) => ({
        id: article.id,
        date: new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        category: article.category.name,
        title: article.title,
        image: article.image.url,
        slug: article.slug
    });

    const formattedArticles = filteredArticles.map(formatArticle);
    const blogPosts = formattedArticles.slice(0, 4);
    const extraPosts = formattedArticles.slice(4);

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
                    blogPosts={blogPosts}
                    extraPosts={extraPosts}
                />

                <BlogPagination />
            </main>

            <BlogCTA />
        </div>
    );
};

export default BlogPage;
