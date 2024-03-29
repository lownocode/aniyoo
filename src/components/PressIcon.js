import React from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useSelector } from "react-redux";

export const PressIcon = (props) => {
    const { theme } = useSelector(state => state.theme);

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
            width: 35, 
            height: 35,
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