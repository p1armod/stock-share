import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useGetTopGainersLosersQuery, useGetStockNewsAllQuery } from '../store/stockDataSlice';
import type { NewsArticle } from '../types/NewsArticle';
import { Link, useNavigate } from 'react-router-dom';
import { StockSearch, LoadingSpinner } from '../components';

type StockMover = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
};

type MarketMovers = {
  top_gainers: StockMover[];
  top_losers: StockMover[];
};

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const navigate = useNavigate();
  
  // Get data from RTK Query hooks
  const { 
    data: marketData = { top_gainers: [], top_losers: [] } as MarketMovers, 
    isLoading: isMarketDataLoading, 
    error: marketDataError,
    refetch: refetchMarketData
  } = useGetTopGainersLosersQuery({});

  const { data: newsResponse, isLoading: isLoadingNews } = useGetStockNewsAllQuery();
  const newsData = Array.isArray(newsResponse) ? newsResponse : [];
  

  // Destructure the data for easier access
  const { top_gainers: gainers = [], top_losers: losers = [] } = marketData;
  
  

  const formatChange = (change: string, isPercentage = false) => {
    const num = parseFloat(change);
    const isPositive = num >= 0;
    const prefix = isPositive ? '+' : '';
    const formattedNum = isPercentage ? num.toFixed(2) : Math.abs(num).toFixed(2);
    
    return (
      <span className={`inline-flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {prefix}{formattedNum}{isPercentage ? '%' : ''}
      </span>
    );
  };

  // Show loading state for initial market data load
  if (isMarketDataLoading) {
    return <LoadingSpinner message="Loading market data" className="min-h-screen" />;
  }

  // Show error state
  if (marketDataError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading market data</h3>
          <p className="text-gray-600 mb-6">We couldn't load the latest market data. Please check your connection and try again.</p>
          <button
            onClick={() => refetchMarketData()}
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0] || 'Trader'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {/* Search Section */}
        <StockSearch className="mb-8"/>

        {/* News Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <h2 className="px-6 py-4 text-lg font-medium text-gray-900">
              Top News
            </h2>
          </div>
          {isLoadingNews ? (
            <div className="px-6 py-4 text-center">Loading news...</div>
          ) : newsData.length === 0 ? (
            <div className="px-6 py-4 text-center">No news available</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsData.slice(0, 3).map((article: NewsArticle) => (
                  <div key={article.banner_image} className="bg-white rounded-lg shadow-sm p-4">
                    <img src={article.banner_image} alt={article.title} className="w-full h-48 object-cover mb-4" />
                    <a 
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:underline"
                    >
                      {article.title}
                    </a>
                    <p className="mt-2 text-gray-600 text-sm">
                      {article.source} - {new Date(article.published_at).toLocaleString()}
                    </p>
                  </div>
                ))}
                {newsData.length > 3 && (
                  <button
                    onClick={() => {
                      navigate('/news', { state: { newsData } });
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center p-4 text-gray-500 hover:text-gray-700"
                  >
                    Load more news
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Market Movers Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('gainers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'gainers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setActiveTab('losers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'losers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Top Losers
              </button>
            </nav>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              {isMarketDataLoading && (
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </td>
                  </tr>
                </tbody>
              )}
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'gainers' ? gainers : losers).slice(0, 10).map((stock: StockMover, index: number) => (
                  <tr key={`${stock.ticker}-${index}`} className="hover:bg-gray-50">
                    <Link to={`/stock/${stock.ticker}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stock.ticker}
                      </td>
                    </Link>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${parseFloat(stock.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {formatChange(stock.change_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {formatChange(stock.change_percentage, true)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {parseInt(stock.volume).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
        
      </div>
    </div>
  );
};

export default Home;
