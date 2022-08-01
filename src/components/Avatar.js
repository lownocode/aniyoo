import React, { useContext, useRef, useEffect } from "react";
import { View, Image, Animated } from "react-native";

import { Icon } from ".";

import ThemeContext from "../config/ThemeContext";

export const Avatar = (props) => {
    const theme = useContext(ThemeContext);

    const {
        url, 
        size, 
        containerStyle, 
        online = false,
        blurRadius = 0
    } = props;

    const onlineScaleValue = useRef(new Animated.Value(1)).current;

    const scaleOnline = () => {
        Animated.loop(
        Animated.sequence([
            Animated.timing(onlineScaleValue, {
                toValue: 0.7,
                duration: 1000,
                delay: 500,
                useNativeDriver: true,
            }),
            Animated.timing(onlineScaleValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ])
        ).start();
    };

    useEffect(() => {
        scaleOnline();
    }, []);

    return (
        <View
        style={{
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        <View
            style={{
            width: size ? size : 45,
            height: size ? size : 45,
            borderRadius: 100,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            borderColor: theme.divider_color + "50",
            borderWidth: url ? 0 : 1,
            ...containerStyle,
            }}
        >
            {url ? (
            <Image
            resizeMethod="resize"
            style={{ height: "100%", width: "100%" }}
            source={{
            uri: url,
            }}
            blurRadius={blurRadius}
            />
            ) : (
            <Icon
                name="logo"
                size={size / 1.2}
                color={theme.divider_color}
            />
            )}
        </View>

        {online && (
            <View
            style={{
                width: 12,
                height: 12,
                backgroundColor: theme.background_content,
                position: "absolute",
                bottom: 0,
                right: 0,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <Animated.View
                style={{
                width: 10,
                height: 10,
                backgroundColor: theme.accent,
                borderRadius: 100,
                transform: [
                    {
                    scale: onlineScaleValue,
                    },
                ],
                }}
            />
            </View>
        )}
        </View>
    );
};
