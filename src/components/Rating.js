import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";

import {
    Icon,
    PressIcon,
    Button,
    Cell
} from ".";

import ThemeContext from "../config/ThemeContext";

export const Rating = props => {
    const theme = useContext(ThemeContext);

    const {
        length,
        select = 0,
        containerStyle,
        onPress = () => null,
        cancelPress = () => null
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            ...containerStyle
        },
        convergence_icon: {
            marginRight: 2.5
        },
        selected_icon: {
            marginRight: 2.5
        },
        icons: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 25
        }
    });

    const convergenceIconsRender = (_, index) => {
        return (
            <View
            key={`icon-${index}`}
            style={localStyles.convergence_icon}
            >
                <PressIcon
                onPress={() => onPress(index + 1)}
                icon={
                    <Icon
                    name="star"
                    type="FontAwesome"
                    size={25}
                    color="gold"
                    />
                }
                />
            </View>
        )
    };

    const unselectedIconsRender = (_, index) => {
        return (
            <View
            key={`icon-${index}`}
            style={localStyles.selected_icon}
            >
                <PressIcon
                onPress={() => onPress(select + (index + 1))}
                icon={
                    <Icon
                    name="star-o"
                    type="FontAwesome"
                    size={25}
                    color={theme.icon_color}
                    />
                }
                />
            </View>
        )
    };

    return (
        select ? (
            <View 
            style={{
                flex: 1
            }}
            >
                <Cell
                disabled
                before={
                    <Text
                    style={{
                        fontWeight: "700",
                        fontSize: 45,
                        color: theme.text_color
                    }}
                    >
                        {select}
                    </Text>
                }
                after={
                    <Button
                    title="Отменить"
                    upperTitle={false}
                    onPress={cancelPress}
                    type="outline"
                    />
                }
                title={
                    <View
                    style={{
                        flexDirection: "row"
                    }}
                    >
                        {
                            Array.from({ length: length - (length - select) }).map(convergenceIconsRender) 
                        }
                        {
                            Array.from({ length: length - select }).map(unselectedIconsRender)
                        }
                    </View>
                }
                subtitle="Ваша оценка"
                />
            </View>
        ) : (
            <View style={localStyles.container}>
                <View style={localStyles.icons}>
                    {
                        Array.from({ length: length - (length - select) }).map(convergenceIconsRender) 
                    }
                    {
                        Array.from({ length: length - select }).map(unselectedIconsRender)
                    }
                </View>
            </View>
        )
    )
};