import React, { useContext, useEffect, useState, useCallback } from "react";
import { Image, View, FlatList, RefreshControl } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";
import { storage } from "../../functions";

import { 
    Header,
    Icon,
    Cell,
    PressIcon,
    Placeholder,
    ContentHeader,
    Text
} from "../../components";

export const GeneralUserBrowsingHistory = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const { 
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const [ refreshing, setRefreshing ] = useState(false);
    const [ browsingHistory, setBrowsingHistory ] = useState({
        items: route.params?.initialHistory || [],
        count: route.params?.initialHistory?.length || 0
    });

    const getCachedData = async () => {
        const browsingHistory = await storage.getItem("cachedBrowsingHistory");

        if(!route.params?.userId) {
            setBrowsingHistory({
                count: browsingHistory?.length,
                items: browsingHistory || []
            });
        }
    };

    useEffect(() => {
        getCachedData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getBrowsingHistory();
    }, []);

    const getBrowsingHistory = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/lists.get", {
            status: "history",
            [route.params?.userId && "userId"]: route.params?.userId
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            storage.setItem("cachedBrowsingHistory", data.list);
            setBrowsingHistory({
                count: data.count,
                items: data.list
            });
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        })
        .finally(() => setRefreshing(false));
    };

    useEffect(() => {
        getBrowsingHistory();
    }, []);

    const renderBrowsingHistory = ({ item }) => {
        return (
            <Cell
            centered={false}
            title={
                <Text
                numberOfLines={2}
                style={{
                    color: theme.text_color,
                    fontWeight: "700",
                    fontSize: 16
                }}
                >
                    {
                        item?.anime?.title
                    }
                </Text>
            }
            maxTitleLines={2}
            onPress={() => navigate("anime", { animeData: { id: item.anime.id } })}
            after={
                <PressIcon
                icon={
                    <Icon
                    name="four-dots"
                    size={12}
                    color={theme.text_secondary_color}
                    />
                }
                />
            }
            subtitle={
                <View
                style={{
                    marginTop: 5
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="play-square"
                        color={theme.text_secondary_color}
                        size={12}
                        style={{
                            width: 13,
                            alignItems: "center"
                        }}
                        />

                        <Text
                        style={{
                            marginLeft: 8,
                            color: theme.text_secondary_color
                        }}
                        >
                            {
                                item?.episode
                            } серия
                        </Text>
                    </View>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="clock-outline"
                        color={theme.text_secondary_color}
                        size={11}
                        style={{
                            width: 13,
                            alignItems: "center",
                        }}
                        />

                        <Text
                        style={{
                            marginLeft: 8,
                            color: theme.text_secondary_color,
                        }}
                        >
                            {
                                dayjs().to(dayjs(item.updatedAt))
                            }
                        </Text>
                    </View>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="mic-outline"
                        color={theme.text_secondary_color}
                        size={12}
                        style={{
                            width: 13,
                            alignItems: "center"
                        }}
                        />

                        <Text
                        style={{
                            marginLeft: 8,
                            color: theme.text_secondary_color
                        }}
                        >
                            {
                                item?.translation?.title || "Неизвестна"
                            }
                        </Text>
                    </View>
                </View>
            }
            before={
                <View
                style={{
                    borderRadius: 8,
                    overflow: "hidden"
                }}
                >
                    <Image
                    resizeMethod="resize"
                    source={{
                        uri: item?.anime?.poster
                    }}
                    style={{
                        width: 85,
                        height: 110,
                        resizeMode: "cover",
                        borderColor: theme.divider_color,
                        borderWidth: 0.5,
                        backgroundColor: theme.divider_color,
                    }}
                    />
                </View>
            }
            />
        )
    };

    const browsingHistoryLoadMore = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/lists.get", {
            status: "history",
            [route.params?.userId && "userId"]: route.params?.userId,
            offset: browsingHistory.items.length
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            storage.setItem("cachedBrowsingHistory", browsingHistory.items.concat(data.list));
            setBrowsingHistory({
                count: browsingHistory.count + data.count,
                items: browsingHistory.items.concat(data.list)
            });
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        })
        .finally(() => setRefreshing(false));
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="История просмотров"
            subtitle={route.params?.username || null}
            backButtonOnPress={() => goBack()}
            backButton
            />

            {
                browsingHistory.items.length === 0 ? (
                    <Placeholder
                    title="Пусто"
                    subtitle={
                        route.params?.userId  
                        ? `${route.params?.username} ещё не посмотрел(-а) ни одного аниме`
                        : "Вы ещё не посмотрели ни одного аниме"
                    }
                    />
                ) : (
                    <FlatList
                    data={browsingHistory.items}
                    keyExtractor={(item) => "anime-" + item.anime.id}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    renderItem={renderBrowsingHistory}
                    onEndReached={() => browsingHistoryLoadMore()}
                    refreshControl={
                        <RefreshControl
                        progressBackgroundColor={theme.refresh_control_background}
                        colors={[theme.accent]}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                    ListHeaderComponent={
                        <View
                        style={{
                            marginVertical: 10
                        }}
                        >
                            <ContentHeader
                            text={`Всего ${browsingHistory.count}`}
                            icon={
                                <Icon
                                name="description"
                                color={theme.text_secondary_color}
                                size={12}
                                />
                            }
                            after={
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 8,
                                    paddingHorizontal: 10
                                }}
                                >
                                    <Text
                                    style={{
                                        color: theme.text_secondary_color,
                                        marginRight: 5
                                    }}
                                    >
                                        Недавно просмотренные
                                    </Text>
                
                                    <Icon
                                    name="chevron-down"
                                    color={theme.text_secondary_color}
                                    />
                                </View>
                            }
                            />
                        </View>
                    }
                    />
                )
            }
        </View>
    )
};