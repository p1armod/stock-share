import { createApi } from '@reduxjs/toolkit/query/react';
import type { WatchList } from '../types/WatchList';
import watchListService from '../appwrite/watchList';


export const watchListApi = createApi({
  reducerPath: 'watchListApi',
  baseQuery: () => ({ data: null }),
  tagTypes: ['WatchList'],
  endpoints: (builder) => ({
    
    // Get all watchlists for the current user
    getWatchLists: builder.query<WatchList[], string>({
      queryFn: async (userId) => {
        try {
          const data = await watchListService.getWatchLists(userId);
          return { data: data || [] };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ $id }) => ({ type: 'WatchList' as const, id: $id })),
              { type: 'WatchList', id: 'LIST' },
            ]
          : [{ type: 'WatchList', id: 'LIST' }],
    }),

    // Create a new watchlist
    createWatchList: builder.mutation<WatchList, Omit<WatchList, '$id' | '$createdAt' | '$updatedAt'>>({
      queryFn: async (watchlist) => {
        try {
          const data = await watchListService.createWatchList(watchlist.title, watchlist.userId);
          return { data: data as WatchList };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: [{ type: 'WatchList', id: 'LIST' }],
    }),

    // Update a watchlist
    updateWatchList: builder.mutation<WatchList, Partial<WatchList> & Pick<WatchList, '$id'>>({
      queryFn: async ({ $id, ...patch }) => {
        try {
          const data = await watchListService.updateWatchList($id, { $id, ...patch } as WatchList);
          return { data: data as WatchList };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { $id }) => [{ type: 'WatchList', id: $id }],
    }),

    // Delete a watchlist
    deleteWatchList: builder.mutation<{ success: boolean }, string>({
      queryFn: async (watchlistId) => {
        try {
          await watchListService.deleteWatchList(watchlistId);
          return { data: { success: true } };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'WatchList', id },
        { type: 'WatchList', id: 'LIST' },
      ],
    }),

    // Add stock to watchlist
    addStock: builder.mutation<WatchList, { watchlistId: string; symbol: string }>({
      queryFn: async ({ watchlistId, symbol }) => {
        try {
          const data = await watchListService.addStock(watchlistId, symbol);
          return { data: data as WatchList };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { watchlistId }) => [
        { type: 'WatchList', id: watchlistId },
      ],
    }),

    // Remove stock from watchlist
    removeStock: builder.mutation<WatchList, { watchlistId: string; symbol: string }>({
      queryFn: async ({ watchlistId, symbol }) => {
        try {
          const data = await watchListService.removeStock(watchlistId, symbol);
          return { data: data as WatchList };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { watchlistId }) => [
        { type: 'WatchList', id: watchlistId },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetWatchListsQuery,
  useCreateWatchListMutation,
  useUpdateWatchListMutation,
  useDeleteWatchListMutation,
  useAddStockMutation,
  useRemoveStockMutation,
} = watchListApi;

export default watchListApi;
