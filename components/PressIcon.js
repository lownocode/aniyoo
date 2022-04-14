import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";

export const PressIcon = (props) => {
    const { 
        onPress, 
        style, 
        icon, 
        containerStyle,
        disabled,
        background
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            borderRadius: 100,
            width: 32, 
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            ...containerStyle
        }
    });

    return (
        <TouchableNativeFeedback 
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(background || style.press_icon_background, true)}
        disabled={disabled}
        >
            <View style={localStyles.container}>
                {
                    icon
                }
            </View>
        </TouchableNativeFeedback>
    )
};