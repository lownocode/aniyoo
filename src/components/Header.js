import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import { STATUSBAR_HEIGHT } from "../../constants";
import { Icon, PressIcon } from ".";

export const Header = props => {
    const { theme } = useSelector(state => state.theme);

    const {
        title,
        subtitle,
        backOnPress,
        afterActions,
        beforeActions
    } = props;

    return (
        <View style={{ zIndex: 10 }}>
            <View
            style={{
                height: STATUSBAR_HEIGHT,
                backgroundColor: theme.background_content
            }}
            />

            <View
            style={{
                backgroundColor: theme.background_content,
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 17
            }}
            >
                {
                    backOnPress && (
                        <View>
                            <PressIcon
                            onPress={() => backOnPress()}
                            icon={
                                <Icon
                                name="arrow-back"
                                color={theme.text_color}
                                />
                            }
                            />
                        </View>
                    )
                }

                {
                    beforeActions && (
                        <View>
                            {
                                beforeActions
                            }
                        </View>
                    )
                }
                
                <View
                style={{
                    flex: 1,
                }}
                >
                    <Text
                    numberOfLines={1}
                    style={{
                        color: theme.text_color,
                        fontSize: 20,
                        fontWeight: "600",
                        marginLeft: backOnPress ? 15 : 0
                    }}
                    >
                        {
                            title
                        }
                    </Text>

                    {
                        subtitle && (
                            <Text
                            numberOfLines={1}
                            style={{
                                color: theme.text_secondary_color,
                                fontWeight: "400"
                            }}
                            >
                                {
                                    subtitle
                                }
                            </Text>
                        )
                    }
                </View>

                {
                    afterActions && (
                        <View>
                            {
                                afterActions
                            }
                        </View>
                    )
                }
            </View>

            <View
            style={{
                backgroundColor: theme.divider_color,
                height: 0.5,
                marginHorizontal: 15,
                opacity: 0.5
            }}
            />
        </View>
    )
};