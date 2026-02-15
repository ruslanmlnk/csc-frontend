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
}

export interface Tag {
    tag: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    publishedDate: string;
    content: unknown; // Lexical rich text
    blockquote?: string;
    image: Media;
    category: Category;
    author?: Author | null;
    tags?: Tag[];
}
