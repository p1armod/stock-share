
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetArticleByIdQuery, useGetImageUrlQuery, useDeleteArticleMutation } from "../store/articleSlice";
import { useAuth } from "../contexts/AuthContext";
import { Button, LoadingSpinner } from "../components";
import parse from "html-react-parser";
const Article = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const { data, isLoading, error } = useGetArticleByIdQuery(id!);
    const { data: imageUrlData, isLoading: imageUrlLoading, error: imageUrlError } = useGetImageUrlQuery(data?.featured_image!);
    const [deleteArticle] = useDeleteArticleMutation();
    const navigate = useNavigate();
    
    if (isLoading) {
        return <LoadingSpinner message="Loading article" />;
    }

    if (error) {
        console.error('Article loading error:', error);
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
                <p className="text-xl font-semibold mb-4">Error loading article</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }


    return (
        <div className="container mx-auto py-16">
            <div className="flex flex-col items-start justify-center gap-10">
                <div className="flex items-center justify-start gap-2">
                    <h1 className="text-5xl font-semibold">{data?.title}</h1>
                </div>
                {user?.$id === data?.userId && <div className="flex items-center justify-start gap-2">
                    <Link to={`/articles/edit/${id}`}>
                        <Button variant="outline" className="border-gray-300">
                            Edit
                        </Button>
                    </Link>
                    <Button onClick={() => {
                        deleteArticle(id!);
                        navigate("/articles");
                    }} variant="danger" className="bg-red-500 hover:bg-red-600">
                        Delete
                    </Button>
                </div>}
                {imageUrlLoading && <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>}
                {imageUrlError && <div className="flex items-center justify-center h-screen">
                    <p className="text-lg text-gray-600">Error loading image</p>
                </div>}
                {imageUrlData && <img src={imageUrlData} alt={data?.title} className="w-full object-cover rounded-lg shadow-lg" />}
                <div className="prose max-w-none p-4 md:p-8">
                    {data?.content && parse(data.content)}
                </div>
            </div>
        </div>
    );
};

export default Article;

