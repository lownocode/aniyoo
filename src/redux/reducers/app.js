import { createSlice } from "@reduxjs/toolkit"

const appSlice = createSlice({
    name: "app",
    initialState: {
        bottomTabBarShown: true,
        modal: {
            visible: false
        }
    },
    reducers: {
        setModalVisible: (state, action) => {
            const { payload } = action;

            console.log(payload)
            state.modal.visible = payload;
        },
    }
});

export const appReducer = appSlice.reducer;

export const { setModalVisible } = appSlice.actions;