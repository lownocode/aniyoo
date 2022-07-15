import React, { useContext } from "react";
import { View } from "react-native";

import {
    Header,
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const Home = () => {
    const theme = useContext(ThemeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Главная"
            height={30}
            />
        </View>
    )
};