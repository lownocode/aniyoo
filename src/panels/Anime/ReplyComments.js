import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { 
    View, 
    Text, 
    ToastAndroid, 
    Switch, 
    ActivityIndicator, 
    Keyboard, 
    RefreshControl,
    TouchableNativeFeedback,
    StyleSheet,
    Dimensions
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import { 
    Header, 
    Cell,
    PressIcon,
    Icon,
    Avatar,
    Button,
    WriteBar,
    Placeholder
} from "../../components";
import { CommentActions } from "../../modals";

import { declOfNum, storage, normalizeSize } from "../../functions";
import ThemeContext from "../../config/ThemeContext";

export const AnimeReplyComments = (props) => {
    const theme = useContext(ThemeContext);
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
    const [ modalContent, setModalContent ] = useState(null);

    const flatListRef = useRef();
    const modalRef = useRef();

    const {
        navigation: {
            goBack
        }
    } = props;

    const getComment = async (loading = true) => {
        setLoadingComments(loading);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        // const userId = (await storage.getItem("USER_DATA")).id;
        // setUserId(userId);

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

    const changeSpoiler = (id, closed) => {
        const newSpoilersData = spoilers.map((item) => {
            if(item.id === id) {
                return {
                    id: id,
                    closed: closed
                }
            }

            return item;
        });

        setSpoilers(newSpoilersData);
    };

    const renderReplyComments = ({ item }) => {
        return (
            <Cell
            key={"reply-" + item.id}
            title={item?.user?.nickname}
            centered={false}
            onPress={() => {
                setModalContent(
                    <CommentActions 
                    onClose={() => modalRef.current?.close()} 
                    comment={item} 
                    successEditing={() => {
                        getComment(false);
                    }}
                    />
                );
                modalRef.current?.open();
            }}
            subtitle={
                <View>
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

                    {
                        spoilers.findIndex(x => x?.id === item.id && x?.closed) > -1 ? (
                            <View
                            style={{
                                backgroundColor: theme.divider_color + "80",
                                // padding: 10,
                                borderRadius: 8,
                                marginTop: 5,
                                borderWidth: 1,
                                borderColor: theme.divider_color,
                                width: "100%",
                                overflow: "hidden"
                            }}
                            >
                                <TouchableNativeFeedback
                                onPress={() => changeSpoiler(item.id, false)}
                                >
                                    <View
                                    style={{
                                        padding: 10
                                    }}
                                    >
                                        <Text
                                        style={{
                                            textAlign: "center",
                                            color: theme.text_secondary_color,
                                            fontSize: normalizeSize(10)
                                        }}
                                        >
                                            Автор указал, что этот комментарий содержит спойлер. Нажмите, чтобы открыть
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        ) : (
                            <View>
                                {
                                    item.text ? (
                                        <Text
                                        selectable
                                        selectionColor={theme.accent}
                                        style={{
                                            marginTop: 3,
                                            color: theme.text_color,
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

                                {
                                    spoilers.findIndex(x => x?.id === item.id && !x?.closed) > -1 && (
                                        <View
                                        style={{
                                            backgroundColor: theme.divider_color + "80",
                                            borderRadius: 8,
                                            marginTop: 5,
                                            borderWidth: 1,
                                            borderColor: theme.divider_color,
                                            overflow: "hidden",
                                            width: "100%",
                                        }}
                                        >
                                            <TouchableNativeFeedback
                                            onPress={() => changeSpoiler(item.id, true)}
                                            >
                                                <View
                                                style={{
                                                    padding: 10,
                                                }}
                                                >
                                                    <Text
                                                    style={{
                                                        textAlign: "center",
                                                        color: theme.text_secondary_color,
                                                        fontSize: normalizeSize(10)
                                                    }}
                                                    >
                                                        Нажмите, чтобы скрыть
                                                    </Text>
                                                </View>
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
                        <Button
                        title="Ответить"
                        upperTitle={false}
                        type="overlay"
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
                size={30}
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

    const styles = StyleSheet.create({
        modalContainer: {
            left: 10,
            width: Dimensions.get("window").width - 20,
            bottom: 10,
            borderRadius: 15,
            backgroundColor: theme.bottom_modal.background,
            borderColor: theme.bottom_modal.border,
            borderWidth: 0.5,
            overflow: "hidden",
            borderRadius: 15,
        },
    });

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1}}>
            <Header
            title="Ответы на комментарий"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>

            {
                loadingComments ? (
                    <Placeholder
                    icon={<ActivityIndicator size={35} color={theme.activity_indicator_color}/>}
                    title="Загрузка комментариев"
                    subtitle="Пожалуйста, подождите"
                    />
                ) : (
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
                            onPress={() => {
                                setModalContent(
                                    <CommentActions 
                                    onClose={() => modalRef.current?.close()} 
                                    comment={comment} 
                                    successEditing={() => {
                                        getComment(false);
                                    }}
                                    />
                                );
                                modalRef.current?.open();
                            }}
                            subtitle={
                                <View>
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
                                        replies?.length + " " + declOfNum(replies?.length, ["ответ", "ответа", "ответов"])
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
                )
            }

            {
                !loadingComments && (
                    <View style={{zIndex: 500}}>
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
                                            fontSize: normalizeSize(9),
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
                                            size={5}
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
                                        <Text style={{ marginLeft: 5, color: theme.text_secondary_color, fontSize: normalizeSize(8) }}>Загрузка комментариев...</Text>
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
        </GestureHandlerRootView>
    )
};