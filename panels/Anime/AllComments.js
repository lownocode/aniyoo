import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, FlatList, Text, ToastAndroid, Switch, ActivityIndicator, Keyboard, RefreshControl, TouchableNativeFeedback } from "react-native";
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
    WriteBar
} from "../../components";
import { declOfNum, storage } from "../../functions";

export const Anime_AllComments = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const [ comments, setComments ] = useState([]);
    const [ newCommentText, setNewCommentText ] = useState("");
    const [ newCommentIsSpoiler, setNewCommentIsSpoiler ] = useState(false);
    const [ sendLoading, setSendLoading ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ spoilers, setSpoilers ] = useState([]);
    const [ loadingMoreComments, setLoadingMoreComments ] = useState(false);

    const {
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getComments();
    }, []);

    const getComments = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.getList", {
            animeId: route.params?.animeId,
            order: {
                rating: 1
            },
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setComments(data);
            data.map((item) => {
                if(item.isSpoiler && spoilers.findIndex(x => x.id === item.id) === -1) {
                    setSpoilers([ 
                        ...spoilers,
                        {
                            id: item.id,
                            closed: true
                        }  
                    ]);
                }
            });
            setRefreshing(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const loadMoreComments = async () => {
        setLoadingMoreComments(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.getList", {
            animeId: route.params?.animeId,
            order: {
                createdAt: 0,
            },
            offset: comments.length
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setComments(comments.concat(data));
            data.map((item) => {
                if(item.isSpoiler && spoilers.findIndex(x => x.id === item.id) === -1) {
                    setSpoilers([ 
                        ...spoilers,
                        {
                            id: item.id,
                            closed: true
                        }  
                    ]);
                }
            });
            setLoadingMoreComments(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        getComments();
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
            const newCommentsData = comments?.map(comment => {
                if(comment.id === commentId) {
                    return { 
                        ...comment, 
                        mark: data.mark,
                        rating: data.rating
                    }
                }

                return comment;
            });

            return setComments(newCommentsData);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });
    };

    const sendNewComment = async () => {
        setSendLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.create", {
            animeId: route.params?.animeId,
            isSpoiler: newCommentIsSpoiler,
            text: newCommentText
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setComments([data, ...comments]);
            setSendLoading(false);

            setNewCommentText("");
            Keyboard.dismiss();
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const renderComments = ({ item }) => {
        return (
            <Cell
            key={"comment-" + item.id}
            title={item.user.nickname}
            centered={false}
            centeredAfter={false}
            after={
                <PressIcon
                icon={
                    <Icon
                    name="reply"
                    type="Entypo"
                    color={theme.icon_color}
                    size={18}
                    />
                }
                />
            }
            subtitle={
                <View>
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Text
                        style={{
                            color: theme.cell.subtitle_color
                        }}
                        >
                            {
                                item.createdAt === item.updatedAt ? dayjs().to(item.createdAt) : dayjs().to(item.updatedAt)
                            }
                        </Text>

                        {
                            item.createdAt !== item.updatedAt && (
                                <Icon
                                name="pencil"
                                type="EvilIcons"
                                size={16}
                                style={{
                                    marginLeft: 5
                                }}
                                />
                            )
                        }
                    </View>

                    {
                        spoilers.findIndex(x => x.id === item.id && x.closed) > -1 ? (
                            <View
                            style={{
                                backgroundColor: theme.divider_color + "80",
                                padding: 10,
                                borderRadius: 8,
                                marginTop: 5,
                                borderWidth: 1,
                                borderColor: theme.divider_color,
                                width: "100%",
                                overflow: "hidden"
                            }}
                            >
                                <TouchableNativeFeedback
                                onPress={() => {
                                    const newSpoilersData = spoilers.map((spoilerItem) => {
                                        if(spoilerItem.id === item.id) {
                                            return {
                                                id: item.id,
                                                closed: false
                                            }
                                        }
                                    });

                                    setSpoilers(newSpoilersData);
                                }}
                                >
                                    <Text
                                    style={{
                                        textAlign: "center",
                                        color: theme.text_secondary_color,
                                        fontSize: 12.5
                                    }}
                                    >
                                        Автор комментария указал, что этот комментарий содержит спойлер. Нажмите, чтобы открыть
                                    </Text>
                                </TouchableNativeFeedback>
                            </View>
                        ) : (
                            <View>
                                <Text
                                selectable
                                style={{
                                    marginTop: 3,
                                    color: theme.text_color
                                }}
                                >
                                    {item.text}
                                </Text>

                                {
                                    spoilers.findIndex(x => x.id === item.id && !x.closed) > -1 && (
                                        <View
                                        style={{
                                            backgroundColor: theme.divider_color + "80",
                                            padding: 10,
                                            borderRadius: 8,
                                            marginTop: 5,
                                            borderWidth: 1,
                                            borderColor: theme.divider_color,
                                            overflow: "hidden",
                                            width: "100%"
                                        }}
                                        >
                                            <TouchableNativeFeedback
                                            onPress={() => {
                                                const newSpoilersData = spoilers.map((spoilerItem) => {
                                                    if(spoilerItem.id === item.id) {
                                                        return {
                                                            id: item.id,
                                                            closed: true
                                                        }
                                                    }
                                                });

                                                setSpoilers(newSpoilersData);
                                            }}
                                            >
                                                <Text
                                                style={{
                                                    textAlign: "center",
                                                    color: theme.text_secondary_color,
                                                    fontSize: 12.5
                                                }}
                                                >
                                                    Нажмите, чтобы скрыть
                                                </Text>
                                            </TouchableNativeFeedback>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }
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
                        {
                            item.replies >= 1 && (
                                <Button
                                title={`Смотреть ${item.replies} ${declOfNum(item.replies, ["ответ", "ответа", "ответов"])}`}
                                upperTitle={false}
                                type="overlay"
                                textColor={theme.text_color}
                                containerStyle={{
                                    marginTop: 0
                                }}
                                size="s"
                                before={
                                    <Icon
                                    name="reply-all"
                                    type="Entypo"
                                    color={theme.text_color}
                                    size={13}
                                    />
                                }
                                onPress={() => navigate("anime.reply_comments", { commentId: item.id })}
                                />
                            )
                        }
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
                            color={item.mark === "down" ? "#f54242" : theme.icon_color}
                            size={18}
                            />
                        }
                        onPress={() => markComment(item.id, "down")}
                        />

                        <Text
                        style={{
                            marginHorizontal: 7,
                            color: item.mark === "up" ? "#42f554" : item.mark === "down" ? "#f54242" : theme.text_secondary_color
                        }}
                        >
                            {item.rating}
                        </Text>

                        <PressIcon
                        icon={
                            <Icon
                            name="chevron-up-outline"
                            type="Ionicons"
                            size={18}
                            color={item.mark === "up" ? "#42f554" : theme.icon_color}
                            />
                        }
                        onPress={() => markComment(item.id, "up")}
                        />
                    </View>
                </View>
            }
            before={<Avatar url={item.user.photo}/>}
            />
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1}}>
            <Header
            title="Комментарии"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <FlatList
            data={comments}
            renderItem={renderComments}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreComments}
            scrollEnabled
            refreshControl={
                <RefreshControl
                progressBackgroundColor={theme.refresh_control_background}
                colors={[theme.accent]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }
            />

            <View>
                <View
                style={{
                    width: "100%",
                    height: 30,
                    backgroundColor: theme.divider_color,
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    >
                        <Text style={{ color: theme.text_secondary_color }}>
                            Спойлер
                        </Text>

                        <Switch 
                        style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                        value={newCommentIsSpoiler}
                        onValueChange={(value) => setNewCommentIsSpoiler(value)}
                        trackColor={{ false: theme.switch.track_off, true: theme.switch.track_on }}
                        thumbColor={newCommentIsSpoiler ? theme.switch.thumb : theme.switch.thumb_light}
                        />
                    </View>

                    {
                        loadingMoreComments && (
                            <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            >
                                <ActivityIndicator size={11} color={theme.activity_indicator_color}/>
                                <Text style={{ marginLeft: 5, color: theme.text_secondary_color, fontSize: 10 }}>Загрузка комментариев...</Text>
                            </View>
                        )
                    }
                </View>
                
                <WriteBar
                placeholder="Комментарий"
                value={newCommentText}
                onChangeText={text => setNewCommentText(text)}
                after={
                    <PressIcon
                    icon={
                        sendLoading ? (
                            <ActivityIndicator color={theme.activity_indicator_color}/>
                        ) : (
                            <Icon
                            name="send"
                            type="Ionicons"
                            color={newCommentText.length >= 2 ? theme.accent : theme.icon_color}
                            size={20}
                            />
                        ) 
                    }
                    disabled={sendLoading || newCommentText.length < 3}
                    onPress={sendNewComment}
                    />
                }
                />
            </View>
        </View>
    )
};