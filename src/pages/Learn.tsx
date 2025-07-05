import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGetArticlesQuery } from '../store/articleSlice';
import { ArticleCard, Button, LoadingSpinner, ArticleSearch } from '../components';
import type { Article } from '../types/Article';
const Learn = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: articles = [], isLoading, error } = useGetArticlesQuery();

    if (isLoading) {
        return <LoadingSpinner message="Loading articles" />;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error loading articles</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <ArticleSearch />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {user && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'Trader'}! 👋</h1>
                        <p className="text-gray-600 mb-4">Have an Idea or Suggestion? 🤔</p>
                        <Button 
                            onClick={() => navigate('/create-article')}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Create Article
                        </Button>
                    </div>
                )}
                
                {articles.length === 0 ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                        <p className="text-gray-500">No articles found. Be the first to create one!</p>
                    </div>
                ) : (
                    articles.map((article: Article) => (
                        <ArticleCard key={article.$id} article={article} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Learn;
