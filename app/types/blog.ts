export interface Media {
    url: string;
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
    image: {
        url: string;
    };
    category: {
        name: string;
    };
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    publishedDate: string;
    content: unknown; // Lexical rich text
    image: Media;
    category: Category;
    author?: Author | null;
    tags?: Tag[];
    relatedArticles?: RelatedArticleSelection[];
}
