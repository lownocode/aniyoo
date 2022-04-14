import React from "react";

import { View, Modal, TouchableWithoutFeedback, StyleSheet, Dimensions } from "react-native";

export const Overlay = (props) => {
    const {
        isVisible = true,
        onBackdropPress,
        children,
        overlayStyle,
        style,
        snackbar
    } = props;

    const localStyles = StyleSheet.create({
        backdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, .3)',
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        overlay: {
            padding: 0,
            backgroundColor: style.overlay_background || "white",
            borderRadius: 10,
            width: Dimensions.get('window').width - 30,
            maxHeight: "80%",
            ...overlayStyle,
        },
    });

    return (
        <Modal 
        visible={isVisible} 
        transparent
        onRequestClose={onBackdropPress}
        statusBarTranslucent
        >
            <TouchableWithoutFeedback
            onPress={onBackdropPress} 
            testID="RNE__Overlay__backdrop"
            >
                <View testID="backdrop" style={localStyles.backdrop}/>
            </TouchableWithoutFeedback>

            <View style={localStyles.container} pointerEvents="box-none">
                <View style={localStyles.overlay}>
                    {children}
                </View>
            </View>

            {snackbar}
        </Modal>
    )
};