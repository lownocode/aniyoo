import React, { useContext } from "react";
import { View, Text } from "react-native";

import {
    Divider,
    Header
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const Bookmarks = props => {
    const theme = useContext(ThemeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Списки"
            height={30}
            />
        </View>
    )
};