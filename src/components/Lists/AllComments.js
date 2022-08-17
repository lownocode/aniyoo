import React, { useMemo } from "react";
import { 
    View, 
    FlatList, 
    TouchableNativeFeedback,
    Text,
} from "react-native";
import { useSelector } from "react-redux";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Cell,
    Icon,
    Avatar,
    Button,
} from "../";

import { CommentActions } from "../../modals";

export const RenderAllCommentsList = (props) => {
    const { theme } = useSelector(state => state.theme);

    const {
        modalRef,
        setModalContent,
        navigate,
        item
    } = props;

    const isCloseSpoiler = false//spoilers.find(x => x.id === item.id && x.closed);

    return (
        <View
        style={{
            marginBottom: 15
        }}
        >
            <Cell
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
                                    // onPress={() => {
                                    //     item.isSpoiler && changeSpoiler(item.id)
                                    // }}
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
                            title="нажмешь - вылетишь"
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
                                    title="нажмешь - вылетишь"
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

export const AllCommentsList = (props) => {
    const {
        comments,
        loadMoreItems = () => {},
        modalRef,
        setModalContent,
        flatListRef,
        refreshControl,
        navigate,
        ListHeaderComponent,
        onScroll,
        ListFooterComponent
    } = props;

    return useMemo(() => {
        return (
            <FlatList
            data={comments.list}
            keyExtractor={(item) => "comment-" + item.id}
            renderItem={({ item }) => (
                    <RenderAllCommentsList
                    modalRef={modalRef}
                    setModalContent={setModalContent}
                    navigate={navigate}
                    item={item}
                    />
                )
            }
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            onEndReached={loadMoreItems}
            ref={flatListRef}
            refreshControl={refreshControl}
            nestedScrollEnabled
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            onScroll={onScroll}
            />
        )
    }, [comments])
};