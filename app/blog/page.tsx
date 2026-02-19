"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ForumHero from '../components/forum/ForumHero';
import Banner from '../components/Banner';
import BlogFilters from '../components/blog/BlogFilters';
import BlogGrid from '../components/blog/BlogGrid';
import ForumPagination from '../components/forum/ForumPagination';
import BlogCTA from '../components/blog/BlogCTA';
import { getArticles, getCategories } from '@/lib/backend/blog';
import { Article, Category } from '../types/blog';
import { getBackendUrl } from '@/lib/auth-server';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Articles');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>(['All Articles']);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const searchParams = useSearchParams();

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
        const urlSearch = searchParams.get('search')?.trim() || '';
        const urlCategory = searchParams.get('category')?.trim() || '';
        const urlTag = (searchParams.get('tag')?.trim() || '').replace(/^#/, '');

        setSearchQuery(urlSearch);
        setActiveCategory(urlCategory || 'All Articles');
        setActiveTag(urlTag);
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesData, categoriesData] = await Promise.all([
                    getArticles(),
                    getCategories()
                ]);
                setArticles(articlesData);
                setCategories(['All Articles', ...categoriesData.map((c: Category) => c.name)]);
            } catch (error) {
                console.error('Error fetching blog data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (activeCategory !== 'All Articles' && !categories.includes(activeCategory)) {
            setActiveCategory('All Articles');
        }
    }, [activeCategory, categories, loading]);

    const filteredArticles = articles.filter(article => {
        const normalizedSearch = searchQuery.toLowerCase().trim();
        const normalizedTag = activeTag.toLowerCase().trim();
        const articleTags = (article.tags || [])
            .map((tag) => tag?.tag?.toLowerCase().trim())
            .filter((tag): tag is string => Boolean(tag));

        const matchesCategory = activeCategory === 'All Articles' || article.category.name === activeCategory;
        const matchesSearch = !normalizedSearch || article.title.toLowerCase().includes(normalizedSearch);
        const matchesTag = !normalizedTag || articleTags.includes(normalizedTag);

        return matchesCategory && matchesSearch && matchesTag;
    });

    const pageSize = isMobile ? 4 : 13; // 4 articles + 1 banner = 5 items (mobile), 13 articles + 2 banners = 15 items (desktop)
    const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
    const normalizedPage = Math.min(currentPage, totalPages);
    const startIndex = (normalizedPage - 1) * pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize);
    const showingFrom = filteredArticles.length === 0 ? 0 : startIndex + 1;
    const showingTo = filteredArticles.length === 0 ? 0 : startIndex + paginatedArticles.length;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery, activeTag, isMobile]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

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

    const formattedArticles = paginatedArticles.map(formatArticle);

    if (loading) {
        return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="relative flex flex-col items-start bg-[#0D0D0D] overflow-hidden selection:bg-[#F29F04] selection:text-black">
            <ForumHero
                title="Inside performance marketing"
                description="Real cases, deep insights, and hands-on experience from live traffic, affiliate campaigns, and performance-driven strategies"
            />

            <main className="w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-[64px] pb-[120px]">
                <Banner
                    src="https://api.builder.io/api/v1/image/assets/TEMP/967edd6176067f34102e7dfd586756631f490fa3?width=2480"
                    alt="Promo Banner"
                    className="hidden md:block"
                />

                <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={(value) => {
                        setActiveCategory(value);
                        setActiveTag('');
                    }}
                    searchQuery={searchQuery}
                    onSearchChange={(value) => {
                        setSearchQuery(value);
                        setActiveTag('');
                    }}
                />

                <BlogGrid
                    articles={formattedArticles}
                />

                {filteredArticles.length > 0 ? (
                    <ForumPagination
                        showingFrom={showingFrom}
                        showingTo={showingTo}
                        total={filteredArticles.length}
                        currentPage={normalizedPage}
                        totalPages={totalPages}
                        itemLabel="articles"
                        onPageChange={setCurrentPage}
                    />
                ) : null}
            </main>

            <BlogCTA />
        </div>
    );
};

export default BlogPage;
