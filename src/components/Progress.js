import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, View, Text } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Progress = (props) => {
    const theme = useContext(ThemeContext);

    const {
        step = 0,
        steps = 0,
        height = 10,
        duration = 300,
        background = theme.progress.background,
        selectColor = theme.progress.background + "20",
        borderRadius = 100
    } = props;

    const [ width, setWidth ] = useState(0);

    const animatedValue = useRef(new Animated.Value(0)).current;
    const reactive = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: duration,
            useNativeDriver: true
        }).start();
    }, []);

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width, steps]);

    return (
        <View
        style={{
            height: height,
            backgroundColor: selectColor,
            borderRadius: borderRadius,
            overflow: "hidden",
            flex: 1,
        }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View
            style={{
                [!width && "display"]: "none",
                flex: 1,
                height: height,
                width: "100%",
                borderRadius: borderRadius,
                backgroundColor: background,
                position: "absolute",
                left: 0,
                top: 0,
                transform: [{
                    translateX: animatedValue
                }]
            }}
            />
        </View>
    )
};