import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

// type of state for user related info
interface UserState
{
    isLoggedIn: boolean;
    token: string | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
}

// the actual initial state value
const initialState: UserState =
{
    isLoggedIn: false,
    token: localStorage.getItem("token"),
    userId: null,
    userName: null,
    userEmail: null
};

export const userSlice = createSlice(
{
    name: 'user',
    initialState,
    reducers: {
        // to allow setting of token: can be used at the time of login and logout
        setToken: (state, action: PayloadAction<{ token: string | null }>) =>
        {
            state.token = action.payload.token;
            if (action.payload.token)
            {
                localStorage.setItem("token", action.payload.token);
            }
            else
            {
                localStorage.removeItem("token");
            }
        },

        // to allow setting of user's info.
        // can be used after logging in and getting the user's info
        login: (
            state,
            action: PayloadAction<{
                token: string;
                userId: string;
                userName: string;
                userEmail: string;
            }>
        ) =>
        {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
            state.userEmail = action.payload.userEmail;
            localStorage.setItem("token", action.payload.token);
        },

        // to log the user out, ie, remove all user info from state
        // can be used after logging out and deleting token
        logout: (state) =>
        {
            state.isLoggedIn = false;
            state.token = null;
            state.userId = null;
            state.userName = null;
            state.userEmail = null;
            localStorage.removeItem("token");
        }
    }
});

export default userSlice.reducer;
export const { login, logout, setToken } = userSlice.actions;
export type {UserState};