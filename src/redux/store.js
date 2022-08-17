import { configureStore } from "@reduxjs/toolkit";

import {
    themeReducer, 
    userReducer,
    appReducer
} from "./reducers";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        app: appReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
})