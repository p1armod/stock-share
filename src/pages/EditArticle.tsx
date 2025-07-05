import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
import { 
    useGetArticleByIdQuery, 
    useUpdateArticleMutation, 
    useUploadImageMutation 
} from "../store/articleSlice";
import { useAuth } from "../contexts/AuthContext";
import type { Article } from "../types/Article";
import { Button, Input, LoadingSpinner } from "../components";
import conf from "../conf/conf";

type ArticleFormData = {
    $id: string;
    title: string;
    slug: string;
    content: string;
    featured_image?: FileList;
};

const EditArticle = () => {
    const { id } = useParams<{ id: string }>();
    const { data: articleData, isLoading, isError, error } = useGetArticleByIdQuery(id || '', {
        skip: !id,
    });
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch,
        formState: { errors } 
    } = useForm<ArticleFormData>({
        defaultValues: {
            $id: '',
            title: '',
            slug: '',
            content: ''
        }
    });
    
    // Watch for featured image changes
    const featuredImage = watch("featured_image");
    
    // Set form default values when article data is loaded
    useEffect(() => {
        if (articleData) {
            setValue('$id', articleData.$id);
            setValue('title', articleData.title);
            setValue('slug', articleData.slug);
            setContent(articleData.content || '');
        }
    }, [articleData, setValue]);
    
    // Handle editor content change
    const handleEditorChange = (content: string) => {
        setContent(content);
    };
    
    // Show loading state
    if (isLoading) {
        return <LoadingSpinner message="Loading article..." className="min-h-[70vh]" />;
    }
    
    // Show error state
    if (isError) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center p-6 max-w-md mx-auto">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading article</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {error ? 'message' in error ? error.message : 'An error occurred' : 'Please try again later'}
                    </p>
                    <div className="mt-6">
                        <Button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Try Again
                        </Button>
                        <Button
                            onClick={() => navigate('/learn')}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Articles
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Show loading state if article data is not loaded yet
    if (!articleData) {
        return <LoadingSpinner message="Loading article..." className="min-h-[70vh]" />;
    }
    
    const onSubmit = async (data: ArticleFormData) => {
        if (!user || !id) {
            navigate("/login");
            return;
        }
        
        if (!content.trim()) {
            setErrorMessage("Article content cannot be empty");
            return;
        }
        
        setErrorMessage('');
        
        try {
            let featuredImageId = articleData?.featured_image || "";
            
            // Upload new featured image if provided
            if (data.featured_image && data.featured_image.length > 0) {
                const file = data.featured_image[0];
                const response = await uploadImage(file);
                if ('data' in response && response.data) {
                    featuredImageId = response.data;
                } else {
                    throw new Error('Failed to upload image');
                }
            }

            const article: Article = {
                $id: id,
                userId: user.$id,
                title: data.title.trim(),
                slug: data.slug.trim(),
                content: content,
                featured_image: featuredImageId,
            };

            await updateArticle(article).unwrap();
            navigate(`/articles/${data.$id}`);
        } catch (error) {
            console.error('Error updating article:', error);
            setErrorMessage(
                'message' in (error as any) 
                    ? (error as any).message 
                    : 'Failed to update article. Please try again.'
            );
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
            
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700">{errorMessage}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="title"
                        type="text"
                        {...register("title", { 
                            required: 'Title is required',
                            minLength: {
                                value: 5,
                                message: 'Title must be at least 5 characters long'
                            },
                            maxLength: {
                                value: 200,
                                message: 'Title must be less than 200 characters'
                            }
                        })}
                        error={errors.title?.message}
                        className="w-full"
                        disabled={isUpdating || isUploading}
                    />
                </div>
                
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="slug"
                        type="text"
                        {...register("slug", { 
                            required: 'Slug is required',
                            pattern: {
                                value: /^[a-z0-9-]+$/,
                                message: 'Slug can only contain lowercase letters, numbers, and hyphens'
                            },
                            minLength: {
                                value: 3,
                                message: 'Slug must be at least 3 characters long'
                            },
                            maxLength: {
                                value: 100,
                                message: 'Slug must be less than 100 characters'
                            }
                        })}
                        error={errors.slug?.message}
                        className="w-full"
                        disabled={isUpdating || isUploading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <div className={errors.content ? 'border-l-4 border-red-500 pl-2' : ''}>
                        <Editor
                            apiKey={conf.tinymce_api_key}
                            value={content}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 14px; }',
                            }}
                            disabled={isUpdating || isUploading}
                        />
                    </div>
                    {!content.trim() && (
                        <p className="mt-1 text-sm text-red-600">Content is required</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        {...register("featured_image")}
                        className="w-full"
                        disabled={isUpdating || isUploading}
                    />
                    {articleData?.featured_image && !featuredImage?.length && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                            <img 
                                src={`${conf.appwrite}/storage/buckets/${conf.bucket_id}/files/${articleData.featured_image}/preview?width=400`}
                                alt="Current featured"
                                className="h-40 w-auto object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                    <Button 
                        type="submit" 
                        className="px-6 py-2"
                        disabled={isUpdating || isUploading}
                    >
                        {isUpdating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : 'Update Article'}
                    </Button>
                    
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        disabled={isUpdating || isUploading}
                    >
                        Cancel
                    </Button>
                    
                    {(isUpdating || isUploading) && (
                        <span className="text-sm text-gray-500">
                            {isUploading ? 'Uploading image...' : 'Saving changes...'}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditArticle;
