import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const ContentHeader = (props) => {
    const { 
        text, 
        align = "left", 
        upper = true, 
        indents = false, 
        containerStyle, 
        textStyle,
        style
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            marginLeft: indents ? 20 : 0, 
            marginRight: indents ? 20 : 0,
            marginTop: indents ? 7 : 0,
            marginBottom: indents ? 7 : 0,
            ...containerStyle
        },
        text: {
            fontWeight: "600",
            textAlign: align,
            fontSize: 13,
            color: style.accent,
            ...textStyle
        }
    });

    return (
        <View
        style={localStyles.container}
        >
            <Text
            style={localStyles.text}
            >
                {
                    upper ? String(text).toUpperCase() : text
                }
            </Text>
        </View>
    )
};