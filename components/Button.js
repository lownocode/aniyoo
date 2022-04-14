import React from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet, ActivityIndicator } from "react-native";

export const Button = (props) => {
    const {
        title, 
        type = 'primary', 
        before = null, 
        after = null,
        onPress = () => {}, 
        buttonStyle = {}, 
        size = "m", 
        backgroundColor,
        style, 
        loading = false, 
        disabled = false, 
        textColor, 
        upperTitle = true,
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
            : style[`button_` + type + `_background`],
            borderWidth: type === 'outline' ? 1 : 0,
            borderColor: backgroundColor ? backgroundColor : style.button_outline_background,
            paddingLeft: size === "l" ? 20 : 10,
            paddingRight: size === "l" ? 20 : 10,
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
            color: textColor ? textColor : style[`button_` + type + `_text_color`],
            marginLeft: before && 5,
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
        if(noAutoPressBackground) return style[`button_` + type + `_press_background`];

        if(backgroundColor && textColor) return hexToRGBA(textColor, .2);
        if(backgroundColor) return hexToRGBA(backgroundColor, .2);
        if(textColor) return hexToRGBA(textColor, .2);

        return style[`button_` + type + `_press_background`];
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
                            <ActivityIndicator style={style.activity_indicator} color={style[`button_` + type + `_text_color`]}/>
                        ) : (
                            <View style={localStyles.textContainer}>
                                {   
                                    before
                                }

                                <Text 
                                style={localStyles.text}
                                numberOfLines={1}
                                >
                                    {
                                        upperTitle ? 
                                        String(title).toLocaleUpperCase() :
                                        title
                                    }
                                </Text>

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