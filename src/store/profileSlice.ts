import { createSlice } from "@reduxjs/toolkit";
import type {Profile} from "../types/Profile";

interface ProfileState {
    profile: Profile | null;
    status: string;
    error: string | null;
}

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: null,
        status: "idle",
        error: null
    } as ProfileState,
    reducers: {
        profileStart: (state) => {
            state.status = "loading";
            state.error = null;
        },
        profileSuccess: (state, action) => {
            state.status = "success";
            state.profile = action.payload;
            state.error = null;
        },
        profileFailure: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        }
    }
})

export const { profileStart, profileSuccess, profileFailure } = profileSlice.actions;

export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileStatus = (state: { profile: ProfileState }) => state.profile.status;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;
