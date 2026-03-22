import type { Metadata } from 'next'
import React from 'react'
import BlogCTA from '../../components/blog/BlogCTA'
import { getArticleBySlug, getArticles, getCategories } from '@/lib/backend/blog'
import { formatDateValue } from '@/lib/i18n'
import { getServerI18n } from '@/lib/i18n/server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const article = await getArticleBySlug(slug)
    if (!article) return {}

    const seoTitle = article.seo?.title?.trim()
    const seoDescription = article.seo?.description?.trim()
    const ogImageUrl = article.seo?.ogImage?.url

    return {
        title: seoTitle || article.title,
        description: seoDescription || undefined,
        openGraph: {
            title: seoTitle || article.title,
            description: seoDescription || undefined,
            images: ogImageUrl ? [{ url: ogImageUrl }] : [],
        },
        robots: article.seo?.noindex ? { index: false, follow: true } : undefined,
    }
}
import { Article, Category } from '../../types/blog'
import { getBackendUrl } from '@/lib/auth-server'
import ArticleNotFound from '@/app/components/article/ArticleNotFound'
import ArticleBackLink from '@/app/components/article/ArticleBackLink'
import ArticleHero from '@/app/components/article/ArticleHero'
import ArticleContent from '@/app/components/article/ArticleContent'
import ArticlePublicationStats from '@/app/components/article/ArticlePublicationStats'
import ArticleAuthorCard from '@/app/components/article/ArticleAuthorCard'
import ArticleSidebar from '@/app/components/article/ArticleSidebar'
import ArticleRelated from '@/app/components/article/ArticleRelated'

const fallbackAvatar = 'https://api.builder.io/api/v1/image/assets/TEMP/d403b2967d1414c5cdaf1d01f28d5b82d6e3b18a?width=168'

const withBackendUrl = (url: string | undefined, backendUrl: string): string => {
    if (!url) return fallbackAvatar
    return url.startsWith('/') ? `${backendUrl}${url}` : url
}

const toAbsoluteUrl = (url: string | undefined, backendUrl: string): string | null => {
    if (!url) return null
    return url.startsWith('/') ? `${backendUrl}${url}` : url
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const backendUrl = getBackendUrl()
    const { language, messages: t } = await getServerI18n()

    let article: Article | null = null
    let allArticles: Article[] = []
    let categories: Category[] = []

    try {
        const [articleData, allArticlesData, categoriesData] = await Promise.all([getArticleBySlug(slug), getArticles(), getCategories()])
        article = articleData
        allArticles = allArticlesData
        categories = categoriesData
    } catch (error) {
        console.error('Error fetching article:', error)
    }

    if (!article) {
        return <ArticleNotFound title={t.article.notFoundTitle} ctaLabel={t.article.notFoundCta} />
    }

    const articleImage = withBackendUrl(article.image?.url, backendUrl)
    const authorName = article.author?.name || t.article.authorNameFallback
    const authorBio = article.author?.bio || t.article.authorBioFallback
    const authorPosition = article.author?.position || t.article.authorPositionFallback
    const authorAvatar = withBackendUrl(article.author?.avatar?.url, backendUrl)
    const authorSocials = {
        facebook: article.author?.facebook,
        instagram: article.author?.instagram,
        linkedin: article.author?.linkedin,
        telegram: article.author?.telegram,
        tiktok: article.author?.tiktok,
        website: article.author?.website,
    }
    const publishedDateLabel = formatDateValue(article.publishedDate, language, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    const manualRelatedArticles = (article.relatedArticles || [])
        .filter((a) => Boolean(a?.slug) && a.slug !== slug)
        .map((a) => ({
            id: a.id,
            slug: a.slug,
            publishedDate: a.publishedDate,
            categoryName: a.category.name,
            title: a.title,
            image: withBackendUrl(a.cardPoster?.url || a.image.url, backendUrl),
        }))

    const fallbackRelatedArticles = allArticles
        .filter((a: Article) => a.slug !== slug)
        .slice(0, 3)
        .map((a) => ({
            id: a.id,
            slug: a.slug,
            publishedDate: a.publishedDate,
            categoryName: a.category.name,
            title: a.title,
            image: withBackendUrl(a.cardPoster?.url || a.image.url, backendUrl),
        }))

    const formattedRelatedArticles = manualRelatedArticles.length > 0
        ? manualRelatedArticles
        : fallbackRelatedArticles

    const sidebarLatestPosts = [...allArticles]
        .filter((a) => a.slug !== slug)
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        .slice(0, 2)
        .map((a) => ({
            slug: a.slug,
            title: a.title,
            categoryName: a.category.name,
            publishedDateLabel: formatDateValue(a.publishedDate, language, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
        }))

    const sidebarCategories = categories.map((c) => c.name)
    const sidebarBannerImageUrl = toAbsoluteUrl(article.sidebarBanner?.image?.url, backendUrl)
    const sidebarBannerHref = article.sidebarBanner?.link?.trim() || null
    const sidebarBannerAlt = article.sidebarBanner?.caption?.trim() || t.article.sidebarBannerAlt

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] pt-[162.69px]">
            <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-20 pb-20">
                <ArticleBackLink label={t.article.backToNews} />

                <ArticleHero
                    authorName={authorName}
                    categoryName={article.category.name}
                    publishedDateLabel={publishedDateLabel}
                    title={article.title}
                    imageUrl={articleImage}
                />

                <div className="flex flex-col-reverse lg:flex-row gap-16">
                    <article className="flex-1 flex flex-col gap-12">
                        <ArticleContent
                            content={article.content}
                            backendUrl={backendUrl}
                            tags={article.tags}
                            saveAriaLabel={language === 'uk' ? 'Зберегти статтю' : 'Save article'}
                            shareAriaLabel={language === 'uk' ? 'Поділитися статтею' : 'Share article'}
                        />

                        <ArticlePublicationStats
                            slug={article.slug}
                            publishedDateLabel={publishedDateLabel}
                            initialViews={article.views}
                            viewsSuffix={t.article.viewsSuffix}
                            language={language}
                        />

                        <ArticleAuthorCard
                            authorName={authorName}
                            authorBio={authorBio}
                            authorPosition={authorPosition}
                            authorAvatar={authorAvatar}
                            authorSocials={authorSocials}
                        />
                    </article>

                    <ArticleSidebar
                        tags={article.tags}
                        categories={sidebarCategories}
                        latestPosts={sidebarLatestPosts}
                        searchPlaceholder={t.article.searchPlaceholder}
                        searchAriaLabel={t.article.searchAria}
                        categoriesTitle={t.article.categoriesTitle}
                        latestPostsTitle={t.article.latestPostsTitle}
                        popularTagsTitle={t.article.popularTagsTitle}
                        sidebarBannerAlt={t.article.sidebarBannerAlt}
                        banner={
                            sidebarBannerImageUrl
                                ? {
                                    src: sidebarBannerImageUrl,
                                    alt: sidebarBannerAlt,
                                    href: sidebarBannerHref,
                                }
                                : null
                        }
                    />
                </div>

                <ArticleRelated articles={formattedRelatedArticles} title={t.article.relatedTitle} language={language} />
            </main>

            <BlogCTA />
        </div>
    )
}

export default BlogDetailPage
