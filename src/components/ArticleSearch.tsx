import { useState } from "react";
import Input from "./Input";
import { useGetArticleBySlugQuery } from "../store/articleSlice";
import { LoadingSpinner } from "./index";
import { Link } from "react-router-dom";
import type { Article } from "../types/Article";
const ArticleSearch = () => {
    const [query, setQuery] = useState('');
    const [slug, setSlug] = useState('');
    const { data, isLoading, error } = useGetArticleBySlugQuery(slug,{skip: !slug});

    
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
    const handleSearch = async (query: string) => {
        setQuery(query);
        setSlug(slugTransform(query));
    };

    if(isLoading) return <LoadingSpinner size="small" />;

    if(error) return (
        <div className="flex justify-center items-center h-full">
            <p className="text-red-500">Error fetching articles</p>
        </div>
    )

    return (
        <div className="relative w-full">
            <Input
                className="w-full"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={isLoading}
            />
            {data && data.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {data.map((article: Article) => (
                        <Link
                            key={article.$id}
                            to={`/articles/${article.$id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setQuery('')}
                        >
                            <div className="font-medium">{article.title}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleSearch;
