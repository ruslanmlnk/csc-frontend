import React from 'react'
import BlogCTA from '../../components/blog/BlogCTA'
import { getArticleBySlug, getArticles } from '@/lib/backend/blog'
import { Article } from '../../types/blog'
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
    let relatedArticles: Article[] = []

    try {
        const [articleData, allArticles] = await Promise.all([getArticleBySlug(slug), getArticles()])
        article = articleData
        relatedArticles = allArticles.filter((a: Article) => a.slug !== slug).slice(0, 3)
    } catch (error) {
        console.error('Error fetching article:', error)
    }

    if (!article) {
        return <ArticleNotFound />
    }

    const articleImage = withBackendUrl(article.image?.url, backendUrl)
    const authorName = article.author?.name || 'CSC Agency'
    const authorBio = article.author?.bio || 'Experienced writer and expert in performance marketing and digital industry.'
    const authorAvatar = withBackendUrl(article.author?.avatar?.url, backendUrl)
    const publishedDateLabel = new Date(article.publishedDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    const formattedRelatedArticles = relatedArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        publishedDate: a.publishedDate,
        categoryName: a.category.name,
        title: a.title,
        image: withBackendUrl(a.image.url, backendUrl),
    }))

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

                <div className="flex flex-col lg:flex-row gap-16">
                    <article className="flex-1 flex flex-col gap-12">
                        <ArticleContent
                            content={article.content}
                            backendUrl={backendUrl}
                            blockquote={article.blockquote}
                            tags={article.tags}
                        />

                        <ArticleAuthorCard authorName={authorName} authorBio={authorBio} authorAvatar={authorAvatar} />
                    </article>

                    <ArticleSidebar tags={article.tags} />
                </div>

                <ArticleRelated articles={formattedRelatedArticles} />
            </main>

            <BlogCTA />
        </div>
    )
}

export default BlogDetailPage
