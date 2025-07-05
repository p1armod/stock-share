import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Article } from "../types/Article";
import articleService from "../appwrite/article";

export const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "",
    }),
    endpoints: (builder) => ({
        getArticles: builder.query<Article[], void>({
            queryFn: async () => {
                try {
                    const response = await articleService.getArticles();
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'No articles found',
                                error: 'No articles found'
                            }
                        };
                    }
                    const articles = response?.documents.map(doc => ({
                        $id: doc.$id,
                        userId: doc.userId,
                        title: doc.title,
                        slug: doc.slug,
                        content: doc.content,
                        featured_image: doc.featured_image
                    })) as Article[];
                    return { data: articles };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        getArticleByUserId: builder.query<Article[], string>({
            queryFn: async (userId: string) => {
                try {
                    const response = await articleService.getArticleByUserId(userId);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'No articles found',
                                error: 'No articles found'
                            }
                        };
                    }
                    const articles = response?.documents.map(doc => ({
                        $id: doc.$id,
                        userId: doc.userId,
                        title: doc.title,
                        slug: doc.slug,
                        content: doc.content,
                        featured_image: doc.featured_image
                    })) as Article[];
                    return { data: articles };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        getArticleById: builder.query<Article, string>({
            queryFn: async (id: string) => {
                try {
                    const response = await articleService.getArticleById(id);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Article not found',
                                error: 'Article not found'
                            }
                        };
                    }
                    // Directly use the response since getDocument returns a single document
                    const article = {
                        $id: response.$id,
                        userId: response.userId,
                        title: response.title,
                        slug: response.slug,
                        content: response.content,
                        featured_image: response.featured_image
                    } as Article;
                    return { data: article };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: 'Failed to fetch article'
                        } 
                    };
                }
            },
        }),
        
        createArticle: builder.mutation<Article, Article>({
            queryFn: async (article: Article) => {
                try {
                    const response = await articleService.createArticle(article);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to create article',
                                error: 'Failed to create article'
                            }
                        };
                    }
                    const articleData = {
                        $id: response.$id,
                        userId: response.userId,
                        title: response.title,
                        slug: response.slug,
                        content: response.content,
                        featured_image: response.featured_image
                    } as Article;
                    return { data: articleData };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        updateArticle: builder.mutation<Article, Article>({
            queryFn: async (article: Article) => {
                try {
                    const response = await articleService.updateArticle(article.$id!, article);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to update article',
                                error: 'Failed to update article'
                            }
                        };
                    }
                    const articleData = {
                        $id: response.$id,
                        userId: response.userId,
                        title: response.title,
                        slug: response.slug,
                        content: response.content,
                        featured_image: response.featured_image
                    } as Article;
                    return { data: articleData };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        getArticleBySlug: builder.query<Article[], string>({
            queryFn: async (slug: string) => {
                try {
                    const response = await articleService.getArticleBySlug(slug);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to get article',
                                error: 'Failed to get article'
                            }
                        };
                    }
                    const articles = response?.documents.map(doc => ({
                        $id: doc.$id,
                        userId: doc.userId,
                        title: doc.title,
                        slug: doc.slug,
                        content: doc.content,
                        featured_image: doc.featured_image
                    })) as Article[];
                    return { data: articles };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        deleteArticle: builder.mutation<void, string>({
            queryFn: async (articleId: string) => {
                try {
                    await articleService.deleteArticle(articleId);
                    return { data: undefined };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        uploadImage: builder.mutation<string, File>({
            queryFn: async (file: File) => {
                try {
                    const response = await articleService.uploadImage(file);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to upload image',
                                error: 'Failed to upload image'
                            }
                        };
                    }
                    return { data: response.$id };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        getImageUrl: builder.query<string, string>({
            queryFn: async (fileId: string) => {
                try {
                    const response = await articleService.getImageUrl(fileId);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to get image preview',
                                error: 'Failed to get image preview'
                            }
                        };
                    }
                    return { data: response };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        getImage: builder.query<string, string>({
            queryFn: async (fileId: string) => {
                try {
                    const response = await articleService.getImage(fileId);
                    if (!response) {
                        return {
                            error: {
                                status: 'CUSTOM_ERROR',
                                data: 'Failed to get image',
                                error: 'Failed to get image'
                            }
                        };
                    }
                    return { data: response.$id };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
        deleteImage: builder.mutation<void, string>({
            queryFn: async (fileId: string) => {
                try {
                    await articleService.deleteImage(fileId);
                    return { data: undefined };
                } catch (error: any) {
                    return { 
                        error: { 
                            status: 'CUSTOM_ERROR',
                            data: error.message,
                            error: error.message
                        } 
                    };
                }
            },
        }),
    }),
});

export const { useGetArticlesQuery, useGetArticleByUserIdQuery, useCreateArticleMutation, useUpdateArticleMutation, useDeleteArticleMutation, useUploadImageMutation, useGetImageQuery, useDeleteImageMutation, useGetImageUrlQuery, useGetArticleBySlugQuery, useGetArticleByIdQuery } = articleApi;

export default articleApi;

