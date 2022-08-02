import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Image, ToastAndroid, FlatList, RefreshControl, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
} from "../../components";
import { storage } from "../../functions";

export const LinkedAnime = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack,
            push
        },
    } = props;

    const route = useRoute();

    const [ refreshing, setRefreshing ] = useState(true);
    const [ animeList, setAnimeList ] = useState(route.params?.animes || {});

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getLinked();
    }, []);

    const getLinked = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getLinked", {
            animeId: route.params?.animeId,
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setAnimeList(data);
            setRefreshing(false);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });
    };

    useEffect(() => {
        getLinked();
    }, []);

    const renderList = ({ item, index }) => {
        return (
            <View
            key={"linked-anime-" + index}
            >
                <Cell
                title={item.title}
                centered={false}
                maxTitleLines={2}
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
                            width: 90,
                            height: 125,
                        }}
                        source={{
                            uri: item?.poster
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
                                            {
                                                "watching": "Смотрю",
                                                "completed": "Просмотрено",
                                                "planned": "В планах",
                                                "postponed": "Отложено",
                                                "dropped": "Брошено"
                                            }[item.inList]
                                        }
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                }
                containerStyle={{
                    opacity: item.id ? 1 : .3,
                    backgroundColor: item.id === route.params?.animeId ? route.params?.accent + "10" : "transparent"
                }}
                disabled={item.id === route.params?.animeId}
                onPress={() => {
                    if(!item.id) {
                        return ToastAndroid.show("К сожалению, такого аниме ещё нет в нашем приложении", ToastAndroid.CENTER)
                    }
                    
                    push("anime", { animeData: { id: item.id } });
                }}
                subtitle={
                    <View>
                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                        >
                            <View>
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
                                    {item?.year || "Неизвестный"} год
                                </Text>
                            </View>

                            <View>
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
                                    {
                                        {
                                            "tv": "Сериал",
                                            "ona": "ONA",
                                            "ova": "OVA",
                                            "special": "Спешл",
                                            "movie": "Фильм"
                                        }[item.kind]
                                    }
                                </Text>
                            </View>
                        </View>

                        <Text
                        numberOfLines={3}
                        style={{
                            color: theme.text_secondary_color,
                            fontSize: 13
                        }}
                        >
                            {   
                                item.description || "Описание не указано"
                            }
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
            refreshControl={
                <RefreshControl
                progressBackgroundColor={theme.refresh_control_background}
                colors={[route.params?.accent]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }
            />
        </View>
    )
};