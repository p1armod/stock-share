import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetStockOverviewQuery, useGetStockNewsQuery } from "../store/stockDataSlice";
import { useWatchListData } from "../hooks/useWatchListData";
import { Button, AddToWatchlist, LoadingSpinner } from "../components";
import { useAddStockMutation } from "../store/watchListSlice";
import { ChartContainer } from "../components/charts/ChartContainer";


// Info icon component
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const StockDetail = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const [activeTab, setActiveTab] = useState('overview');
    const { watchlists, watchlistsLoading } = useWatchListData();
    const watchListOptions = watchlists.map(wl => ({
        value: wl.$id,
        label: wl.title
    }));
    const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
    const [addStock] = useAddStockMutation();
    
    
    // Fetch stock data using RTK Query
    const { 
        data: stockOverview, 
        isLoading, 
        isError, 
        error: queryError 
    } = useGetStockOverviewQuery(symbol || '', {
        skip: !symbol, // Skip if no symbol is provided
    });

    const { 
        data: stockNews, 
        isError: newsError 
    } = useGetStockNewsQuery(symbol || '', {
        skip: !symbol, // Skip if no symbol is provided
    });

    // Show loading state
    if (isLoading || watchlistsLoading) {
        return <LoadingSpinner message="Loading stock data..." className="min-h-[70vh]" />;
    }

    // Show error state
    if (isError || newsError) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center p-6 max-w-md mx-auto">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading stock data</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {queryError ? 'message' in queryError ? queryError.message : 'An error occurred' : 'Please try again later'}
                    </p>
                    <div className="mt-6">
                        <Button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    const handleAddToWatchlist = async (watchlistId: string) => {
        if (!symbol || !stockOverview) return;
        
        try {
            const watchlist = watchlists.find(wl => wl.$id === watchlistId);
            if (!watchlist) return;
            //search in watchlist if stock is already added
            const stockExists = watchlist.stocks.some(stock => stock === symbol);
            if (stockExists) {
                alert('Stock already exists in watchlist');
                return;
            }
          await addStock({
            watchlistId,
            symbol,
          });
          return true;
        } catch (error) {
          console.error('Failed to add to watchlist:', error);
          // Optionally show an error toast/message
          return false;
        }
      };
    // Format the stock data to match our expected structure
    const stock = stockOverview ? {
        Symbol: symbol || '',
        Name: symbol || 'N/A',
        Exchange: 'N/A',
        Sector: 'N/A',
        Industry: 'N/A',
        '50DayMovingAverage': '0',
        '200DayMovingAverage': '0',
        ...stockOverview
    } : null;
    
    // Show error message if there's an error
    if (isError) {
        const errorMsg = (queryError as { data?: { message?: string } })?.data?.message || 'Failed to load stock data';
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InfoIcon />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errorMsg}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        &larr; Back to home
                    </Link>
                </div>
            </div>
        );
    }



    if (!stock) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InfoIcon />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">No stock data available</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        &larr; Back to home
                    </Link>
                </div>
            </div>
        );
    }

    // Helper functions with type safety
    const formatCurrency = (value: string | number | undefined) => {
        if (value === undefined || value === null) return 'N/A';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatPercent = (value: string | number | undefined) => {
        if (value === undefined || value === null) return 'N/A';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return 'N/A';
        return `${(num * 100).toFixed(2)}%`;
    };

    // Safely calculate price change
    const fiftyDayMA = typeof stock["50DayMovingAverage"] === 'string' ? 
        parseFloat(stock["50DayMovingAverage"]) : 
        (stock["50DayMovingAverage"] as number) || 0;
        
    const twoHundredDayMA = typeof stock["200DayMovingAverage"] === 'string' ? 
        parseFloat(stock["200DayMovingAverage"]) : 
        (stock["200DayMovingAverage"] as number) || 0;
    
    const priceChange = fiftyDayMA - twoHundredDayMA;
    const priceChangePercent = twoHundredDayMA !== 0 ? (priceChange / twoHundredDayMA) * 100 : 0;
    const isPositive = priceChange >= 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center">
                                <h1 className="text-3xl font-bold text-gray-900">{stock.Name}</h1>
                                <span className="ml-2 px-2 py-1 text-sm rounded bg-gray-100 text-gray-600">
                                    {stock.Exchange}: {stock.Symbol}
                                </span>
                                <Button
                                    onClick={() => setIsWatchlistModalOpen(true)}
                                    className="ml-2"
                                    disabled={watchlistsLoading}
                                >
                                    {watchlistsLoading ? 'Loading...' : 'Add to Watchlist'}
                                </Button>
                                <AddToWatchlist
                                    isOpen={isWatchlistModalOpen}
                                    onClose={() => setIsWatchlistModalOpen(false)}
                                    watchlists={watchListOptions}
                                    onSelectWatchlist={handleAddToWatchlist}
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {stock.Sector || 'N/A'} • {stock.Industry || 'N/A'}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <div className="flex items-end">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(stock["50DayMovingAverage"])}
                                </span>
                                <span className={`ml-2 flex items-baseline text-sm font-semibold ${
                                    isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {isPositive ? (
                                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                    <span className="ml-1">
                                        {Math.abs(priceChangePercent).toFixed(2)}% ({isPositive ? '+' : ''}{formatCurrency(priceChange.toString())})
                                    </span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                50-Day Moving Average
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`${
                                activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('fundamentals')}
                            className={`${
                                activeTab === 'fundamentals'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Fundamentals
                        </button>
                        <button
                            onClick={() => setActiveTab('chart')}
                            className={`${
                                activeTab === 'chart'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`${
                                activeTab === 'news'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            News
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left Column */}
                            <div className="lg:col-span-2">
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Company Information
                                        </h3>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {stock.Description}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">CEO</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {stock.CEO || 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Employees</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {stock.FullTimeEmployees?.toLocaleString() || 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Headquarters</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {stock.Address?.split(',')[0] || 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-gray-500">Website</dt>
                                                <dd className="mt-1 text-sm">
                                                    <a 
                                                        href={stock.OfficialSite} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Visit Website
                                                    </a>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Key Stats */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Key Statistics
                                        </h3>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                        <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Market Cap</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatCurrency(stock.MarketCapitalization)}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                                <dt className="text-sm font-medium text-gray-500">P/E Ratio</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {stock.PERatio}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Dividend Yield</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatPercent(stock.DividendYield)}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                                <dt className="text-sm font-medium text-gray-500">52-Week Range</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatCurrency(stock["52WeekLow"])} - {formatCurrency(stock["52WeekHigh"])}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Financial Highlights */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Financial Highlights
                                        </h3>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                        <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Revenue (TTM)</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatCurrency(stock.RevenueTTM)}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                                <dt className="text-sm font-medium text-gray-500">Profit Margin</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatPercent(stock.ProfitMargin)}
                                                </dd>
                                            </div>
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">ROE</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {formatPercent(stock.ReturnOnEquityTTM)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fundamentals' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Financial Metrics
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                {/* Valuation Metrics */}
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-900">Valuation Metrics</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"></dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Forward P/E</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {stock.ForwardPE}
                                    </dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">PEG Ratio</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {stock.PEGRatio}
                                    </dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Price/Book</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {stock.PriceToBookRatio}
                                    </dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Price/Sales (TTM)</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {stock.PriceToSalesRatioTTM}
                                    </dd>
                                </div>

                                {/* Dividend Information */}
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 mt-6 border-t border-gray-200">
                                    <dt className="text-sm font-medium text-gray-900">Dividend Information</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"></dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Dividend Yield</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatPercent(stock.DividendYield)}
                                    </dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Dividend Per Share</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatCurrency(stock.DividendPerShare)}
                                    </dd>
                                </div>
                                
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Ex-Dividend Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {stock.ExDividendDate || 'N/A'}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chart' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px]">
                            <div className="h-full">
                                {symbol ? (
                                    <ChartContainer 
                                        symbol={symbol} 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-500">No chart data available</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {activeTab === 'news' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
                        <div className="h-full">
                            {stockNews ? (
                                //Grid layout for news with 3 news per row only 1 row for now
                                //fits in the tab size
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                    {stockNews.feed.slice(0, 3).map((news: any, index: any) => (
                                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="p-4 h-full">
                                                <img src={news.banner_image} alt={news.title} className="w-full h-48 object-cover" />
                                                <h3 className="text-lg font-medium text-gray-900">{news.title}</h3>
                                                <p className="mt-2 text-sm text-gray-500">{news.description}</p>
                                                <p className="mt-2 text-sm text-gray-500">{news.source}</p>
                                                <Link to={news.url} className="mt-2 text-sm text-gray-500">Read More</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-gray-500">No  News Data available</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockDetail;