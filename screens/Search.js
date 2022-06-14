import React, { useContext } from "react";
import { View } from "react-native";

import {
    Header
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const Search = () => {
    const theme = useContext(ThemeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Поиск"
            height={30}
            />
        </View>
    )
};