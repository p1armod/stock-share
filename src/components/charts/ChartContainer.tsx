import { Button } from "../index";
import { CandlestickChart } from "./CandlestickChart";
import { AreaChart } from "./AreaChart";
import type { StockDataPoint } from "../../types/chart";
import type { ChartType } from "../../types/chart";
import type { timeFrame } from "../../types/chart";
import { useState, useEffect } from "react";
import { useGetStockDataDailyQuery, useGetStockDataMonthlyQuery, useGetStockDataWeeklyQuery } from "../../store/stockDataSlice";

interface ChartContainerProps {
    symbol: string;
    height?: number;
}

export const ChartContainer = ({ symbol, height = 400 }: ChartContainerProps) => {
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState<ChartType>('area');
    const [timeFrame, setTimeFrame] = useState<timeFrame>('1d');
    const [stockData, setStockData] = useState<StockDataPoint[]>([]);
    const dailyQuery = useGetStockDataDailyQuery(symbol, { skip: timeFrame !== '1d' });
    const weeklyQuery = useGetStockDataWeeklyQuery(symbol, { skip: timeFrame !== '1w' });
    const monthlyQuery = useGetStockDataMonthlyQuery(symbol, { skip: timeFrame !== '1m' });


    useEffect(() => {
        let currentData: StockDataPoint[] = [];
        let isLoading = true;
    
        switch (timeFrame) {
            case '1d':
                currentData = dailyQuery.data || [];
                isLoading = dailyQuery.isLoading;
                break;
            case '1w':
                currentData = weeklyQuery.data || []; // Access the data property
                isLoading = weeklyQuery.isLoading;
                break;
            case '1m':
                currentData = monthlyQuery.data || []; // Access the data property
                isLoading = monthlyQuery.isLoading;
                break;
            default:
                currentData = []; 
                isLoading = false;
        }
    
        setStockData(currentData || []);
        setLoading(isLoading);
    }, [dailyQuery.data, weeklyQuery.data, monthlyQuery.data]);
    useEffect(() => {
        console.log('Stock data updated:', {
            data: dailyQuery.data,
            isLoading: dailyQuery.isLoading,
            error: dailyQuery.error
        });
    }, [dailyQuery.data, dailyQuery.isLoading, dailyQuery.error, weeklyQuery.data, weeklyQuery.isLoading, weeklyQuery.error, monthlyQuery.data, monthlyQuery.isLoading, monthlyQuery.error]);
    console.log(stockData);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!stockData || stockData.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 h-full w-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {/* Left side - Chart type buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setChartType('area')}
                variant={chartType === 'area' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 shadow-sm"
              >
                Area
              </Button>
              <Button
                onClick={() => setChartType('candlestick')}
                variant={chartType === 'candlestick' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 shadow-sm"
              >
                Candlestick
              </Button>
            </div>
      
            {/* Center - Chart title */}
            <h3 className="text-lg font-semibold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
              {symbol} - {chartType === 'area' ? 'Price' : 'Candlestick'} Chart
            </h3>
      
            {/* Right side - Time frame buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setTimeFrame('1d')}
                variant={timeFrame === '1d' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 shadow-sm"
              >
                1D
              </Button>
              <Button
                onClick={() => setTimeFrame('1w')}
                variant={timeFrame === '1w' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 shadow-sm"
              >
                1W
              </Button>
              <Button
                onClick={() => setTimeFrame('1m')}
                variant={timeFrame === '1m' ? 'primary' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 shadow-sm"
              >
                1M
              </Button>
            </div>
          </div>
          <div className="flex-1 p-2">
            {chartType === 'area' ? (
              <AreaChart data={stockData} height={height} />
            ) : (
              <CandlestickChart data={stockData} height={height} />
            )}
          </div>
        </div>
      );
};
    