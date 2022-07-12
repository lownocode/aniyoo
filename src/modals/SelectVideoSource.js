import React, { useContext } from "react";
import { View, Text } from "react-native";

import {
    Icon,
    Cell
} from "../components";

import { formatViews, storage } from "../functions";

import ThemeContext from "../config/ThemeContext";

export const SelectVideoSource = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onClose, 
        sources, 
        translation, 
        navigation,
        animeData
    } = props;

    const selectSource = async (source, episodes) => {
        navigation.navigate("anime.select_episode", {
            ...animeData,
            source: source,
            episodes: episodes
        });

        onClose();
    };

    const renderSources = (item, index) => {
        return (
            <View key={"source-" + index}>
                <Cell
                title={item.source}
                subtitle={`Количество серий: ${item.episodes.length}`}
                before={
                    <Icon
                    type="MaterialCommunityIcons"
                    name="source-commit-local"
                    color={theme.icon_color}
                    size={20}
                    />
                }
                after={
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Text
                        style={{
                            marginRight: 10,
                            fontWeight: "300",
                            color: theme.text_secondary_color,
                            fontSize: 12
                        }}
                        >
                            {
                                formatViews(item.views, 2)
                            }
                        </Text>

                        <Icon
                        name="eye-outline"
                        type="Ionicons"
                        color={theme.text_secondary_color}
                        size={15}
                        />
                    </View>
                }
                onPress={() => selectSource(item.source, item.episodes)}
                />

                {
                    index !== sources.length - 1 && (
                        <View style={{
                            backgroundColor: theme.divider_color + "50",
                            height: 1,
                            marginHorizontal: 20
                        }}/>
                    )
                }
            </View>
        )
    };
    
    return (
        <View>
            <Cell
            title="Выбор источника"
            subtitle={`Для ` + translation}
            disabled
            before={
                <Icon
                type="MaterialCommunityIcons"
                name="source-branch"
                color={theme.icon_color}
                size={20}
                />
            }
            />

            <View
            style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.divider_color,
                margin: 10,
                padding: 10
            }}
            >
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5 
                }}
                >
                    <Icon
                    type="Feather"
                    name="info"
                    color={theme.text_color}
                    size={15}
                    />
                    <Text style={{ color: theme.text_color, marginLeft: 5, fontWeight: "500"}}>
                        Подсказка
                    </Text>
                </View>

                <Text style={{ fontWeight: "300", color: theme.text_secondary_color }}>
                    В разных источниках может быть разное количество серий, а также качество видео может быть лучше в некоторых из них.
                </Text>
            </View>

            {sources.map(renderSources)}
        </View>
    )
};