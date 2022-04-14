import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";

export const Avatar = props => {
    const {
        url,
        size,
        containerStyle,
        borderRadius = 20,
        style
    } = props;

    const [ imageLoadEnd, setImageLoadEnd ] = useState(false);

    const localStyles = StyleSheet.create({
        container: {
            backgroundColor: imageLoadEnd ? "transparent" : style.divider_color,
            width: size ? size : 50,
            height: size ? size :  50,
            borderRadius: borderRadius,
            overflow: "hidden",
            ...containerStyle
        },
        image: {
            height: "100%",
            borderWidth: 1,
            borderColor: style.divider_color,
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
                uri: url
            }}
            />
        </View>
    )
};