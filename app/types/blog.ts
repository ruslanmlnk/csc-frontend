export interface Media {
    url: string;
}

export interface Banner {
    caption?: string | null;
    link?: string | null;
    image?: Media | null;
}

export interface Category {
    id: string;
    name: string;
}

export interface Author {
    id: string;
    name: string;
    avatar?: Media;
    bio?: string;
    position?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    telegram?: string;
    tiktok?: string;
    website?: string;
}

export interface Tag {
    tag: string;
}

export interface RelatedArticleSelection {
    id: string;
    title: string;
    slug: string;
    publishedDate: string;
    cardPoster?: {
        url: string;
    } | null;
    image: {
        url: string;
    };
    category: {
        name: string;
    };
}

export interface ArticleSEO {
    title?: string | null;
    description?: string | null;
    ogImage?: Media | null;
    noindex?: boolean | null;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    publishedDate: string;
    views?: number | null;
    content: unknown; // Lexical rich text
    image: Media;
    cardPoster?: Media | null;
    category: Category;
    author?: Author | null;
    tags?: Tag[];
    relatedArticles?: RelatedArticleSelection[];
    sidebarBanner?: Banner | null;
    seo?: ArticleSEO | null;
}

export interface BlogPageData {
    banner?: Banner | null;
    horizontalBanner?: Banner | null;
}
