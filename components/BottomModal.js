import React, { useCallback, useImperativeHandle, useState, useContext } from "react";
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Modal } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, } from "react-native-reanimated";

import themeContext from "../config/themeContext";

const { height: SCREEN_HEIGHT, width } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT / 2 + 20;

export const BottomModal = React.forwardRef((props, ref) => {
    const theme = useContext(themeContext);

    const { 
        children, 
    } = props;

    const [ openModal, setOpenModal ] = useState(false);

    const localStyles = StyleSheet.create({
        container: {
            width: width - 20,
            marginLeft: 10,
            backgroundColor: theme.bottom_modal.background,
            position: "absolute",
            bottom: MAX_TRANSLATE_Y,
            zIndex: 1000,
            maxHeight: SCREEN_HEIGHT / 1.1,
            borderColor: theme.bottom_modal.border,
            borderWidth: 0.5,
            overflow: "hidden",
        },
        line: {
            width: 50,
            height: 4,
            backgroundColor: "gray",
            alignSelf: "center",
            marginVertical: 10,
            borderRadius: 2
        },
        children: {
            margin: 10,
            marginTop: 0
        },
        shadow: {
            backgroundColor: "rgba(1, 1, 1, .5)",
            width: "100%",
            height: "100%",
            transform: [{scale: 1000}],
            zIndex: -1000000000000
        }
    });

    const open = useSharedValue(false);
    const translateY = useSharedValue(0);

    const scrollTo = useCallback((destination) => {
        translateY.value = withSpring(destination);
    });

    const show = useCallback(() => {
        if(open.value) return hide();

        setOpenModal(true);
        open.value = true;
        scrollTo(MAX_TRANSLATE_Y - 20);
    });

    const hide = useCallback(() => {
        open.value = false;
        setOpenModal(false);
        scrollTo(SCREEN_HEIGHT);
    });

    useImperativeHandle(ref, () => ({ hide, show }), [hide, show]);

    const bottomModalStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 15,
            transform: [{ translateY: translateY.value }],
        };
    });

    const lineAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: (translateY.value / 500) > 0 ? 0 : translateY.value / 500 
            }]
        };
    });

    return (
        <Modal
        visible={openModal}
        transparent
        onRequestClose={() => hide()}
        statusBarTranslucent
        >
            <TouchableWithoutFeedback
            onPress={() => hide()}
            >
                <View 
                style={{
                    justifyContent: "flex-end",
                    flex: 1,
                    backgroundColor: "rgba(1, 1, 1, .4)"
                }}
                />
            </TouchableWithoutFeedback>

            <Animated.View style={[localStyles.container, bottomModalStyle]}>
                <Animated.View style={[localStyles.line, lineAnimatedStyle]}/>

                <Animated.View 
                style={localStyles.children}
                >
                    {children}
                </Animated.View>
            </Animated.View>
        </Modal>
    )
});