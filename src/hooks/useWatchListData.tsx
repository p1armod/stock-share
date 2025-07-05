import { useGetWatchListsQuery } from "../store/watchListSlice";
import { useAuth } from "../contexts/AuthContext";

export const useWatchListData = () => {
    const { user } = useAuth();
    const { data: watchlists = [], isLoading: watchlistsLoading } = useGetWatchListsQuery(user?.$id || '');
    const getWatchList = (watchlistId: string) => {
        const watchlist = watchlists.find(wl => wl.$id === watchlistId);
        return watchlist;
    }
    return { watchlists, watchlistsLoading, getWatchList };
}