import React, { useContext, useRef, useEffect, useState } from "react";
import { View, Image, Animated, ActivityIndicator } from "react-native";

import { Icon } from ".";

import ThemeContext from "../config/ThemeContext";

export const Avatar = (props) => {
    const theme = useContext(ThemeContext);

    const {
        url, 
        size = 45, 
        containerStyle, 
        online = false,
        blurRadius = 0
    } = props;

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

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
        <View>
            <View
            style={{
                width: size,
                height: size,
                borderRadius: 100,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                borderColor: theme.divider_color + "50",
                borderWidth: url ? 0 : 1,
                backgroundColor: loading ? theme.activity_indicator_color + "10" : "transparent",
                ...containerStyle,
            }}
            >
                {
                    loading && (
                        <View
                        style={{
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100
                        }}
                        >
                            <ActivityIndicator
                            size={size / 2}
                            color={theme.activity_indicator_color}
                            />
                        </View>
                    )
                }

                {
                    (error && !loading) && (
                        <View
                        style={{
                            backgroundColor: "#f55a0010",
                            width: size,
                            height: size,
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            zIndex: 100
                        }}
                        >
                            <Icon
                            name="warning"
                            color="#f55a00"
                            size={size / 2}
                            />
                        </View>
                    )
                }

                {
                    url ? (
                        <Image
                        resizeMethod="resize"
                        style={{ height: "100%", width: "100%" }}
                        source={{
                            uri: url,
                        }}
                        blurRadius={blurRadius}
                        onError={() => {
                            setError(true);
                            setLoading(false);
                        }}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        />
                    ) : (
                        <Icon
                        name="logo"
                        size={size / 1.2}
                        color={theme.divider_color}
                        />
                    )
                }
            </View>

            {
                online && (
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
                )
            }
        </View>
    );
};
