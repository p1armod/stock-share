export type StockDataPoint = {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type ChartType = 'area' | 'candlestick';
export type timeFrame = '1d' | '1w' | '1m';



