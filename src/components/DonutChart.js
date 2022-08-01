import React, { useContext, useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

import ThemeContext from "../config/ThemeContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const DonutChart = (props) => {
    const theme = useContext(ThemeContext);

    const {
        percentage = 50,
        radius = 40,
        strokeWidth = 10,
        duration = 1000,
        color = theme.donut_chart.color,
        delay = 0,
        centerContent,
        max = 100
    } = props;

    const animatedValue = useRef(new Animated.Value(0)).current;

    const circleRef = useRef();

    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;

    const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true
        }).start();
    };
    
    useEffect(() => {
        animation(percentage);

        animatedValue.addListener(v => {
            const maxPerc = 100 * v.value / max;
            const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc) / 100;

            if(circleRef?.current) {
                circleRef.current.setNativeProps({
                    strokeDashoffset
                });
            }
        });

        return () => {
            animatedValue.removeAllListeners();
        };
    }, [max, percentage]);
    
    return (
        <View>
            <Svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
            >
                <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle 
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={.2}
                    fill="transparent"
                    />
                    <AnimatedCircle
                    ref={circleRef} 
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleCircumference}
                    strokeLinecap="round"
                    />
                </G>
            </Svg>

            <View
            style={[
                StyleSheet.absoluteFillObject,
                {
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    transform: [
                        {
                            scale: 0.8
                        }
                    ]
                }
            ]}
            >
                {centerContent}
            </View>
        </View>
    )
};