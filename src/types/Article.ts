export type Article = {
    $id: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    featured_image: string;
    createdAt?: string;
    updatedAt?: string;
    status?: 'draft' | 'published' | 'archived';
    excerpt?: string;
    tags?: string[];
    readTime?: number;
    views?: number;
    likes?: number;
    shares?: number;
}
