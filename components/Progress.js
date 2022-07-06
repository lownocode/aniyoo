import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Progress = (props) => {
    const theme = useContext(ThemeContext);

    const {
        step = 0,
        steps = 0,
        height = 10,
    } = props;

    const [ width, setWidth ] = useState(0);

    const animatedValue = useRef(new Animated.Value(-1000)).current;
    const reactive = useRef(new Animated.Value(-1000)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, []);

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width]);

    return (
        <View
        style={{
            height: height,
            backgroundColor: theme.progress.background + "20",
            borderRadius: 100,
            overflow: "hidden",
            flex: 1
        }}
        onLayout={(e) => {
            const newWidth = e.nativeEvent.layout.width;
            setWidth(newWidth);
        }}
        >
            <Animated.View
            style={{
                flex: 1,
                height: height,
                width: "100%",
                borderRadius: 100,
                backgroundColor: theme.progress.background,
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