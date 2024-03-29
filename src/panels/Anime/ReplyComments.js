import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    View, 
    ToastAndroid, 
    Switch, 
    ActivityIndicator, 
    Keyboard, 
    RefreshControl,
    TouchableNativeFeedback,
    FlatList,
    Text,
    KeyboardAvoidingView
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import { 
    Panel, 
    Cell,
    PressIcon,
    Icon,
    Avatar,
    Button,
    WriteBar,
    Placeholder,
    ContentHeader,
} from "../../components";
import { openModal } from "../../redux/reducers";
import { declOfNum, storage } from "../../functions";

export const AnimeReplyComments = (props) => {
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.theme);
    const route = useRoute();

    const [ comment, setComment ] = useState({});
    const [ newCommentText, setNewCommentText ] = useState("");
    const [ newCommentIsSpoiler, setNewCommentIsSpoiler ] = useState(false);
    const [ sendLoading, setSendLoading ] = useState(false);
    const [ spoilers, setSpoilers ] = useState([]);
    const [ loadingMoreComments, setLoadingMoreComments ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ replies, setReplies ] = useState([]);
    const [ reply, setReply ] = useState(route.params?.reply || {});
    const [ loadingComments, setLoadingComments ] = useState(true);

    const flatListRef = useRef();

    const {
        navigation: {
            goBack
        }
    } = props;

    const getComment = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.get", {
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
            setComment({
                "id": data.id,
                "userId": data.userId,
                "animeId": data.animeId,
                "rating": data.rating,
                "text": data.text,
                "editedAt": data.editedAt,
                "isSpoiler": data.isSpoiler,
                "branch": data.branch,
                "replyTo": data.replyTo,
                "createdAt": data.createdAt,
                "updatedAt": data.updatedAt,
                "user": data.user,
                "mark": data.mark,
            });

            setReplies(data.replies);
            const findedSpoilers = data.replies.filter(x => x.isSpoiler).map(item => { return { id: item.id, closed: true }});
            setSpoilers(spoilers.concat(findedSpoilers));

            setRefreshing(false);
            setLoadingComments(false);
        })
        .catch(({ reponse: { data } }) => {
            console.log(data)
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getComment();
    }, []);

    const loadMoreReplies = async () => {
        setLoadingMoreComments(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.get", {
            commentId: route.params?.commentId,
            order: {
                createdAt: 0,
            },
            offset: replies.length
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            const findedSpoilers = data?.replies?.filter(x => x.isSpoiler).map(item => { return { id: item.id, closed: true }});

            setSpoilers(spoilers.concat(findedSpoilers));
            setLoadingMoreComments(false);
            
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        getComment();
    }, []);

    const markComment = async (commentId, mark) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.mark", {
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

    const changeSpoiler = (id) => {
        const newSpoilersData = spoilers.map((item) => {
            if(item.id === id) {
                return {
                    id: id,
                    closed: !item.closed
                }
            }

            return item;
        });

        setSpoilers(newSpoilersData);
    };

    const renderReplyComments = ({ item }) => {
        const isCloseSpoiler = spoilers.find(x => x.id === item.id && x.closed);

        return (
            <Cell
            key={"reply-" + item.id}
            title={item?.user?.nickname}
            centered={false}
            onPress={() => dispatch(openModal({ 
                visible: true, 
                id: "COMMENT_ACTIONS", 
                props: {
                    comment: item,
                    successEditing: () => getComment(false)
                } 
            }))}
            subtitle={
                <View>
                    {
                        item?.isSpoiler && (
                            <View
                            style={{
                                flexDirection: "row",
                            }}
                            >
                                <View
                                style={{
                                    borderRadius: 5,
                                    height: 17,
                                    paddingHorizontal: 7,
                                    marginTop: 5,
                                    borderWidth: .5,
                                    borderColor: "orangered"
                                }}
                                >
                                    <Text
                                    style={{
                                        color: "orangered",
                                        fontWeight: "700",
                                        fontSize: 12
                                    }}
                                    >
                                        Содержит спойлер
                                    </Text>
                                </View>
                            </View>
                        )
                    }

                    <Text style={{ color: theme.incomplete_text_secondary_color }}>
                        В ответ 
                        <Text style={{ fontWeight: "700" }}>
                            {
                                item.replyTo === item.branch ? <Text style={{ color: theme.text_color }}> {comment?.user?.nickname}</Text>  : 
                                replies.find(x => x.id === item.replyTo).user.id === item.user.id ? " на свой комментарий" : 
                                " " + replies.find(x => x.id == item.replyTo).user.nickname
                            }
                        </Text>
                    </Text>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Text style={{ color: theme.cell.subtitle_color }}>
                            {dayjs().to(item?.editedAt || item?.createdAt)}
                        </Text>

                        {
                            item.editedAt && (
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

                    <View>
                        {
                            item.text ? (
                                <Text
                                selectable
                                selectionColor={theme.accent}
                                onPress={() => {
                                    item.isSpoiler && changeSpoiler(item.id)
                                }}
                                style={{
                                    marginTop: 3,
                                    color: isCloseSpoiler ? "#fff0" : theme.text_color,
                                    textShadowColor: isCloseSpoiler ? (theme.name === "dark" ? "rgba(255, 255, 255, .99)" : "rgba(0, 0, 0, .99)") : "transparent",
                                    textShadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    textShadowRadius: 10,
                                }}
                                >
                                    {
                                        item.text
                                    }
                                </Text>
                            ) : (
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                                >
                                    <Icon
                                    name="trash-outline"
                                    color={theme.text_secondary_color}
                                    />

                                    <Text
                                    style={{
                                        marginTop: 3,
                                        color: theme.text_secondary_color,
                                        marginLeft: 5,
                                        fontStyle: "italic"
                                    }}
                                    >
                                        Комментарий удалён.
                                    </Text>
                                </View>
                            )
                        }
                    </View>
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
                        containerStyle={{
                            marginVertical: 0
                        }}
                        textStyle={{ fontSize: 12 }}
                        before={
                            <Icon
                            name="reply"
                            type="Entypo"
                            color={theme.text_color}
                            size={15}
                            />
                        }
                        textColor={theme.text_secondary_color}
                        size={"s"}
                        onPress={() => {
                            setReply({
                            id: item.id,
                            user: item.user
                        }); console.log(JSON.stringify(reply,null,"\t"))}}
                        />
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
                            onPress={() => markComment(item.id, "down")}
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
                            onPress={() => markComment(item.id, "up")}
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
            before={
                <Avatar 
                url={item?.user?.photo} 
                online={(+new Date() - +new Date(item?.user?.online?.time)) < 1 * 60 * 1000}
                />
            }
            />
        )
    };

    const sendNewComment = async () => {
        setSendLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.create", {
            animeId: route.params?.animeId,
            isSpoiler: newCommentIsSpoiler,
            text: newCommentText,
            replyTo: reply?.id || comment?.id
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            if(data.isSpoiler) {
                setSpoilers([...spoilers, { id: data.id, closed: true }]);
            }
            setReplies([...replies, data]);
            setSendLoading(false);

            setNewCommentText("");
            Keyboard.dismiss();
            flatListRef.current?.scrollToEnd({ animated: true });
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    return (
        <Panel
        headerProps={{
            title: "Ответы на комментарий",
            backOnPress: () => goBack()
        }}
        >
            {
                loadingComments ? (
                    <Placeholder
                    icon={<ActivityIndicator size={35} color={theme.activity_indicator_color}/>}
                    title="Загрузка комментариев"
                    subtitle="Пожалуйста, подождите"
                    />
                ) : (
                    <KeyboardAvoidingView 
                    style={{ flex: 1 }} 
                    keyboardVerticalOffset={0} 
                    behavior="padding"
                    >
                        <FlatList
                        data={replies}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={renderReplyComments}
                        keyboardShouldPersistTaps="always"
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMoreReplies}
                        ListHeaderComponent={
                            <View>
                                <Cell
                                title={comment?.user?.nickname}
                                centered={false}
                                onPress={() => dispatch(openModal({ 
                                    visible: true, 
                                    id: "SET_STATUS",
                                    props: {
                                        comment,
                                        successEditing: () => getComment(false),
                                    } 
                                }))}
                                subtitle={
                                    <View>
                                        {
                                            comment?.isSpoiler && (
                                                <View
                                                style={{
                                                    flexDirection: "row",
                                                }}
                                                >
                                                    <View
                                                    style={{
                                                        borderRadius: 5,
                                                        height: 17,
                                                        paddingHorizontal: 7,
                                                        marginTop: 5,
                                                        borderWidth: .5,
                                                        borderColor: "orangered"
                                                    }}
                                                    >
                                                        <Text
                                                        style={{
                                                            color: "orangered",
                                                            fontWeight: "700",
                                                            fontSize: 12
                                                        }}
                                                        >
                                                            Содержит спойлер
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }

                                        <Text
                                        style={{
                                            color: theme.cell.subtitle_color
                                        }}
                                        >
                                            {dayjs().to(comment?.createdAt)}
                                        </Text>

                                        {
                                            comment.text ? (
                                                <Text
                                                selectable
                                                selectionColor={theme.accent}
                                                style={{
                                                    marginTop: 3,
                                                    color: theme.text_color,
                                                }}
                                                >
                                                    {
                                                        comment.text
                                                    }
                                                </Text>
                                            ) : (
                                                <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                                >
                                                    <Icon
                                                    name="trash-outline"
                                                    color={theme.text_secondary_color}
                                                    />

                                                    <Text
                                                    style={{
                                                        marginTop: 3,
                                                        color: theme.text_secondary_color,
                                                        marginLeft: 5,
                                                        fontStyle: "italic"
                                                    }}
                                                    >
                                                        Комментарий удалён.
                                                    </Text>
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
                                        marginBottom: 10
                                    }}
                                    >
                                        <View>
                                            <Button
                                            title="Ответить"
                                            upperTitle={false}
                                            type="overlay"
                                            textColor={theme.text_color}
                                            containerStyle={{
                                                marginVertical: 0
                                            }}
                                            textStyle={{ fontSize: 12 }}
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
                                            <View
                                            style={{
                                                borderRadius: 100,
                                                overflow: "hidden",
                                                borderColor: theme.divider_color,
                                                borderWidth: comment?.mark === "down" ? 0 : 1,
                                                backgroundColor: comment?.mark === "down" ? "#f54242" : "transparent"
                                            }}
                                            >
                                                <TouchableNativeFeedback
                                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                                onPress={() => markComment(comment?.id, "down")}
                                                >
                                                    <View
                                                    style={{
                                                        paddingVertical: 2,
                                                        paddingHorizontal: 15,
                                                    }}
                                                    >
                                                        <Icon
                                                        name="chevron-down"
                                                        type="Ionicons"
                                                        color={comment?.mark === "down" ? "#fff" : theme.icon_color}
                                                        size={15}
                                                        />
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>

                                            <Text
                                            style={{
                                                marginHorizontal: 10,
                                                fontWeight: "500",
                                                color: comment?.mark === "up" ? theme.accent : comment?.mark === "down" ? "#f54242" : theme.text_secondary_color
                                            }}
                                            >
                                                {comment?.rating}
                                            </Text>

                                            <View
                                            style={{
                                                borderRadius: 100,
                                                overflow: "hidden",
                                                borderColor: theme.divider_color,
                                                borderWidth: comment?.mark === "up" ? 0 : 1,
                                                backgroundColor: comment?.mark === "up" ? theme.accent : "transparent"
                                            }}
                                            >
                                                <TouchableNativeFeedback
                                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                                onPress={() => markComment(comment?.id, "up")}
                                                >
                                                    <View
                                                    style={{
                                                        paddingVertical: 2,
                                                        paddingHorizontal: 15,
                                                    }}
                                                    >
                                                        <Icon
                                                        name="chevron-up"
                                                        type="Ionicons"
                                                        color={comment?.mark === "up" ? "#fff" : theme.icon_color}
                                                        size={15}
                                                        />
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>
                                        </View>
                                    </View>
                                }
                                before={
                                    <Avatar 
                                    url={comment?.user?.photo}
                                    online={(+new Date() - +new Date(comment?.user?.online?.time)) < 1 * 60 * 1000}
                                    />
                                }
                                />

                                <ContentHeader
                                text={
                                    replies?.length + " " + declOfNum(replies?.length, ["ответ", "ответа", "ответов"])
                                }
                                after={
                                    <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginRight: 15
                                    }}
                                    >
                                        <Icon
                                        name="chevron-down"
                                        color={theme.text_secondary_color}
                                        style={{
                                            marginRight: 5
                                        }}
                                        />

                                        <Text
                                        style={{
                                            color: theme.text_secondary_color,
                                            fontWeight: "500"
                                        }}
                                        >
                                            Сначала старые
                                        </Text>
                                    </View>
                                }
                                />
                            </View>
                        }
                        refreshControl={
                            <RefreshControl
                            progressBackgroundColor={theme.refresh_control_background}
                            colors={[theme.accent]}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                        }
                        ref={flatListRef}
                        />

                        {
                            !loadingComments && (
                                <View style={{ zIndex: 500 }}>
                                    {
                                        reply?.id && (
                                            <View
                                            style={{
                                                width: "100%",
                                                height: 30,
                                                backgroundColor: theme.divider_color + "80",
                                                justifyContent: "center",
                                                paddingHorizontal: 10,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                borderBottomColor: theme.divider_color,
                                                borderBottomWidth: 0.5
                                            }}
                                            >
                                                <View
                                                style={{
                                                    alignItems: "center",
                                                }}
                                                >
                                                    <Text style={{ color: theme.text_secondary_color }}>
                                                        Ответ для <Text style={{ fontWeight: "500" }}>{reply?.user?.nickname || comment?.user?.nickname}</Text>
                                                    </Text>
                                                </View>

                                                <View>
                                                    <Button
                                                    title="Отмена"
                                                    upperTitle={false}
                                                    textStyle={{
                                                        color: theme.anime.dropped,
                                                        fontSize: 11,
                                                        marginLeft: 5
                                                    }}
                                                    type="outline"
                                                    backgroundColor={theme.anime.dropped}
                                                    size={19}
                                                    buttonStyle={{
                                                        borderRadius: 100,
                                                        marginLeft: 0,
                                                        paddingLeft: 7
                                                    }}
                                                    containerStyle={{
                                                        borderRadius: 100,
                                                        marginRight: 0,
                                                    }}
                                                    before={
                                                        <Icon
                                                        name="close"
                                                        type="AntDesign"
                                                        color={theme.anime.dropped}
                                                        size={10}
                                                        />
                                                    }
                                                    onPress={() => setReply({})}
                                                    />
                                                </View>
                                            </View>
                                        )
                                    }

                                    <View
                                    style={{
                                        width: "100%",
                                        height: 30,
                                        backgroundColor: theme.divider_color + "90",
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
                                                    <ActivityIndicator size={8} color={theme.activity_indicator_color}/>
                                                    <Text style={{ marginLeft: 5, color: theme.text_secondary_color, fontSize: 11 }}>Загрузка комментариев...</Text>
                                                </View>
                                            )
                                        }
                                    </View>

                                    <WriteBar
                                    placeholder={`Ответ для ` + (reply?.id ? reply?.user?.nickname : comment?.user?.nickname)}
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
                                                color={newCommentText.length >= 3 ? theme.accent : theme.icon_color}
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
                            )
                        }
                    </KeyboardAvoidingView>
                )
            }
        </Panel>
    )
};