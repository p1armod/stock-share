import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "",
    userData: null,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        registerStart: (state) => {
            state.status = "loading";
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.status = "success";
            state.userData = action.payload;
            state.error = null;
        },
        registerFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        },
        loginStart: (state) => {
            state.status = "loading";
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.status = "success";
            state.userData = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        },
        logout: (state) => {
            state.status = "success";
            state.userData = null;
            state.error = null;
        }
    }
})

export const { registerStart, registerSuccess, registerFailure, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const selectAuthStatus = (state: { auth: typeof initialState }) => state.auth.status;
export const selectAuthUserData = (state: { auth: typeof initialState }) => state.auth.userData;
export const selectAuthError = (state: { auth: typeof initialState }) => state.auth.error;

export default authSlice.reducer;
