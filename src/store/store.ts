import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import stockDataApi from "./stockDataSlice";
import watchListApi from "./watchListSlice";
import articleApi from "./articleSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        stockDataApi: stockDataApi.reducer,
        watchListApi: watchListApi.reducer,
        articleApi: articleApi.reducer
    },
    middleware: (get) => get().concat(watchListApi.middleware, stockDataApi.middleware, articleApi.middleware)
});

export default {store};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
