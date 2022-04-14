import React from "react";

import { View, Text, Dimensions, StyleSheet } from "react-native";

export const Placeholder = (props) => {
    const {
        title = "", 
        style, 
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
            color: style.placeholder_title_color,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 5
        },
        subtitle: {
            textAlign: "center",
            color: style.placeholder_subtitle_color,
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