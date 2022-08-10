import React from "react";
import { View, TouchableNativeFeedback, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";

export const Cell = (props) => {
    const { theme: { theme } } = useSelector(state => state);

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
        additionalContentBottom = null,
        centeredAfter = true,
        onLongPress,
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 15,
            flex: 1,
            width: "100%",
            alignItems: centered ? "center" : "flex-start",
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
            fontSize: 17,
            flex: 1,
            fontWeight: "500",
            ...titleStyle,
        },
        subtitle: {
            color: theme.cell.subtitle_color,
            fontSize: 14,
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
            justifyContent: centered || centeredAfter ? "center" : "flex-start",
        }
    });

    return (
        <TouchableNativeFeedback 
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
        disabled={disabled}
        onLongPress={onLongPress}
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