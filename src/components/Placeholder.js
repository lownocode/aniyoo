import React, { useContext } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Placeholder = (props) => {
    const theme = useContext(ThemeContext);

    const {
        title = "", 
        subtitle = "", 
        button, 
        icon,
        containerStyle
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            ...containerStyle
        },
        box: {
            width: Dimensions.get("window").width - 100,
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            color: theme.placeholder.title,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 5
        },
        subtitle: {
            textAlign: "center",
            color: theme.placeholder.subtitle,
            marginBottom: 10
        }
    });

    return (
        <View style={localStyles.container}>
            <View style={localStyles.box}>
                <View style={{marginBottom: 15}}>
                    {icon}
                </View>
                
                <Text style={localStyles.title}>
                    {title}
                </Text>

                <Text style={localStyles.subtitle}>
                    {subtitle}
                </Text>

                {button}
            </View>
        </View>
    )
};