import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import changeNavigationBarColor from "react-native-navigation-bar-color";

import theme from "../../config/theme";
import { storage } from "../../functions";

export const getTheme = createAsyncThunk("theme/getTheme", async () => {
    const isDarkMode = await storage.getItem("DARK_THEME_MODE") ?? true;

    changeNavigationBarColor(isDarkMode ? theme.DARK.bottom_tabbar.background : theme.LIGHT.bottom_tabbar.background, !isDarkMode, true);
    
    return isDarkMode ? theme.DARK : theme.LIGHT;
});

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: theme.DARK
    },
    reducers: {
        setTheme: (state, action) => {
            const { payload } = action;

            const isDarkMode = payload === "DARK" ? true : false;

            state.theme = theme[payload];
            changeNavigationBarColor(isDarkMode ? theme.DARK.bottom_tabbar.background : theme.LIGHT.bottom_tabbar.background, !isDarkMode, true);
            storage.setItem("DARK_THEME_MODE", isDarkMode);
        }
    },
    extraReducers: builder => {
        builder.addCase(getTheme.fulfilled, (state, action) => {
            state.theme = action.payload;
        })
    }
});

export const themeReducer = themeSlice.reducer;

export const { setTheme } = themeSlice.actions;