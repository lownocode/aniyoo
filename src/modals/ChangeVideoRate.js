import React, { useContext } from "react";
import { TouchableNativeFeedback, View, Text } from "react-native";

import {
    Button,
    Cell,
    Divider,
    Icon
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const ChangeVideoRate = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onClose, 
        setRate,
        selectedRate
    } = props;

    const renderRates = (item, index) => {
        return (
            <TouchableNativeFeedback
            key={"rate-" + index}
            onPress={() => {
                setRate(item.rate);
                onClose();
            }}
            >
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 15,
                    paddingVertical: 9
                }}
                >
                    <View
                    style={{
                        width: 50
                    }}
                    >
                        <Text
                        style={{
                            color: selectedRate === item.rate ? theme.accent : theme.text_secondary_color,
                            fontWeight: "700",
                        }}
                        >
                            {item.rate}x
                        </Text>
                    </View>

                    <Text
                    style={{
                        color: selectedRate === item.rate ? theme.accent : theme.text_color,
                        fontWeight: "500"
                    }}
                    >
                        {item.name}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        )
    };
    
    return (
        <View>
            <Cell
            title="Скорость воспроизведения"
            subtitle="Выберите желаемую скорость"
            disabled
            before={
                <Icon
                type="MaterialCommunityIcons"
                name="motion-play-outline"
                size={20}
                color="#fff"
                />
            }
            />
            {
                [
                    { rate: 0.25, name: "Очень медленно" },
                    { rate: 0.75, name: "Умеренно" },
                    { rate: 1, name: "По умолчанию" },
                    { rate: 1.25, name: "Быстрее обычного" },
                    { rate: 1.75, name: "Быстро" },
                    { rate: 2, name: "Очень быстро" },
                ].map(renderRates)
            }
        </View>
    )
};