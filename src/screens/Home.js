import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
    ScrollView, 
    ToastAndroid, 
    View,
    TouchableNativeFeedback,
    Text
} from "react-native";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Avatar,
    Cell,
    Header,
    Icon,
    Divider,
    Placeholder,
    Panel
} from "../components";

import { storage } from "../functions";

export const Home = (props) => {
    const { theme } = useSelector(state => state.theme);

    const {
        navigation: {
            navigate
        },
        navigation
    } = props;

    const [ popularComments, setPopularComments ] = useState([]);

    const getPopularComments = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/widgets.get", {
            widgets: ["getDayComments"]
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) =>  {
            storage.setItem("cachedPopularComments", data.getDayComments);
            setPopularComments(data.getDayComments);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });
    };

    const getCachedData = async () => {
        const comments = await storage.getItem("cachedPopularComments");

        setPopularComments(comments || []);
    };

    useEffect(() => {
        getCachedData();
    }, []);
    
    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            getPopularComments();
        });
    
        return willFocusSubscription;
    }, []);

    const renderPopularComments = (item, index) => {
        return (
            <View
            key={"comment-" + index}
            >
                <Cell
                centered={false}
                title={
                    <View>
                        <Text
                        numberOfLines={1}
                        style={{
                            color: theme.text_color,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                        >
                            {item.user.nickname}
                        </Text>

                        <View
                        style={{
                            overflow: "hidden",
                            marginVertical: 5,
                            borderRadius: 100
                        }}
                        >
                            <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                            >
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingRight: 10,
                                }}
                                >
                                    <Avatar
                                    url={item.anime.poster}
                                    size={15}
                                    />

                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        color: theme.text_secondary_color,
                                        marginLeft: 5
                                    }}
                                    >
                                        {item.anime.title}
                                    </Text>

                                    <Icon
                                    name="chevron-right"
                                    size={10}
                                    color={theme.text_secondary_color}
                                    /> 
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                before={
                    <Avatar
                    url={item.user.photo}
                    size={35}
                    />
                }
                subtitle={
                    <Text
                    selectable
                    selectionColor={theme.accent}
                    style={{
                        color: theme.text_color,
                        fontSize: 15
                    }}
                    >
                        {item.text}
                    </Text>
                }
                maxSubtitleLines={3}
                maxtitleLines={1}
                additionalContentBottom={
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 15,
                        marginBottom: 10
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="clock-outline"
                            size={10}
                            color={theme.text_secondary_color}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                marginLeft: 5
                            }}
                            >
                                {
                                    dayjs().to(item.editedAt || item.createdAt)
                                }
                            </Text>
                        </View>

                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <View
                            style={{
                                borderRadius: 100,
                                overflow: "hidden",
                                borderColor: theme.divider_color,
                                borderWidth: item.mark === "down" ? 0 : 1,
                                backgroundColor: item.mark === "down" ? "#f54242" : "transparent"
                            }}
                            >
                                <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                // onPress={() => markComment(item.id, "down")}
                                >
                                    <View
                                    style={{
                                        paddingVertical: 2,
                                        paddingHorizontal: 15,
                                    }}
                                    >
                                        <Icon
                                        name="chevron-down"
                                        color={item.mark === "down" ? "#fff" : theme.icon_color}
                                        size={15}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
    
                            <Text
                            style={{
                                marginHorizontal: 10,
                                fontWeight: "500",
                                color: item.mark === "up" ? theme.accent : item.mark === "down" ? "#f54242" : theme.text_secondary_color
                            }}
                            >
                                {item.rating}
                            </Text>
    
                            <View
                            style={{
                                borderRadius: 100,
                                overflow: "hidden",
                                borderColor: theme.divider_color,
                                borderWidth: item.mark === "up" ? 0 : 1,
                                backgroundColor: item.mark === "up" ? theme.accent : "transparent"
                            }}
                            >
                                <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                // onPress={() => markComment(item.id, "up")}
                                >
                                    <View
                                    style={{
                                        paddingVertical: 2,
                                        paddingHorizontal: 15,
                                    }}
                                    >
                                        <Icon
                                        name="chevron-up"
                                        color={item.mark === "up" ? "#fff" : theme.icon_color}
                                        size={15}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                }
                />
                
                {
                    index + 1 !== popularComments.length && (
                        <View style={{ marginVertical: 10 }}>
                            <Divider/>
                        </View>
                    )
                }
            </View>
        )
    };

    return (
        <Panel
        headerProps={{
            title: "Главная"
        }}
        >
            <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            >
                <LinearGradient
                style={{
                    backgroundColor: theme.widget_background,
                    margin: 15,
                    borderRadius: 20,
                    overflow: "hidden",
                }}
                colors={[
                    theme.widget_background,
                    "transparent",
                    "transparent",
                ]}
                >
                    <Cell
                    title="Популярные комментарии"
                    subtitle="За этот день"
                    before={
                        <Icon
                        name="comments"
                        color={theme.icon_color}
                        size={20}
                        />
                    }
                    after={
                        <Icon
                        name="chevron-right"
                        color={theme.icon_color}
                        size={20}
                        />
                    }
                    />

                    {
                        popularComments.length === 0 ? (
                            <Placeholder
                            title="Ничего нет"
                            subtitle="Сегодня ещё никто не прокомментировал ни одно аниме :("
                            />
                        ) : popularComments.map(renderPopularComments)
                    }
                </LinearGradient>
            </ScrollView>
        </Panel>
    )
};