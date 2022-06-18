import React, { useState, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Avatar = props => {
    const theme = useContext(ThemeContext);

    const {
        url,
        size,
        containerStyle,
        borderRadius = 20,
    } = props;

    const [ imageLoadEnd, setImageLoadEnd ] = useState(false);

    const localStyles = StyleSheet.create({
        container: {
            backgroundColor: imageLoadEnd ? "transparent" : theme.divider_color,
            width: size ? size : 50,
            height: size ? size :  50,
            borderRadius: borderRadius,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.divider_color,
            ...containerStyle
        },
        image: {
            height: "100%",
        },
    });

    return (
        <View style={localStyles.container}>
            <Image
            resizeMethod="resize"
            style={localStyles.image}
            borderRadius={borderRadius}
            onLoadEnd={() => setImageLoadEnd(true)}
            source={{
                uri: url,
                cache: "reload"
            }}
            />
        </View>
    )
};