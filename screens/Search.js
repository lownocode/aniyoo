import React from "react";
import { View, Text } from "react-native";

import {
    Divider,
    Header
} from "../components";

export const Search = props => {
    const { 
        style,
    } = props;

    return (
        <View style={style.view}>
            <Header
            title="Поиск"
            titleStyle={style.header_title}
            height={30}
            backgroundColor={style.header_background_color}
            style={style}
            />
        </View>
    )
};