import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, LoadingSpinner } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useCreateArticleMutation, useUploadImageMutation } from "../store/articleSlice";
import type { Article } from "../types/Article";
import { Editor } from '@tinymce/tinymce-react';
import conf from "../conf/conf";




interface ArticleFormData {
    title: string;
    slug: string;
    featured_image: FileList | null;
}

const CreateArticle = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ArticleFormData>();
    const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [content, setContent] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [error, setError] = useState<string>("");
    const isSubmitting = isCreating || isUploading;


    if (!user) {
        navigate("/login");
        return null;
    }

    const handleEditorChange = (content: string) => {
        setContent(content);
    }

    const onSubmit = async (data: ArticleFormData) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!content.trim()) {
            setError("Article content cannot be empty");
            return;
        }
        
        setError("");
        
        try {
            let featuredImageId = "";
            
            if (data.featured_image && data.featured_image.length > 0) {
                const file = data.featured_image[0];
                if (file instanceof File) {
                    const response = await uploadImage(file).unwrap();
                    featuredImageId = response;
                }
            }
    
            const article: Article = {
                $id: "",
                userId: user.$id,
                title: data.title.trim(),
                slug: slug || slugTransform(data.title),
                content: content,
                featured_image: featuredImageId
            };
    
            await createArticle(article).unwrap();
            reset();
            setContent("");
            setSlug("");
            navigate("/articles");
        } catch (error) {
            console.error("Error creating article:", error);
            setError("Failed to create article. Please try again.");
        }
    };

    const slugTransform = (title: string) => {
        if (!title) return '';
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')  // Remove special characters
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/--+/g, '-')       // Replace multiple - with single -
            .replace(/^-+|-+$/g, '')    // Trim - from start and end of text
            .substring(0, 60);          // Limit length to 60 characters
    }
    if (isSubmitting) {
        return <LoadingSpinner message={isUploading ? "Uploading image..." : "Publishing article..."} className="min-h-[70vh]" />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Article</h1>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            placeholder="Enter article title"
                            className="w-full"
                            error={errors.title?.message}
                            onChange={(e) => setSlug(slugTransform(e.target.value))}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                        </label>
                        <Input
                            type="text"
                            value={slug}
                            placeholder="auto-generated-slug"
                            className="w-full bg-gray-50"
                            readOnly
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded overflow-hidden">
                            <Editor
                                value={content}
                                onEditorChange={handleEditorChange}
                                apiKey={conf.tinymce_api_key}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                        'bold italic backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
                                    statusbar: false
                                }}
                                disabled={isSubmitting}
                            />
                        </div>
                        {!content && (
                            <p className="mt-1 text-sm text-red-600">Content is required</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Featured Image
                        </label>
                        <div className="mt-1 flex items-center">
                            <Input
                                type="file"
                                accept="image/*"
                                {...register("featured_image")}
                                className="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-blue-50 file:text-blue-700
                                          hover:file:bg-blue-100"
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Recommended size: 1200x630px (optional)
                        </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Article'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateArticle;



