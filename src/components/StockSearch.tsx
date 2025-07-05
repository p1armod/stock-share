import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, LoadingSpinner } from './index';
import { useGetStockSearchResultsQuery } from '../store/stockDataSlice';

export const Search = ( {className}: {className?: string}) => {
    const [query, setQuery] = useState('');
    const { data: searchResults = {bestMatches: []}, isLoading: loading } = useGetStockSearchResultsQuery(query, {
        skip: query.length < 3 // Only search when user has typed at least 2 characters
    });

    return (
        <div className={className}>
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stocks..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {loading && (
                <div className="absolute right-3 top-2.5">
                    <LoadingSpinner size="small" />
                </div>
            )}

            {query.length >= 3 && searchResults?.bestMatches?.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults?.bestMatches?.map((result: any) => (
                        <Link 
                            key={result['1. symbol']} 
                            to={`/stock/${result['1. symbol']}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setQuery('')}
                        >
                            <div className="font-medium">{result['1. symbol']}</div>
                            <div className="text-gray-500 text-sm">{result['2. name']}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;