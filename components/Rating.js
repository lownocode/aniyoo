import React from "react";
import { View, StyleSheet } from "react-native";

export const Rating = props => {
    const {
        length,
        select,
        containerStyle,
        iconSelect,
        iconUnselect
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            flexDirection: "row",
            ...containerStyle
        },
        convergence_icon: {
            marginRight: 2.5
        },
        selected_icon: {
            marginRight: 2.5
        }
    });

    const convergenceIconsRender = (_, index) => (
        <View
        key={`icon-${index}`}
        style={localStyles.convergence_icon}
        >
            {iconSelect}
        </View>
    );

    const unselectedIconsRender = (_, index) => (
        <View
        key={`icon-${index}`}
        style={localStyles.selected_icon}
        >
            {
                iconUnselect
            }
        </View>
    );

    return (
        <View style={localStyles.container}>
            {
                Array.from({ length: length - (length - select) }).map(convergenceIconsRender) 
            }
            {
                Array.from({ length: length - select }).map(unselectedIconsRender)
            }
        </View>
    )
};