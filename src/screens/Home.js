import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { 
    ScrollView, 
    ToastAndroid, 
    View,
    TouchableNativeFeedback,
    Text,
    Image
} from "react-native";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Avatar,
    Cell,
    Header,
    Icon,
    Button,
    Divider
} from "../components";

import ThemeContext from "../config/ThemeContext";
import { normalizeSize, storage } from "../functions";

export const Home = (props) => {
    const theme = useContext(ThemeContext);

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
        .then(({ data }) =>  setPopularComments(data[0]))
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });
    };
    
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
                title={item.user.nickname}
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
                        fontSize: normalizeSize(12)
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
                        <View>
                            <Text>
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

                <Cell
                title={item.anime.title}
                before={
                    <Image
                    source={{
                        uri: item.anime.poster
                    }}
                    style={{
                        width: normalizeSize(35),
                        height: normalizeSize(46),
                        borderRadius: 6
                    }}
                    resizeMethod="resize"
                    resizeMode="cover"
                    />
                }
                centered={false}
                />

                <Divider
                dividerStyle={{
                    backgroundColor: theme.widget_background
                }}
                indents
                />
            </View>
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Главная"
            height={30}
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            >
                <View
                style={{
                    backgroundColor: theme.widget_background,
                    margin: 15,
                    borderRadius: 20,
                    overflow: "hidden"
                }}
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
                        popularComments.map(renderPopularComments)
                    }
                </View>
            </ScrollView>
        </View>
    )
};