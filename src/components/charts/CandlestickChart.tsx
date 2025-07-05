import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { StockDataPoint } from '../../types/chart';

// Add type extension for Cell
declare module 'recharts' {
  interface Cell {
    low?: number;
    high?: number;
    openClose?: [number, number];
  }
}

interface CandlestickProps {
  x: number;
  y: number;
  width: number;
  height: number;
  low: number;
  high: number;
  openClose: [number, number];
  fill: string;
}

interface CandlestickChartProps {
  data: StockDataPoint[];
  height?: number | string;
  width?: number | string;
}

const Candlestick = (props: CandlestickProps) => {
    const { fill, x, y, width, height, low, high, openClose: [open, close] } = props;
    const isGrowing = open < close;
    const color = isGrowing ? '#10B981' : '#EF4444';
    
    // Calculate the y-positions based on the price scale
    const pixelHeight = height;
    const priceToY = (price: number) => y + ((high - price) / (high - low)) * pixelHeight;
    
    
    const yHigh = priceToY(high);
    const yLow = priceToY(low);
    const yOpen = priceToY(open);
    const yClose = priceToY(close);
  
    const bodyTop = Math.min(yOpen, yClose);
    const bodyBottom = Math.max(yOpen, yClose);
    const bodyHeight = Math.max(1, bodyBottom - bodyTop);
  
    return (
      <g stroke={color} fill="none" strokeWidth="1.5">
        {/* Top wick - from high to top of candle body */}
        <line
          x1={x + width / 2}
          y1={yHigh}
          x2={x + width / 2}
          y2={bodyTop}
          stroke={color}
        />
        {/* Candle body */}
        <rect
          x={x}
          y={bodyTop}
          width={width}
          height={bodyHeight}
          fill={color}
          stroke="none"
        />
        {/* Bottom wick - from bottom of candle body to low */}
        <line
          x1={x + width / 2}
          y1={bodyBottom}
          x2={x + width / 2}
          y2={yLow}
          stroke={color}
        />
      </g>
    );
  };

const prepareData = (data: StockDataPoint[]) => {
  return data.map(({ open, close, ...other }) => ({
    ...other,
    openClose: [open, close] as [number, number],
  }));
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = '100%',
  width = '100%',
}) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  const chartData = prepareData(data);
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));
  const padding = (maxValue - minValue) * 0.1; // 10% padding

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={0}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.7} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
            minTickGap={60}
          />
          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tickLine={true}
            axisLine={false}
            width={60}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium text-gray-500">
                      {new Date(data.date).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <span className="text-gray-600">Open:</span>
                      <span className="text-right">${data.openClose[0].toFixed(2)}</span>
                      <span className="text-gray-600">High:</span>
                      <span className="text-right">${data.high.toFixed(2)}</span>
                      <span className="text-gray-600">Low:</span>
                      <span className="text-right">${data.low.toFixed(2)}</span>
                      <span className="text-gray-600">Close:</span>
                      <span className="text-right font-medium">${data.openClose[1].toFixed(2)}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="openClose"
            shape={(props: any) => <Candlestick {...props} />}
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
};

export default CandlestickChart;