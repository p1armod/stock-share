import { useGetStockNewsAllQuery } from "../store/stockDataSlice";
import { useState, useEffect } from "react";
import type { NewsArticle } from "../types/NewsArticle";
import { Card, Button, LoadingSpinner } from "../components";
import { Link } from "react-router-dom";

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const { data, isLoading, isError, refetch } = useGetStockNewsAllQuery();

  useEffect(() => {
    if (data) {
      setNews(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading latest news" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading news</h3>
          <p className="text-gray-600 mb-6">We couldn't load the latest news. Please check your connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Latest Market News</h1>
        <button
          onClick={() => refetch()}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((article) => (
          <Card key={article.id} className="p-4">
            <img src={article.banner_image} alt={article.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="mt-2">{article.summary}</p>
            <Link to={`${article.id}`}>
              <Button className="mt-4">Read more</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
