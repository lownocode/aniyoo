import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

export const Divider = () => {
    const { theme: { theme } } = useSelector(state => state);

    return (
        <LinearGradient
        style={{
            height: 0.7,
            marginHorizontal: 15
        }}
        colors={[
            "transparent",
            theme.divider_color,
            theme.divider_color,
            theme.divider_color,
            theme.divider_color,
            theme.divider_color,
            "transparent"
        ]}
        start={{
            x: 1,
            y: 0
        }}
        end={{
            x: 0,
            y: 0
        }}
        />
    )
};