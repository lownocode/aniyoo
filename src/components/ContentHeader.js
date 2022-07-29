import React, { useContext } from "react";
import { View, Text, TouchableNativeFeedback } from "react-native";

import ThemeContext from "../config/ThemeContext";
import { normalizeSize } from "../functions";

export const ContentHeader = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        text, 
        icon,
        after,
        onPress = false,
        background,
        textColor
    } = props;

    return (
        <View
        style={{
            flexDirection: after ? "column" : "row"
        }}
        >
            <View
            style={{
                backgroundColor: background || theme.text_secondary_color + "10",
                borderRadius: 100,
                marginHorizontal: 10,
                overflow: "hidden"
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                disabled={!onPress}
                onPress={() => onPress()}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 8,
                            marginHorizontal: 15,
                        }}
                        >
                            {
                                icon
                            }

                            <Text
                            style={{
                                color: textColor || theme.text_secondary_color,
                                fontWeight: "500",
                                fontSize: 14,
                                marginLeft: icon ? 8 : 0
                            }}
                            >
                                {
                                    text
                                }
                            </Text>
                        </View>

                        {
                            after
                        }
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
};