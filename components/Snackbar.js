import React, { useCallback, useImperativeHandle } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Snackbar = React.forwardRef((props, ref) => {
    const {
        style,
        text,
        before,
        after,
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            backgroundColor: style.snackbar_background,
            position: "absolute",
            zIndex: 10000,
            bottom: 19,
            left: 10,
            right: 10,
            borderRadius: 7,
            paddingVertical: 15,
            paddingHorizontal: 10
        },
        text: {
            color: "#fff",
            fontSize: 15,
            marginRight: after ? 50 : 25
        },
        content: {
            flexDirection: "row",
            alignItems: "center"
        },
        before: {
            marginRight: before && 10
        },
        after: {
            marginLeft: 10,
            right: 0,
            position: "absolute"
        }
    });

    useImperativeHandle(ref, () => ({ hide, show }), [hide, show]);

    const open = useSharedValue(false);
    const translateX = useSharedValue(-SCREEN_WIDTH);

    const scrollTo = useCallback((destination) => {
        "worklet";
        translateX.value = withSpring(destination, { damping: 15 });
    });

    const show = () => {
        "worklet";

        if(open.value) return hide();

        open.value = true;
        scrollTo(0);
    };

    const hide = (swipe) => {
        "worklet";

        if(!open.value) return;
        open.value = false;

        if(swipe === "left") {
            return scrollTo(-SCREEN_WIDTH);
        }
        else if(swipe === "right") {
            return scrollTo(SCREEN_WIDTH);
        }

        scrollTo(-SCREEN_WIDTH);
    };

    const context = useSharedValue({ x: 0 });
    const gesture = Gesture.Pan()
    .onStart(() => {
        context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
        translateX.value = event.translationX + context.value.x;
    })
    .onEnd(() => {
        if(translateX.value < -SCREEN_WIDTH / 3) {
            return hide("left");
        }
        if(translateX.value > SCREEN_WIDTH / 3) {
            return hide("right");
        }
        
        scrollTo(0);
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });
    
    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[localStyles.container, animatedStyle]}>
                <View style={localStyles.content}>
                    <View style={localStyles.before}>
                        {before}
                    </View>

                    <Text style={localStyles.text}>
                        {text}
                    </Text>

                    <View style={localStyles.after}>
                        {after}
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    )
});