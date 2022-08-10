import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
    View, 
    ToastAndroid, 
    Switch, 
    ActivityIndicator, 
    Keyboard, 
    RefreshControl, 
    TouchableNativeFeedback,
    StyleSheet,
    Dimensions,
    Text,
    KeyboardAvoidingView
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
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
    Placeholder,
    AllCommentsList
} from "../../components";
import { CommentActions } from "../../modals";

import { 
    declOfNum, 
    storage,
} from "../../functions";

export const AnimeAllComments = (props) => {
    const { theme: { theme } } = useSelector(state => state);
    const route = useRoute();

    const [ comments, setComments ] = useState([]);
    const [ newCommentText, setNewCommentText ] = useState("");
    const [ newCommentIsSpoiler, setNewCommentIsSpoiler ] = useState(false);
    const [ sendLoading, setSendLoading ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ spoilers, setSpoilers ] = useState([]);
    const [ loadingMoreComments, setLoadingMoreComments ] = useState(false);
    const [ loadingComments, setLoadingComments ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);

    const flatListRef = useRef();
    const modalRef = useRef();

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

        axios.post("/comments.getList", {
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
            const findedSpoilers = data.filter(x => x.isSpoiler).map(item => { return { id: item.id, closed: true }});

            setSpoilers(findedSpoilers);
            setComments(data);
            setRefreshing(false);
            setLoadingComments(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const loadMoreComments = async () => {
        setLoadingMoreComments(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.getList", {
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
            const findedSpoilers = data.filter(x => x.isSpoiler).map(item => { return { id: item.id, closed: true }});

            setSpoilers(spoilers.concat(findedSpoilers));
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

        axios.post("/comments.mark", {
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

        axios.post("/comments.create", {
            animeId: route.params?.animeId,
            isSpoiler: newCommentIsSpoiler,
            text: newCommentText
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            if(data.isSpoiler) {
                setSpoilers([...spoilers, { id: data.id, closed: true }]);
            }
            setComments([data, ...comments]);
            setSendLoading(false);

            setNewCommentText("");
            Keyboard.dismiss();
            flatListRef.current?.scrollTo({ y: 0, animated: true });
        })
        .catch(({ response: { data } }) => {
            console.log(data)
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

    const renderComments = ({ item }) => {
        const isCloseSpoiler = spoilers.find(x => x.id === item.id && x.closed);

        return (
            <View
            style={{
                marginBottom: 15
            }}
            >
                <Cell
                key={"comment-" + item.id}
                title={item.user.nickname}
                centered={false}
                centeredAfter={false}
                onPress={() => {
                    setModalContent(
                        <CommentActions 
                        onClose={() => modalRef.current?.close()} 
                        comment={item} 
                        successEditing={() => {
                            getComments(false);
                        }}
                        />
                    );
                    modalRef.current?.open();
                }}
                subtitle={
                    <View>
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            {
                                item?.animeMark && (
                                    <View
                                    style={{
                                        borderRadius: 100,
                                        backgroundColor: theme.anime_mark[item.animeMark] + "10",
                                        height: 17,
                                        paddingHorizontal: 7,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginRight: 5,
                                        justifyContent: "center"
                                    }}
                                    >
                                        <Icon
                                        name="star"
                                        color={theme.anime_mark[item.animeMark]}
                                        style={{
                                            marginRight: 5
                                        }}
                                        size={10}
                                        />

                                        <Text
                                        style={{
                                            color: theme.anime_mark[item.animeMark],
                                            fontWeight: "700",
                                            fontSize: 12
                                        }}
                                        >
                                            {
                                                item.animeMark
                                            }
                                        </Text>
                                    </View>
                                )
                            }

                            {
                                item?.inList !== "none" && (
                                    <View
                                    style={{
                                        borderRadius: 100,
                                        backgroundColor: theme.anime[item.inList] + "10",
                                        height: 17,
                                        paddingHorizontal: 7,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginRight: 5,
                                        justifyContent: "center"
                                    }}
                                    >
                                        <Icon
                                        name={
                                            {
                                                "watching": "eye",
                                                "completed": "done-double",
                                                "planned": "calendar",
                                                "postponed": "pause-rounded",
                                                "dropped": "cancel-rounded"
                                            }[item.inList]
                                        }
                                        color={theme.anime[item.inList]}
                                        style={{
                                            marginRight: 5
                                        }}
                                        size={10}
                                        />

                                        <Text
                                        style={{
                                            color: theme.anime[item.inList],
                                            fontWeight: "700",
                                            fontSize: 12
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

                            <Text
                            style={{
                                color: theme.cell.subtitle_color
                            }}
                            >
                                {
                                    dayjs().to(item.editedAt || item.createdAt)
                                }
                            </Text>

                            {
                                item.editedAt && (
                                    <View
                                    style={{
                                        marginLeft: 5
                                    }}
                                    >
                                        <Icon
                                        name="pencil-write"
                                        size={10}
                                        color={theme.text_secondary_color}
                                        />
                                    </View>
                                )
                            }
                        </View>

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

                        {
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
                        <View
                        style={{
                            marginTop: -10
                        }}
                        >
                            <View style={{ alignItems: "flex-start" }}>
                                <Button
                                title="Ответить"
                                upperTitle={false}
                                type="overlay"
                                containerStyle={{
                                    marginVertical: 0,
                                }}
                                textStyle={{ fontSize: 12 }}
                                onPress={() => navigate("anime.reply_comments", {
                                    commentId: item.id,
                                    animeId: route.params?.animeId,
                                    reply: {
                                        id: item.id,
                                        user: item.user
                                    }
                                })}
                                before={
                                    <Icon
                                    name="reply"
                                    type="Entypo"
                                    color={theme.text_color}
                                    size={15}
                                    />
                                }
                                size="s"
                                textColor={theme.text_secondary_color}
                                />
                            </View>
                            
                            <View>
                                {
                                    item.replies >= 1 && (
                                        <Button
                                        title={`Смотреть ${item.replies} ${declOfNum(item.replies, ["ответ", "ответа", "ответов"])}`}
                                        upperTitle={false}
                                        type="overlay"
                                        textColor={theme.text_secondary_color}
                                        containerStyle={{
                                            marginTop: 0
                                        }}
                                        onPress={() => navigate("anime.reply_comments", {
                                            commentId: item.id,
                                            animeId: route.params?.animeId
                                        })}
                                        size={30}
                                        textStyle={{
                                            fontSize: 12
                                        }}
                                        before={
                                            <Icon
                                            name="reply"
                                            color={theme.text_secondary_color}
                                            size={13}
                                            />
                                        }
                                        />
                                    )
                                }
                            </View>
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
                    url={item.user.photo}
                    online={(+new Date() - +new Date(item?.user?.online?.time)) < 1 * 60 * 1000}
                    />
                }
                />
            </View>
        )
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
        <View style={{ backgroundColor: theme.background_content, flex: 1}}>
            <Header
            title="Комментарии"
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
                    <KeyboardAvoidingView 
                    style={{ flex: 1 }} 
                    keyboardVerticalOffset={0} 
                    behavior="padding"
                    >
                        <AllCommentsList
                        refreshControl={
                            <RefreshControl
                            progressBackgroundColor={theme.refresh_control_background}
                            colors={[theme.accent]}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            />
                        }
                        flatListRef={flatListRef}
                        comments={{ list: comments }}
                        setModalContent={setModalContent}
                        modalRef={modalRef}
                        navigate={navigate}
                        />

                        {
                            !loadingComments && (
                                <View>
                                    <View
                                    style={{
                                        width: "100%",
                                        height: 30,
                                        backgroundColor: theme.divider_color + "80",
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
                                                    <Text 
                                                    style={{ 
                                                        marginLeft: 5, 
                                                        color: theme.text_secondary_color, 
                                                        fontSize: 10
                                                    }}>
                                                        Загрузка комментариев...
                                                    </Text>
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

            
        </View>
    )
};