import React, { useState, useContext, useRef, useEffect } from "react";
import { View, Image, Animated } from "react-native";

import { Icon, DonutChart } from ".";

import { normalizeSize } from "../functions";
import ThemeContext from "../config/ThemeContext";

export const Avatar = props => {
    const theme = useContext(ThemeContext);

    const {
        url,
        size,
        containerStyle,
        online = false
    } = props;

    const onlineScaleValue = useRef(new Animated.Value(1)).current;

    const scaleOnline = () => {
        Animated.loop(
            Animated.sequence([
              Animated.timing(onlineScaleValue, {
                toValue: 0.7,
                duration: 1000,
                delay: 500,
                useNativeDriver: true
              }),
              Animated.timing(onlineScaleValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
              })
            ])
        ).start()
    };

    useEffect(() => {
        scaleOnline();
    }, []);

    return (
        <View 
        style={{ 
            justifyContent: "center", 
            alignItems: "center" 
        }}
        >
            <View 
            style={{
                width: size ? normalizeSize(size) : normalizeSize(35),
                height: size ? normalizeSize(size) :  normalizeSize(35),
                borderRadius: 100,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                borderColor: theme.divider_color + "50",
                borderWidth: url ? 0 : 1,
                ...containerStyle
            }}
            >
                {
                    url ? (
                        <Image
                        resizeMethod="resize"
                        style={{ height: "100%", width: "100%" }}
                        source={{
                            uri: url,
                        }}
                        />
                    ) : (
                        <Icon
                        name="logo"
                        size={normalizeSize(size / 1.2)}
                        color={theme.divider_color}
                        />
                    )
                }
            </View>

            {
                online && (
                    <View
                    style={{
                        width: normalizeSize(10),
                        height: normalizeSize(10),
                        backgroundColor: theme.background_content,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Animated.View
                        style={{
                            width: normalizeSize(8),
                            height: normalizeSize(8),
                            backgroundColor: theme.accent,
                            borderRadius: 100,
                            transform: [
                                { 
                                    scale: onlineScaleValue
                                }
                            ]
                        }}
                        />
                    </View>
                )
            }
        </View>
    )
};