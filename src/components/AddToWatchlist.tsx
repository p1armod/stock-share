// components/AddToWatchlist.tsx
import { useState } from 'react';
import {Modal, Button} from './index';

interface WatchlistOption {
  value: string;
  label: string;
}

interface AddToWatchlistProps {
  watchlists: WatchlistOption[];
  onSelectWatchlist: (watchlistId: string) => Promise<boolean | undefined>;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToWatchlist = ({
  watchlists,
  onSelectWatchlist,
  isOpen,
  onClose,
}: AddToWatchlistProps) => {
  const [selectedWatchlist, setSelectedWatchlist] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWatchlist) {
      await onSelectWatchlist(selectedWatchlist);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Watchlist">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="watchlist" className="block text-sm font-medium text-gray-700 mb-1">
            Select a watchlist
          </label>
          <select
            id="watchlist"
            value={selectedWatchlist}
            onChange={(e) => setSelectedWatchlist(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Choose a watchlist</option>
            {watchlists.map((watchlist) => (
              <option key={watchlist.value} value={watchlist.value}>
                {watchlist.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedWatchlist}
          >
            Add to Watchlist
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddToWatchlist;
