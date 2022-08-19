import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import SplashScreen from "react-native-splash-screen";

import { storage } from "../../functions";
import { getModalById } from "../../modals";

export const getAuthorized = createAsyncThunk("app/getAuthorized", async () => {
    const sign = storage.getItem("AUTHORIZATION_SIGN");

    return Boolean(sign);
});

const appSlice = createSlice({
    name: "app",
    initialState: {
        bottomTabBarShown: true,
        authorized: false,
        modal: {
            id: "",
            visible: false,
            props: {}
        }
    },
    reducers: {
        setAuthorized: (state, action) => {
            const { payload: isSignedIn } = action;

            state.authorized = isSignedIn;
        },
        openModal: (state, action) => {
            const { 
                payload: { 
                    id = "none",
                    props, 
                } 
            } = action;

            state.modal.props = props;
            state.modal.id = id;
            state.modal.visible = true;
        },
        closeModal: (state) => {
            state.modal.visible = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(getAuthorized.fulfilled, (state, action) => {
            const { payload: isSignedIn } = action;

            state.authorized = isSignedIn;

            if(isSignedIn) {
                return SplashScreen.hide();
            } 
        })
    }
});

export const appReducer = appSlice.reducer;
export const { setAuthorized, openModal, closeModal } = appSlice.actions;