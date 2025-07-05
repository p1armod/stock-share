import { useGetTopGainersLosersQuery, useGetStockNewsAllQuery } from "../store/stockDataSlice";

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



export const useStockData = () => {
    const { 
        data: topGainersLosers = { top_gainers: [], top_losers: [] } as MarketMovers, 
        isLoading: topGainersLosersLoading 
    } = useGetTopGainersLosersQuery(undefined);
    
    const { 
        data: stockNewsAll = [], 
        isLoading: stockNewsAllLoading 
    } = useGetStockNewsAllQuery(undefined);
    
    return { 
        topGainersLosers, 
        topGainersLosersLoading, 
        stockNewsAll, 
        stockNewsAllLoading 
    };
};
