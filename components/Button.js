import React, { useContext } from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet, ActivityIndicator } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Button = (props) => {
    const theme = useContext(ThemeContext);

    const {
        title, 
        type = 'primary', 
        before = null, 
        after = null,
        onPress = () => {}, 
        buttonStyle = {}, 
        size = "m", 
        backgroundColor,
        loading = false, 
        disabled = false, 
        textColor, 
        onLongPress = () => {},
        containerStyle,
        textStyle,
        noAutoPressBackground = false,
        align = "center"
    } = props;

    const buttonTypesNoBackground = ['outline'];

    const localStyles = StyleSheet.create({
        container: {
            flexGrow: 1, 
            overflow: "hidden", 
            borderRadius: 10,
            margin: 10,
            ...containerStyle
        },
        button: {
            borderRadius: 10,
            overflow: "hidden",
            height: typeof size === "number" ? size : size === "s" ? 30 : size === "m" ? 39 : size === "l" ? 47 : 0,
            backgroundColor: buttonTypesNoBackground.findIndex(item => item === type) !== -1 
            ? "transparent" : backgroundColor ? backgroundColor
            : theme.button[type][`background`],
            borderWidth: type === 'outline' ? 1 : 0,
            borderColor: backgroundColor ? backgroundColor : theme.button.outline.background,
            paddingLeft: size === "l" ? 20 : 15,
            paddingRight: size === "l" ? 20 : 15,
            alignItems: 
            align === "center" ? "center" : 
            align === "left" ? "flex-start" : 
            align === "right" ? "flex-end" : "center",
            justifyContent: "center",
            ...buttonStyle,
        },
        text: {
            textAlign: "center",
            fontSize: size === "s" ? 12 : size === "m" ? 15 : size === "l" ? 17 : 15,
            fontWeight: "600",
            letterSpacing: 0.5,
            color: textColor ? textColor : theme.button[type][`text_color`],
            marginLeft: before && title ? 8 : 0,
            ...textStyle
        },
        textContainer: {
            flexDirection: "row",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    const hexToRGBA = (hex, a) => {
        let m = hex.slice(1).match(/.{2}/g);
            
        const r = parseInt(m[0], 16);
        const g = parseInt(m[1], 16);
        const b = parseInt(m[2], 16);
    
        return `rgba(${r},${g},${b},${a || 1})`;
    };

    const background = () => {
        if(noAutoPressBackground) return theme.button[type][`_ress_background`];

        if(backgroundColor && textColor) return hexToRGBA(textColor, .2);
        if(backgroundColor) return hexToRGBA(backgroundColor, .2);
        if(textColor) return hexToRGBA(textColor, .2);

        return theme.button[type][`press_background`];
    };

    return (
        <View style={localStyles.container}>
            <TouchableNativeFeedback 
            onPress={onPress} 
            onLongPress={onLongPress}
            background={TouchableNativeFeedback.Ripple(background(), false)}
            disabled={
                loading ? true : disabled
            }
            >
                <View style={localStyles.button}>
                    {
                        loading ? 
                        (
                            <ActivityIndicator color={theme.button[type][`text_color`]}/>
                        ) : (
                            <View style={localStyles.textContainer}>
                                {   
                                    before
                                }

                                {
                                    title ? (
                                        <Text 
                                        style={localStyles.text}
                                        numberOfLines={1}
                                        >
                                            {
                                                title
                                            }
                                        </Text>
                                    ) : null
                                }

                                {
                                    after
                                }
                            </View>
                        )
                    }
                </View> 
            </TouchableNativeFeedback>
        </View>
    )
};