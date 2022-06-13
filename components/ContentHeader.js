import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import themeContext from "../config/themeContext";

export const ContentHeader = (props) => {
    const theme = useContext(themeContext);

    const { 
        text, 
        align = "left", 
        upper = true, 
        indents = false, 
        containerStyle, 
        textStyle,
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
            color: theme.accent,
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