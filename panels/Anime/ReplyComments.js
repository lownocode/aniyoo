import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, ToastAndroid } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";
import { 
    Header, 
    Cell,
    PressIcon,
    Icon,
    Avatar,
    Button,
    Divider
} from "../../components";
import { declOfNum, storage } from "../../functions";

export const Anime_ReplyComments = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const [ comment, setComment ] = useState([]);

    const {
        navigation: {
            goBack
        }
    } = props;

    const getComment = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.get", {
            commentId: route.params?.commentId,
            order: {
                createdAt: 0,
            }
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setComment(data);
        })
        .catch(({ reponse: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        getComment();
    }, []);

    const markComment = async (commentId, mark) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.mark", {
            commentId: commentId,
            mark: mark
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            const newRepliesData = comment?.replies.map(comment => {
                if(comment.id === commentId) {
                    return { 
                        ...comment, 
                        mark: data.mark,
                        rating: data.rating
                    }
                }

                return comment;
            });

            if(commentId === comment?.id) { 
                return setComment({
                    ...comment,
                    mark: data.mark,
                    rating: data.rating
                });
            }

            setComment({
                ...comment,
                replies: newRepliesData,
            });
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });
    };

    const renderReplyComment = (item, index) => {
        return (
            <Cell
            key={"reply-" + item.id}
            title={item?.user?.nickname}
            centered={false}
            subtitle={
                <View>
                    <Text style={{ color: theme.incomplete_text_secondary_color }}>
                        {
                            item?.branch === comment?.id ? (
                                <Text>
                                    В ответ <Text style={{ fontWeight: "700" }}>{comment?.user?.nickname === item?.user?.nickname ? "на свой комментарий" : comment?.user?.nickname}</Text>
                                </Text>
                            ) : null
                        }
                    </Text>

                    <Text style={{ color: theme.cell.subtitle_color }}>
                        {dayjs().to(item?.createdAt)}
                    </Text>

                    <Text
                    selectable
                    style={{
                        marginTop: 3,
                        color: theme.text_color
                    }}
                    >
                        {item?.text}
                    </Text>
                </View>
            }
            additionalContentBottom={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginRight: 15,
                }}
                >
                    <View>
                        <Button
                        title="Ответить"
                        upperTitle={false}
                        type="overlay"
                        textColor={theme.text_color}
                        containerStyle={{
                            marginTop: 0
                        }}
                        before={
                            <Icon
                            name="reply"
                            type="Entypo"
                            color={theme.text_color}
                            size={15}
                            />
                        }
                        />
                    </View>
                    
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <PressIcon
                        icon={
                            <Icon
                            name="chevron-down-outline"
                            type="Ionicons"
                            color={item?.mark === "down" ? "#f54242" : theme.icon_color}
                            size={18}
                            />
                        }
                        onPress={() => markComment(item.id, "down")}
                        />

                        <Text
                        style={{
                            marginHorizontal: 7,
                            color: item?.mark === "up" ? "#42f554" : item?.mark === "down" ? "#f54242" : theme.text_secondary_color
                        }}
                        >
                            {item?.rating}
                        </Text>

                        <PressIcon
                        icon={
                            <Icon
                            name="chevron-up-outline"
                            type="Ionicons"
                            size={18}
                            color={item?.mark === "up" ? "#42f554" : theme.icon_color}
                            />
                        }
                        onPress={() => markComment(item.id, "up")}
                        />
                    </View>
                </View>
            }
            before={<Avatar url={item?.user?.photo} size={45}/>}
            />
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1}}>
            <Header
            title="Ответы на комментарий"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <ScrollView>
                <View>
                    <Cell
                    title={comment?.user?.nickname}
                    centered={false}
                    subtitle={
                        <View>
                            <Text
                            style={{
                                color: theme.cell.subtitle_color
                            }}
                            >
                                {dayjs().to(comment?.createdAt)}
                            </Text>

                            <Text
                            selectable
                            style={{
                                marginTop: 3,
                                color: theme.text_color
                            }}
                            >
                                {comment?.text}
                            </Text>
                        </View>
                    }
                    additionalContentBottom={
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginRight: 15,
                        }}
                        >
                            <View>
                                <Button
                                title="Ответить"
                                upperTitle={false}
                                type="overlay"
                                textColor={theme.text_color}
                                containerStyle={{
                                    marginTop: 0
                                }}
                                before={
                                    <Icon
                                    name="reply"
                                    type="Entypo"
                                    color={theme.text_color}
                                    size={15}
                                    />
                                }
                                />
                            </View>
                            
                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            >
                                <PressIcon
                                icon={
                                    <Icon
                                    name="chevron-down-outline"
                                    type="Ionicons"
                                    color={comment?.mark === "down" ? "#f54242" : theme.icon_color}
                                    size={18}
                                    />
                                }
                                onPress={() => markComment(comment?.id, "down")}
                                />

                                <Text
                                style={{
                                    marginHorizontal: 7,
                                    color: comment?.mark === "up" ? "#42f554" : comment?.mark === "down" ? "#f54242" : theme.text_secondary_color
                                }}
                                >
                                    {comment?.rating}
                                </Text>

                                <PressIcon
                                icon={
                                    <Icon
                                    name="chevron-up-outline"
                                    type="Ionicons"
                                    size={18}
                                    color={comment?.mark === "up" ? "#42f554" : theme.icon_color}
                                    />
                                }
                                onPress={() => markComment(comment?.id, "up")}
                                />
                            </View>
                        </View>
                    }
                    before={<Avatar url={comment?.user?.photo}/>}
                    />

                    <View
                    style={{
                        backgroundColor: theme.divider_color,
                        borderRadius: 100,
                        marginHorizontal: 10,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginVertical: 5
                    }}
                    >
                        <Text
                        style={{
                            color: theme.text_color
                        }}
                        >
                            {
                                comment?.replies?.length + " " + declOfNum(comment?.replies?.length, ["ответ", "ответа", "ответов"])
                            }
                        </Text>

                        <Text
                        style={{
                            color: theme.text_secondary_color
                        }}
                        >
                            Сначала старые
                        </Text>
                    </View>

                    {comment?.replies?.map(renderReplyComment)}
                </View>
            </ScrollView>
        </View>
    )
};