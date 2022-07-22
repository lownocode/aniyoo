import React, { useContext } from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";

import ThemeContext from "../config/ThemeContext";
import { normalizeSize } from "../functions";

export const PressIcon = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onPress, 
        icon, 
        containerStyle,
        disabled,
        background,
        onPressIn
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            borderRadius: 100,
            width: normalizeSize(26), 
            height: normalizeSize(26),
            justifyContent: "center",
            alignItems: "center",
            ...containerStyle
        }
    });

    return (
        <TouchableNativeFeedback 
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(background || theme.press_icon_background, true)}
        disabled={disabled}
        onPressIn={onPressIn}
        >
            <View style={localStyles.container}>
                {
                    icon
                }
            </View>
        </TouchableNativeFeedback>
    )
};