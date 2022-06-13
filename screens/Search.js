import React, { useContext } from "react";
import { View } from "react-native";

import {
    Header
} from "../components";

import themeContext from "../config/themeContext";

export const Search = () => {
    const theme = useContext(themeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Поиск"
            height={30}
            />
        </View>
    )
};