import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import conf from "../conf/conf";

export const stockDataApi = createApi({
    reducerPath: "stockDataApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://www.alphavantage.co/query",
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getStockOverview: builder.query({
            query: (symbol) => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=OVERVIEW&symbol=${symbol}`,
                method: "GET"
            })
        }),
        getStockDataIntraDay: builder.query({
            query: (symbol) => {
                const params = new URLSearchParams({
                    function: 'TIME_SERIES_INTRADAY',
                    symbol: symbol,
                    interval: '5min',
                    outputsize: 'compact',
                    datatype: 'json',
                    apikey: conf.alpha_vantage_api_key,
                });
                return {
                    url: `https://www.alphavantage.co/query?${params.toString()}`,
                    method: "GET",
                };
            }
        }),
        getStockDataDaily: builder.query({
            query: (symbol) => {
                const params = new URLSearchParams({
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    outputsize: 'compact',
                    datatype: 'json',
                    apikey: conf.alpha_vantage_api_key
                });

                return {
                    url: `https://www.alphavantage.co/query?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response: any) => {

                if (!response || !response['Time Series (Daily)']) {
                    console.error('Unexpected API response format');
                    return [];
                }
                const timeSeries = response['Time Series (Daily)'];
                const transformedData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
                    date,
                    open: parseFloat(values['1. open']),
                    high: parseFloat(values['2. high']),
                    low: parseFloat(values['3. low']),
                    close: parseFloat(values['4. close']),
                    volume: parseInt(values['5. volume'], 10)
                }));

                return transformedData.reverse();
            }
        }),
        getStockDataWeekly: builder.query({
            query: (symbol) => {
                const params = new URLSearchParams({
                    function: 'TIME_SERIES_WEEKLY',
                    symbol: symbol,
                    outputsize: 'compact',
                    datatype: 'json',
                    apikey: conf.alpha_vantage_api_key
                });
                return {
                    url: `https://www.alphavantage.co/query?${params.toString()}`,
                    method: "GET",
                }
            },
            transformResponse: (response: any) => {
                if (!response || !response['Weekly Time Series']) {
                    console.error('Unexpected API response format');
                    return [];
                }
                const timeSeries = response['Weekly Time Series'];
                const transformedData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
                    date,
                    open: parseFloat(values['1. open']),
                    high: parseFloat(values['2. high']),
                    low: parseFloat(values['3. low']),
                    close: parseFloat(values['4. close']),
                    volume: parseInt(values['5. volume'], 10)
                }));

                return transformedData.reverse();
            }
        }
        ),
        getStockDataMonthly: builder.query({
            query: (symbol) => {
                const params = new URLSearchParams({
                    function: 'TIME_SERIES_MONTHLY',
                    symbol: symbol,
                    outputsize: 'compact',
                    datatype: 'json',
                    apikey: conf.alpha_vantage_api_key
                });
                return {
                    url: `https://www.alphavantage.co/query?${params.toString()}`,
                    method: "GET",
                }
            },
            transformResponse: (response: any) => {
                if (!response || !response['Monthly Time Series']) {
                    console.error('Unexpected API response format');
                    return [];
                }
                const timeSeries = response['Monthly Time Series'];
                const transformedData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
                    date,
                    open: parseFloat(values['1. open']),
                    high: parseFloat(values['2. high']),
                    low: parseFloat(values['3. low']),
                    close: parseFloat(values['4. close']),
                    volume: parseInt(values['5. volume'], 10)
                }));

                return transformedData.reverse();
            }
        }
        ),
        getStockNews: builder.query({
            query: (symbol) => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=NEWS_SENTIMENT&symbol=${symbol}`,
                method: "GET"
            })
        }),
        getStockNewsAll: builder.query<any, void>({
            query: () => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=NEWS_SENTIMENT`,
                method: "GET"
            }),
            transformResponse: (response: any) => {
                if (!response || !response.feed || !Array.isArray(response.feed)) {
                    return [];
                }
                return response.feed;
            },

        }),
        getMarketData: builder.query({
            query: () => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=GLOBAL_QUOTE`,
                method: "GET"
            })
        }),
        getMarketStats: builder.query({
            query: () => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=MARKET_STATUS`,
                method: "GET"
            })
        }),
        getTopGainersLosers: builder.query({
            query: () => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=TOP_GAINERS_LOSERS`,
                method: "GET"
            })
        }),
        getMarketHours: builder.query({
            query: () => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=MARKET_HOURS`,
                method: "GET"
            })
        }),
        getStockSearchResults: builder.query({
            query: (query: string) => ({
                params: {
                    apikey: conf.alpha_vantage_api_key,
                    datatype: "json"
                },
                url: `?function=SYMBOL_SEARCH&keywords=${query}`,
                method: "GET"
            })
        })
    })
})

export const { useGetStockDataIntraDayQuery, useGetStockDataDailyQuery, useGetStockDataWeeklyQuery, useGetStockDataMonthlyQuery, useGetStockNewsQuery, useGetMarketDataQuery, useGetMarketStatsQuery, useGetTopGainersLosersQuery, useGetMarketHoursQuery, useGetStockNewsAllQuery, useGetStockOverviewQuery, useGetStockSearchResultsQuery } = stockDataApi;

export default stockDataApi;
