import React, { useState, useCallback, useRef } from "react";
import { 
    View, 
    RefreshControl, 
    ScrollView, 
    FlatList, 
    TouchableNativeFeedback, 
    StyleSheet, 
    Dimensions, 
    Image,
    Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { PieChart } from 'react-native-svg-charts';
import { Modalize } from "react-native-modalize";
import { Menu as Popup } from "react-native-material-menu";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Avatar,
    Button,
    Cell,
    Divider,
    Placeholder,
    PressIcon,
    Icon,
    ContentHeader,
    Panel,
} from "../components";
import {
    storage,
    declOfNum,
} from "../functions";
import { SetStatus, SocialNetworks } from "../modals";
import { getUserData, setModalVisible } from "../redux/reducers";

export const Profile = props => {
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.theme);
    const { user, loading: userLoading } = useSelector(state => state.user);
    
    const { 
        navigation: {
            navigate,
        },
        navigation,
    } = props;

    const [ modalContent, setModalContent ] = useState(null);
    const [ friends, setFriends ] = useState([]);
    const [ popupVisible, setPopupVisible ] = useState(false);
    const [ browsingHistory, setBrowsingHistory ] = useState([]);

    const modalRef = useRef();

    const onRefresh = useCallback(() => {
        dispatch(getUserData());
    }, []);

    const userCounters = [
        {
            icon: (
                <Icon
                name="comments"
                size={14}
                color={theme.text_color}
                />
            ),
            title: "Комментарии",
            count: user?.commentsCount ?? 0,
            type: "comments",
            onPress: () => navigate("general_user.comments")
        },
        {
            icon: (
                <Icon
                name="layers"
                size={12}
                color={theme.text_color}
                />
            ),
            title: "Коллекции",
            count: user?.collectionsCount ?? 0,
            type: "collections"
        }
    ];

    const statisticsChartValues = [
        user?.list?.watching || 0,
        user?.list?.completed || 0,
        user?.list?.planned || 0,
        user?.list?.postponed || 0,
        user?.list?.dropped || 0,
    ];
    const statisticsChartColors = [theme.anime.watching, theme.anime.completed, theme.anime.planned, theme.anime.postponed, theme.anime.dropped];

    const lists = [
        {
            name: "Смотрю",
            icon: (
                <Icon
                name="eye"
                color={theme.text_secondary_color}
                size={12}
                />
            ),
        },
        {
            name: "Просмотрено",
            icon: (
                <Icon
                name="done-double"
                color={theme.text_secondary_color}
                size={12}
                />
            )
        },
        {
            name: "В планах",
            icon: (
                <Icon
                name="calendar"
                color={theme.text_secondary_color}
                size={10}
                />
            )
        },
        {
            name: "Отложено",
            icon: (
                <Icon
                name="pause-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        },
        {
            name: "Брошено",
            icon: (
                <Icon
                name="cancel-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        }
    ];

    const statisticsChartData = statisticsChartValues.map((value, index) => ({
        value,
        svg: {
            fill: statisticsChartColors[index],
        },
        key: `pie-${index}`,
    }));

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
            zIndex: 1000
        },
    });

    const userInfoRender = () => (
        <View
        style={{
            overflow: "hidden",
        }}
        >
            <Cell
            centered={false}
            title={
                <Text
                style={{
                    color: theme.text_color,
                    fontSize: 19,
                    fontWeight: "600",
                }}
                >
                    {user?.nickname || ""}
                </Text>
            }
            subtitle={
                <View>
                    <TouchableNativeFeedback 
                    onPress={() => 
                        dispatch(setModalVisible(true))
                        // setModalContent(
                        //     <SetStatus 
                        //     navigate={navigate} 
                        //     onClose={() => {
                        //         modalRef.current?.close();
                        //     }}
                        //     />
                        // );
                        // modalRef.current?.open();
                    }
                    >
                        <Text 
                        style={{
                            color: user?.status?.trim()?.length >= 1 ? theme.text_secondary_color : theme.accent,
                            fontSize: 13
                        }}
                        numberOfLines={3}
                        >
                            {user?.status?.trim()?.length >= 1 ? user?.status : "Установить статус"}
                        </Text>
                    </TouchableNativeFeedback>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon 
                        name="radio" 
                        color="gray"
                        size={13}
                        />
                        <Text style={{ color: "gray", fontSize: 12, marginLeft: 4 }}>
                            Онлайн
                        </Text>
                    </View>
                </View>
            }
            disabled
            before={
                <Avatar
                url={user?.photo}
                size={80}
                />
            }
            />

            <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginHorizontal: 15
            }}
            >
                {
                    user?.tags?.map((item, index) => (
                        <View
                        key={"tag_" + index}
                        style={{
                            backgroundColor: item.fill && item.background,
                            borderRadius: 100,
                            overflow: "hidden",
                            borderColor: item.background,
                            borderWidth: 1,
                            marginRight: 10,
                            borderRadius: 100,
                            marginTop: 5,
                        }}
                        >
                            <View
                            style={{
                                paddingVertical: 2,
                                paddingHorizontal: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                            >
                                {
                                    item?.icon && (
                                        <Icon
                                        name={item?.icon?.name}
                                        color={item?.icon?.color || item?.color || theme.accent}
                                        size={item?.icon?.size || 9}
                                        />
                                    )
                                }

                                <Text
                                style={{
                                    fontWeight: "500",
                                    color: item.color || theme.accent,
                                    marginLeft: item?.icon ? 5 : 0
                                }}
                                >
                                    {
                                        item.text
                                    }
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>

            <View
            style={{
                flexDirection: "row"
            }}
            >
                <Button
                title="Соц. сети"
                upperTitle={false}
                size={37}
                textStyle={{
                    fontWeight: "400"
                }}
                before={
                    <Icon
                    name="globe-online"
                    color={theme.button.primary.text_color}
                    size={30}
                    />
                }
                containerStyle={{
                    marginBottom: 0,
                    marginRight: 0
                }}
                onPress={() => {
                    setModalContent(
                        <SocialNetworks 
                        networks={user?.social_networks}
                        navigate={navigate} 
                        onClose={() => {
                            modalRef.current?.close();
                        }}
                        />
                    );
                    modalRef.current?.open();
                }}
                />

                <Button
                title="Редактировать"
                upperTitle={false}
                size={37}
                textStyle={{
                    fontWeight: "400"
                }}
                before={
                    <Icon
                    name="user-edit"
                    color={theme.button.primary.text_color}
                    />
                }
                containerStyle={{
                    marginBottom: 0
                }}
                onPress={() => navigate("edit_profile", { user: user })}
                />
            </View>

            <View
            style={{
                backgroundColor: theme.divider_color + "60",
                borderRadius: 100,
                marginHorizontal: 10,
                marginVertical:  20,
                paddingVertical: 5,
                overflow: "hidden"
            }}
            >
                <ScrollView
                horizontal
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}
                >
                    {
                        userCounters.map(renderCounters)
                    }
                </ScrollView>
            </View>

            {friendsRender()}
        </View>
    );

    const statisticsRender = () => (
        <View>
            <ContentHeader
            text="Статистика"
            icon={
                <Icon
                name="bar-chart"
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
                        color: theme.text_secondary_color
                    }}
                    >
                        Подробно
                    </Text>

                    <Icon
                    name="chevron-right"
                    color={theme.text_secondary_color}
                    />
                </View>
            }
            />

            <View
            style={{
                marginHorizontal: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 20
            }}
            >
                <View>
                    {
                        lists.map((item, index) => (
                            <View
                            key={"list-" + index}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: index !== 0 ? 5 : 0
                            }}
                            >
                                <View
                                style={{
                                    paddingVertical: 3,
                                    paddingLeft: 4,
                                    paddingRight: 6,
                                    borderRadius: 100,
                                    borderWidth: 0.5,
                                    borderColor: statisticsChartColors[index] + "90",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    height: 17,
                                    width: 38
                                }}
                                >
                                    <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 100,
                                        backgroundColor: statisticsChartColors[index],
                                        marginRight: 5
                                    }}
                                    />

                                    {
                                        item.icon
                                    }
                                </View>

                                <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                >
                                    <Text
                                    style={{
                                        marginLeft: 10,
                                        fontSize: 15,
                                        fontWeight: "500",
                                        color: theme.text_secondary_color + "90"
                                    }}
                                    >
                                        {
                                            item.name
                                        }
                                    </Text>

                                    <Text
                                    style={{
                                        marginLeft: 6,
                                        fontWeight: "700",
                                        color: theme.text_secondary_color,
                                        fontSize: 15.5
                                    }}
                                    > 
                                        {
                                            statisticsChartValues[index]
                                        }
                                    </Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
                
                {
                    statisticsChartValues.reduce((a, b) => a + b) === 0 ? (
                        <Icon
                        name="pie-chart"
                        color={theme.divider_color}
                        size={109}
                        />
                    ) : (
                        <PieChart 
                        data={statisticsChartData}
                        innerRadius={27}
                        animate={true}
                        style={{ height: 120, width: 109 }}
                        />
                    )
                }
            </View>
        </View>
    );

    const friendsListRender = ({ item, index }) => {
        return (
            <View
            key={"friend-" + item.id}
            style={{
                overflow: "hidden",
                borderRadius: 15,
                marginLeft: index === 0 ? 10 : 0,
                marginRight: index + 1 === friends.length ? 10 : 0
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                onPress={() => navigate("user_profile", { userId: item.id })}
                >
                    <View
                    style={{
                        paddingVertical: 7,
                        paddingHorizontal: 5,
                        width: 70,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <Avatar
                        size={55}
                        url={item.photo}
                        online={(+new Date() - +new Date(item?.online?.time)) < 1 * 60 * 1000}
                        />

                        <Text
                        numberOfLines={2}
                        style={{
                            color: theme.text_color,
                            fontSize: 12,
                            textAlign: "center"
                        }}
                        >
                            {item.nickname}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    };

    const friendsRender = () => (
        <View
        style={{
            marginBottom: 20,
        }}
        >
            <Cell
            centered
            before={
                <Icon
                name="users-outline"
                color={theme.text_color}
                size={17}
                />
            }
            title={
                <Text
                style={{
                    fontWeight: "500",
                    color: theme.text_color
                }}
                >
                    Друзья <Text 
                    style={{ 
                        color: theme.text_secondary_color, 
                        fontWeight: "300",
                    }}
                    >
                        {user?.friendsCount}
                    </Text>
                </Text>
            }
            onPress={() => navigate("user.friends", { friends: friends })}
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: user?.subscribersCount >= 1 ? theme.accent : theme.divider_color,
                    borderRadius: 100,
                    paddingVertical: 2,
                    paddingHorizontal: 9,
                }}
                >
                    <Text
                    style={{
                        color: "#fff",
                        fontSize: 12,
                        textAlignVertical: "center"
                    }}
                    >
                        {user?.subscribersCount || 0} {declOfNum(user?.subscribersCount, ["заявка","заявки","заявок"])}
                    </Text>

                    <Icon
                    name="chevron-right"
                    color="#fff"
                    size={14}
                    />
                </View>
            }
            />

            {
                friends?.length >= 1 ? (
                    <FlatList
                    horizontal
                    data={friends}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={friendsListRender}
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    />
                ) : (
                    <Placeholder
                    title="Пусто"
                    subtitle="Похоже, Вы ещё не завели друзей :("
                    />
                )
            }
        </View>
    );

    const renderBrowsingHistoryItems = (item) => {
        return (
            <Cell
            key={"anime-" + item.anime.id}
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

    const renderBrowsingHistory = () => {
        return (
            <View>
                <ContentHeader
                text="История просмотров"
                icon={
                    <Icon
                    name="replay"
                    color={theme.text_secondary_color}
                    />
                }
                onPress={() => navigate("general_user.browsing_history", {
                    initialHistory: browsingHistory
                })}
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
                            color: theme.text_secondary_color
                        }}
                        >
                            Все
                        </Text>

                        <Icon
                        name="chevron-right"
                        color={theme.text_secondary_color}
                        />
                    </View>
                }
                />

                <View style={{ marginTop: 10 }} />

                {
                    browsingHistory.length === 0 ? (
                        <Placeholder
                        title="Пусто"
                        subtitle="Вы ещё ничего не посмотрели"
                        />
                    ) : browsingHistory.map(renderBrowsingHistoryItems)
                }
            </View>
        )
    };

    const renderCounters = (item) => {
        return (
            <View
            key={"counter-" + item.type}
            style={{
                backgroundColor: theme.divider_color,
                borderRadius: 100,
                flex: 1,
                marginHorizontal: 5,
                overflow: "hidden",
            }}
            >
                <TouchableNativeFeedback
                onPress={() => item.onPress()}
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                >
                    <View
                    style={{
                        paddingVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                    }}
                    >
                        {
                            item.icon
                        }

                        <Text
                        style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: theme.text_color,
                        }}
                        >
                            {
                                item.title
                            }
                        </Text>

                        <Text
                        style={{
                            color: theme.text_color,
                            fontWeight: "600",
                            fontSize: 16
                        }}
                        >
                            {
                                item.count
                            }
                        </Text>

                        <Icon
                        name="chevron-right"
                        color={theme.text_color}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    };

    const renderHeaderAfterActions = () => {
        return (
            <View
            style={{
                flexDirection: "row",
                alignItems: "center"
            }}
            >
                <Popup
                visible={popupVisible}
                onRequestClose={() => setPopupVisible(false)}
                animationDuration={100}
                style={{
                    backgroundColor: theme.popup_background,
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                anchor={
                    <PressIcon 
                    icon={
                        <Icon 
                        name="four-dots" 
                        color={theme.icon_color} 
                        />
                    }
                    onPressIn={() => setPopupVisible(true)}
                    containerStyle={{
                        marginRight: 15
                    }}
                    />
                }
                >
                    <Cell
                    title="Скопировать ссылку"
                    before={
                        <Icon
                        name="copy-outline"
                        color={theme.icon_color}
                        />
                    }
                    containerStyle={{
                        paddingVertical: 15
                    }}
                    contentStyle={{
                        flex: 0
                    }}
                    />

                    <Divider />

                    <Cell
                    title="Поделиться"
                    flexedContent={false}
                    before={
                        <Icon
                        color={theme.icon_color}
                        name="share"
                        />
                    }
                    containerStyle={{
                        paddingVertical: 15
                    }}
                    contentStyle={{
                        flex: 0
                    }}
                    />

                    <View
                    style={{
                        marginVertical: 10
                    }}
                    >
                        <Text
                        style={{
                            fontSize: 13,
                            textAlign: "center"
                        }}
                        >
                            Дата регистрации: {dayjs(user?.createdAt).format("DD MMM YYYY")}
                        </Text>
                    </View>
                </Popup>

                <PressIcon 
                icon={
                    <Icon 
                    name="gear-outline" 
                    color={theme.icon_color} 
                    size={25}
                    />
                }
                onPress={() => navigate("settings")}
                />
            </View>
        )
    };

    return (
        <Panel
        headerProps={{
            title: "Профиль",
            afterActions: renderHeaderAfterActions()
        }}
        >
            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>

            <ScrollView
            refreshControl={
                <RefreshControl
                progressBackgroundColor={theme.refresh_control_background}
                colors={[theme.accent]}
                refreshing={userLoading}
                onRefresh={onRefresh}
                />
            }
            >
                {userInfoRender()}  
                {statisticsRender()}
                {renderBrowsingHistory()}
            </ScrollView>
        </Panel>
    )
};