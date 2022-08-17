import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { storage } from "../../functions";

export const getUserData = createAsyncThunk("user/fetchData", async (notifyToken) => {
    const sign = await storage.getItem("AUTHORIZATION_SIGN");
    
    return axios.post("/users.signIn", { notifyToken }, {
        headers: {
            "Authorization": sign
        }
    })
    .then(({ data }) => {
        return data;
    })
    .catch(({ response: { data } }) => {
        return {
            error: true,
            ...data
        }
    })
}); 

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        loading: false
    },
    reducers: {
        setUser: (state, action) => {
            const { payload } = action;

            state.user = payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getUserData.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        })
    }
});

export const userReducer = userSlice.reducer;

export const { setUser } = userSlice.actions;