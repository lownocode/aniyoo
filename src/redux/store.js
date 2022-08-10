import { configureStore } from "@reduxjs/toolkit";

import {
    themeReducer
} from "./reducers";

export const store = configureStore({
    reducer: {
        theme: themeReducer
    },
})