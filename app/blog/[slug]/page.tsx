import React from 'react'
import BlogCTA from '../../components/blog/BlogCTA'
import { getArticleBySlug, getArticles, getCategories } from '@/lib/backend/blog'
import { Article, Category } from '../../types/blog'
import { getBackendUrl } from '@/lib/auth-server'
import ArticleNotFound from '@/app/components/article/ArticleNotFound'
import ArticleBackLink from '@/app/components/article/ArticleBackLink'
import ArticleHero from '@/app/components/article/ArticleHero'
import ArticleContent from '@/app/components/article/ArticleContent'
import ArticleAuthorCard from '@/app/components/article/ArticleAuthorCard'
import ArticleSidebar from '@/app/components/article/ArticleSidebar'
import ArticleRelated from '@/app/components/article/ArticleRelated'

const fallbackAvatar = 'https://api.builder.io/api/v1/image/assets/TEMP/d403b2967d1414c5cdaf1d01f28d5b82d6e3b18a?width=168'

const withBackendUrl = (url: string | undefined, backendUrl: string): string => {
    if (!url) return fallbackAvatar
    return url.startsWith('/') ? `${backendUrl}${url}` : url
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const backendUrl = getBackendUrl()

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
        return <ArticleNotFound />
    }

    const articleImage = withBackendUrl(article.image?.url, backendUrl)
    const authorName = article.author?.name || 'CSC Agency'
    const authorBio = article.author?.bio || 'Experienced writer and expert in performance marketing and digital industry.'
    const authorPosition = article.author?.position || 'Writer / Expert'
    const authorAvatar = withBackendUrl(article.author?.avatar?.url, backendUrl)
    const authorSocials = {
        facebook: article.author?.facebook,
        instagram: article.author?.instagram,
        linkedin: article.author?.linkedin,
        telegram: article.author?.telegram,
        tiktok: article.author?.tiktok,
        website: article.author?.website,
    }
    const publishedDateLabel = new Date(article.publishedDate).toLocaleDateString('en-US', {
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
            image: withBackendUrl(a.image.url, backendUrl),
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
            image: withBackendUrl(a.image.url, backendUrl),
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
            publishedDateLabel: new Date(a.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            }),
        }))

    const sidebarCategories = categories.map((c) => c.name)

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] pt-[162.69px]">
            <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 flex flex-col gap-20 pb-20">
                <ArticleBackLink />

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
                    />
                </div>

                <ArticleRelated articles={formattedRelatedArticles} />
            </main>

            <BlogCTA />
        </div>
    )
}

export default BlogDetailPage
