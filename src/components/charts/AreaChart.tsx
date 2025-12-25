import type { StockDataPoint } from "../../types/chart";
import { AreaChart as RechartsAreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from "recharts";


interface AreaChartProps {
    data: StockDataPoint[];
    height?: number;
}

export const AreaChart = ({ data }: AreaChartProps) => {
    return (
        <ResponsiveContainer >
            <RechartsAreaChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="natural" dataKey="close" stroke="#8884d8" fill="#8884d8" />
            </RechartsAreaChart>
        </ResponsiveContainer>
    );
};
