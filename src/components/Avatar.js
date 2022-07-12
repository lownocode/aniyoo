import React, { useState, useContext, useRef, useEffect } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Avatar = props => {
    const theme = useContext(ThemeContext);

    const {
        url,
        size,
        containerStyle,
        borderRadius = 20,
        online = false
    } = props;

    const [ imageLoadEnd, setImageLoadEnd ] = useState(false);

    const onlineScaleValue = useRef(new Animated.Value(1)).current;

    const localStyles = StyleSheet.create({
        container: {
            
        },
        image: {
            height: "100%",
        },
    });

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
                backgroundColor: imageLoadEnd ? "transparent" : theme.divider_color,
                width: size ? size : 50,
                height: size ? size :  50,
                borderRadius: borderRadius,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: theme.divider_color,
                ...containerStyle
            }}
            >
                <Image
                resizeMethod="resize"
                style={localStyles.image}
                borderRadius={borderRadius}
                onLoadEnd={() => setImageLoadEnd(true)}
                source={{
                    uri: url,
                    cache: "reload"
                }}
                />
            </View>

            {
                online && (
                    <View
                    style={{
                        width: 13,
                        height: 13,
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
                            width: 10,
                            height: 10,
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