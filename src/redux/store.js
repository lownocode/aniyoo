import { configureStore } from "@reduxjs/toolkit";

import {
    themeReducer, 
    userReducer
} from "./reducers";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer
    },
})