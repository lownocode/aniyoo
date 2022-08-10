import React, { useRef } from "react";
import { 
    View, 
    TouchableNativeFeedback, 
    StyleSheet, 
    ActivityIndicator,
    Text,
    Animated
} from "react-native";
import { useSelector } from "react-redux";

export const Button = (props) => {
    const { theme: { theme } } = useSelector(state => state);

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

    const buttonScale = useRef(new Animated.Value(1)).current;

    const buttonTypesNoBackground = ['outline'];

    const localStyles = StyleSheet.create({
        container: {
            flexGrow: 1, 
            overflow: "hidden", 
            borderRadius: 10,
            margin: 10,
            opacity: disabled ? 0.5 : 1,
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
            fontSize: 17,
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

    const scaleAnimation = (scale) => {
        Animated.timing(buttonScale, {
            toValue: scale,
            duration: 100,
            useNativeDriver: false
        }).start();
    };

    return (
        <Animated.View style={[localStyles.container, { transform: [{ scale: buttonScale }]}]}>
            <TouchableNativeFeedback 
            onPress={onPress}
            onPressIn={() => scaleAnimation(0.95)}
            onPressOut={() => scaleAnimation(1)} 
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
        </Animated.View>
    )
};