import React, { useContext, useState } from "react";
import { View, ScrollView, Image, Text , ToastAndroid, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

export const LinkedAnime = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const route = useRoute();

    const [ animeList ] = useState(route.params?.animeList || {});

    const renderList = ({ item, index }) => {
        return (
            <View
            key={"linked-anime-" + index}
            >
                <Cell
                title={item.name}
                centered={false}
                maxTitleLines={2}
                onPress={() => {
                    if(!item.id) {
                        return ToastAndroid.show("К сожалению, такого аниме ещё нет в нашем приложении", ToastAndroid.CENTER)
                    }
                    
                    navigation.reset({
                        routes: [
                            { 
                                name: "anime",
                                params: {
                                    animeData: {
                                        id: item.id
                                    }
                                }
                            }
                        ]
                    })
                }}
                before={
                    <View
                    style={{
                        borderRadius: 6, 
                        backgroundColor: theme.divider_color,
                        position: "relative",
                        overflow: "hidden",
                    }}
                    >
                        <Image
                        resizeMethod="resize"
                        style={{
                            width: 55,
                            height: 80,
                            borderRadius: 8
                        }}
                        source={{
                            uri: item.poster
                        }}
                        />

                        {
                            item.inList !== "none" && (
                                <View>
                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        backgroundColor: theme.anime[item.inList], 
                                        opacity: 0.85,
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        textAlign: "center",
                                        color: "#fff",
                                        fontSize: 12,
                                        paddingHorizontal: 3,
                                        fontWeight: "500"
                                    }}
                                    >
                                        {
                                            item.inList === "watching" ? "Смотрю" :
                                            item.inList === "completed" ? "Просмотрено" :
                                            item.inList === "planned" ? "В планах" :
                                            item.inList === "postponed" ? "Отложено" :
                                            item.inList === "dropped" ? "Брошено" : null
                                        }
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                }
                containerStyle={{
                    opacity: item.id ? 1 : .3
                }}
                disabled={item.id === route.params?.selectedAnimeId}
                after={
                    item.id === route.params?.selectedAnimeId && (
                        <Icon
                        name="chevrons-left"
                        type="Feather"
                        color={theme.accent}
                        size={20}
                        />
                    )
                }
                subtitle={
                    <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap"
                    }}
                    >
                        <Text
                        style={{
                            color: theme.text_color,
                            fontSize: 12,
                            borderColor: theme.divider_color,
                            backgroundColor: theme.divider_color + "98",
                            borderWidth: 1,
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                            borderRadius: 5,
                            marginRight: 10,
                            marginTop: 5,
                        }}
                        >
                            {item.year || "?"} год
                        </Text>

                        <Text
                        style={{
                            color: theme.text_color,
                            fontSize: 12,
                            borderColor: theme.divider_color,
                            backgroundColor: theme.divider_color + "98",
                            borderWidth: 1,
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                            borderRadius: 5,
                            marginRight: 10,
                            marginTop: 5,
                        }}
                        >
                            {item.kind}
                        </Text>
                    </View>
                }
                />
            </View>
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            backButton
            backButtonOnPress={() => goBack()}
            title="Связанные аниме"
            />

            <FlatList
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            data={animeList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderList}
            />
        </View>
    )
};