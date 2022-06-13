import React, { useContext } from "react";
import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";

import themeContext from "../config/themeContext";

export const Cell = (props) => {
    const theme = useContext(themeContext);

    const { 
        onPress,
        title,
        subtitle,
        disabled,
        before,
        after,
        containerStyle,
        centered = true,
        titleStyle,
        maxTitleLines,
        maxSubtitleLines,
        beforeStyle,
        centeredBefore = false,
        subtitleStyle,
        contentStyle,
        additionalContentTop = null,
        additionalContentBottom = null
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 15,
            ...containerStyle
        },
        content: {
            flex: 1,
            justifyContent: centered ? "center" : "flex-start",
            ...contentStyle
        },
        box: {
            flexDirection: "row",
            alignItems: "center",
        },
        title: {
            color: theme.cell.title_color,
            fontSize: 16.5,
            flex: 1,
            fontWeight: "500",
            ...titleStyle,
        },
        subtitle: {
            color: theme.cell.subtitle_color,
            fontSize: 15,
            flex: 1,
            ...subtitleStyle
        },
        before: {
            justifyContent: centered || centeredBefore ? "center" : "flex-start",
            marginRight: before ? 15 : 0,
            zIndex: 0,
            ...beforeStyle
        },
        after: {
            justifyContent: "center",
        }
    });

    return (
        <TouchableNativeFeedback 
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
        disabled={disabled}
        >
            <View>
                {additionalContentTop}

                <View style={localStyles.container}>
                    <View style={localStyles.before}>
                        {before}
                    </View>

                    <View style={localStyles.content}>
                        <View style={localStyles.box}>
                            <View>
                                {
                                    title && typeof title === "string" ?
                                    (
                                        <Text 
                                        style={localStyles.title} 
                                        numberOfLines={maxTitleLines}
                                        >
                                            {title}
                                        </Text>
                                    ) : title ? title : null
                                }

                                {
                                    subtitle && typeof subtitle === "string" ?
                                    (
                                        <Text 
                                        style={localStyles.subtitle}
                                        numberOfLines={maxSubtitleLines}
                                        >
                                            {subtitle}
                                        </Text>
                                    ) : subtitle ? subtitle : null
                                }
                            </View>
                        </View>
                    </View>

                    <View style={localStyles.after}>
                        {after}
                    </View>
                </View>

                {
                    additionalContentBottom
                }
            </View>
        </TouchableNativeFeedback>
    )
};