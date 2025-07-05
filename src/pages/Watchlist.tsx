
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  useGetWatchListsQuery,
  useCreateWatchListMutation,
  useDeleteWatchListMutation,
  useAddStockMutation,
  useRemoveStockMutation
} from '../store/watchListSlice';
import { Button, Input, Modal, Card, LoadingSpinner } from '../components';
import { useNavigate } from 'react-router-dom';

// SVG Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const Watchlist = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState<Record<string, string>>({});

  // RTK Query hooks
  const { data: watchlists = [], isLoading, error } = useGetWatchListsQuery(user?.$id || '', {
    skip: !user?.$id // Skip if user is not logged in
  });
  const [createWatchList, { isLoading: isCreating }] = useCreateWatchListMutation();
  const [deleteWatchList, { isLoading: isDeleting }] = useDeleteWatchListMutation();
  const [addStock, { isLoading: isAddingStock }] = useAddStockMutation();
  const [removeStock, { isLoading: isRemovingStock }] = useRemoveStockMutation();
  
  // Track loading states for individual watchlists and stocks
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: {
      addingStock?: boolean;
      removingStock?: string | null;
      deleting?: boolean;
    };
  }>({});
  
  const isLoadingAnyOperation = isCreating || isDeleting || isAddingStock || isRemovingStock;
  const navigate = useNavigate();

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim() || !user?.$id) return;
    
    try {
      setLoadingStates(prev => ({
        ...prev,
        _create: { deleting: true }
      }));
      
      await createWatchList({
        title: newWatchlistName,
        userId: user.$id,
        stocks: []
      }).unwrap();
      
      setNewWatchlistName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create watchlist:', error);
      // In a real app, you might want to show this error to the user
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        _create: { deleting: false }
      }));
    }
  };

  const handleAddStock = async (watchlistId: string) => {
    const symbol = newStockSymbol[watchlistId]?.trim().toUpperCase();
    if (!symbol) return;

    try {
      setLoadingStates(prev => ({
        ...prev,
        [watchlistId]: { ...prev[watchlistId], addingStock: true }
      }));
      
      await addStock({ watchlistId, symbol }).unwrap();
      setNewStockSymbol(prev => ({ ...prev, [watchlistId]: '' }));
    } catch (error) {
      console.error('Failed to add stock:', error);
      // In a real app, you might want to show this error to the user
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        [watchlistId]: { ...prev[watchlistId], addingStock: false }
      }));
    }
  };

  const handleRemoveStock = async (watchlistId: string, symbol: string) => {
    try {
      setLoadingStates(prev => ({
        ...prev,
        [watchlistId]: { ...prev[watchlistId], removingStock: symbol }
      }));
      
      await removeStock({ watchlistId, symbol }).unwrap();
    } catch (error) {
      console.error('Failed to remove stock:', error);
      // In a real app, you might want to show this error to the user
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        [watchlistId]: { ...prev[watchlistId], removingStock: null }
      }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your watchlists..." className="min-h-[70vh]" />;
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading watchlists</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error && typeof error === 'object' && 'data' in error 
              ? (error.data as { message?: string })?.message || 'An error occurred' 
              : 'Please try again later'}
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Watchlists</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon />
          New Watchlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlists.map((watchlist) => (
          <Card key={watchlist.$id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{watchlist.title}</h2>
              <Button
                onClick={async () => {
                  try {
                    setLoadingStates(prev => ({
                      ...prev,
                      [watchlist.$id]: { ...prev[watchlist.$id], deleting: true }
                    }));
                    await deleteWatchList(watchlist.$id).unwrap();
                  } catch (error) {
                    console.error('Failed to delete watchlist:', error);
                  } finally {
                    setLoadingStates(prev => ({
                      ...prev,
                      [watchlist.$id]: { ...prev[watchlist.$id], deleting: false }
                    }));
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center"
                disabled={loadingStates[watchlist.$id]?.deleting || isLoadingAnyOperation}
              >
                {loadingStates[watchlist.$id]?.deleting ? (
                  <LoadingSpinner size="small" className="h-4 w-4" />
                ) : (
                  <TrashIcon />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {watchlist.stocks?.map((symbol) => (
                <div
                  key={`${watchlist.$id}-${symbol}`}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span 
                    onClick={() => navigate(`/stock/${symbol}`)} 
                    className={`font-mono cursor-pointer hover:underline ${
                      loadingStates[watchlist.$id]?.removingStock === symbol ? 'opacity-50' : ''
                    }`}
                  >
                    {symbol}
                  </span>
                  <Button
                    onClick={() => handleRemoveStock(watchlist.$id, symbol)}
                    variant="ghost"
                    size="sm"
                    className={`w-6 h-6 p-0 flex items-center justify-center ${
                      loadingStates[watchlist.$id]?.removingStock === symbol 
                        ? 'text-gray-400' 
                        : 'text-red-400 hover:text-red-600'
                    }`}
                    disabled={!!loadingStates[watchlist.$id]?.removingStock}
                  >
                    {loadingStates[watchlist.$id]?.removingStock === symbol ? (
                      <LoadingSpinner size="small" className="h-3 w-3" />
                    ) : (
                      <CloseIcon />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                type="text"
                placeholder="Add stock (e.g., AAPL)"
                value={newStockSymbol[watchlist.$id] || ''}
                onChange={(e) =>
                  setNewStockSymbol(prev => ({
                    ...prev,
                    [watchlist.$id]: e.target.value
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddStock(watchlist.$id);
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleAddStock.bind(null, watchlist.$id)}
                className="px-3 min-w-[60px] flex items-center justify-center"
                disabled={!newStockSymbol[watchlist.$id]?.trim() || loadingStates[watchlist.$id]?.addingStock}
              >
                {loadingStates[watchlist.$id]?.addingStock ? (
                  <LoadingSpinner size="small" className="h-4 w-4" />
                ) : (
                  'Add'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Watchlist Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewWatchlistName('');
        }}
        title="Create New Watchlist"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Watchlist name"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateWatchlist();
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setNewWatchlistName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWatchlist}
              className="w-full mt-4 flex items-center justify-center"
              disabled={!newWatchlistName.trim() || loadingStates._create?.deleting}
            >
              {loadingStates._create?.deleting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Watchlist'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Watchlist;