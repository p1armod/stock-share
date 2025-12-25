import { Card } from "./index";
import { useGetImageUrlQuery } from "../store/articleSlice";
import type { Article } from "../types/Article";
import { Button } from "./index";
const ArticleCard = ({ article }: { article: Article }) => {
    const { data: imageUrl, error } = useGetImageUrlQuery(article.featured_image);
    if (!imageUrl) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No image available</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Error loading image</p>
            </div>
        );
    }
    return (
        <Card className="h-full flex flex-col">
            <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-article.jpg";
                }}
            />
            <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{article.slug}</p>
                <Button
                    onClick={() => window.location.href = `/articles/${article.$id}`}
                >
                    Read More
                </Button>
            </div>
        </Card>
    );
};

export default ArticleCard;
