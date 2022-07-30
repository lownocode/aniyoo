import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { 
    View, 
    RefreshControl, 
    ScrollView, 
    Text, 
    FlatList, 
    TouchableNativeFeedback, 
    StyleSheet, 
    Dimensions, 
    Image
} from "react-native";
import { PieChart } from 'react-native-svg-charts';
import axios from "axios";
import { Modalize } from "react-native-modalize";
import { EventRegister } from "react-native-event-listeners";
import { useRoute } from "@react-navigation/native";
import { Menu as Popup } from "react-native-material-menu";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../config/ThemeContext";

import {
    Avatar,
    Button,
    Cell,
    Divider,
    Header,
    Placeholder,
    PressIcon,
    Icon,
    ContentHeader
} from "../components";
import {
    storage,
    declOfNum,
    normalizeSize
} from "../functions";
import {
    USER_SCHEMA
} from "../../variables";
import { SetStatus, SocialNetworks } from "../modals";

export const Profile = props => {
    const theme = useContext(ThemeContext);
    const route = useRoute();
    
    const { 
        navigation: {
            navigate,
        },
        navigation,
        cachedUserData
    } = props;

    const [ refreshing, setRefreshing ] = useState(false);
    const [ userData, setUserData ] = useState(cachedUserData || route.params?.userData || USER_SCHEMA);
    const [ modalContent, setModalContent ] = useState(null);
    const [ friends, setFriends ] = useState([]);
    const [ popupVisible, setPopupVisible ] = useState(false);
    const [ browsingHistory, setBrowsingHistory ] = useState([]);

    const modalRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserData();
    }, []);

    const getCachedUserData = async () => {
        const data = await storage.getItem("cachedUserData");
        if(!data) return;
        setUserData(data);
    };

    useEffect(() => {
        getCachedUserData();
    }, []);

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/users.signIn", null, {
            headers: {
                "head": "test",
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            EventRegister.emit("app", {
                type: "changeUser",
                user: data
            });

            setUserData(data);
            if(data?.friendsCount >= 1) {
                getFriends();
            }
        })
        .finally(() => {
            setRefreshing(false);
        });
    }; 

    const getFriends = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/friends.get", {
            order: "online"
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setFriends(data);
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        });
    }; 

    const getBrowsingHistory = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/lists.get", {
            status: "history",
            limit: 5
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setBrowsingHistory(data.list);
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        });
    };

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            getUserData();
            getBrowsingHistory();
        });
    
        return willFocusSubscription;
    }, []);

    const statisticsChartValues = [
        userData?.list?.watching || 0,
        userData?.list?.completed || 0,
        userData?.list?.planned || 0,
        userData?.list?.postponed || 0,
        userData?.list?.dropped || 0,
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
                    fontSize: normalizeSize(16),
                    fontWeight: "600"
                }}
                >
                    {userData?.nickname || ""}
                </Text>
            }
            subtitle={
                <View>
                    <TouchableNativeFeedback 
                    onPress={() => {
                        setModalContent(
                            <SetStatus 
                            navigate={navigate} 
                            onClose={() => {
                                modalRef.current?.close();
                            }}
                            />
                        );
                        modalRef.current?.open();
                    }}
                    >
                        <Text 
                        style={{
                            color: userData?.status?.trim()?.length >= 1 ? theme.text_secondary_color : theme.accent,
                            fontSize: normalizeSize(11.5)
                        }}
                        numberOfLines={3}
                        >
                            {userData?.status?.trim()?.length >= 1 ? userData?.status : "Установить статус"}
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
                        <Text style={{ color: "gray", fontSize: normalizeSize(11), marginLeft: 4 }}>
                            Онлайн
                        </Text>
                    </View>
                </View>
            }
            disabled
            before={
                <Avatar
                url={userData?.photo}
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
                    userData?.tags?.map((item, index) => (
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
                        networks={userData?.social_networks}
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
                onPress={() => navigate("edit_profile")}
                />
            </View>

            <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginVertical: 10,
                marginHorizontal: 5
            }}
            >
                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    onPress={() => navigate("general_user.comments")}
                    >
                        <View
                        style={{
                            paddingVertical: 5,
                            paddingHorizontal: 30,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Text
                            style={{
                                fontSize: normalizeSize(17),
                                color: theme.accent,
                                fontWeight: "700"
                            }}
                            >
                                {userData?.commentsCount}
                            </Text>

                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            >
                                <Icon
                                name="comments"
                                color={theme.accent}
                                size={10}
                                />
                                <Text
                                style={{
                                    color: theme.accent,
                                    fontSize: normalizeSize(10),
                                    fontWeight: "500",
                                    marginLeft: 5
                                }}
                                >
                                    {declOfNum(userData?.commentsCount, ["комментарий","комментария","комментариев"])}
                                </Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    >
                        <View
                        style={{
                            paddingVertical: 5,
                            paddingHorizontal: 30,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Text
                            style={{
                                fontSize: normalizeSize(17),
                                color: theme.accent,
                                fontWeight: "700"
                            }}
                            >
                                {userData?.collectionsCount}
                            </Text>

                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            >
                                <Icon
                                name="layers"
                                color={theme.accent}
                                size={10}
                                />
                                <Text
                                style={{
                                    color: theme.accent,
                                    fontSize: normalizeSize(10),
                                    fontWeight: "500",
                                    marginLeft: 5
                                }}
                                >
                                    {declOfNum(userData?.collectionsCount, ["коллекция","коллекции","коллекций"])}
                                </Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>

            <Divider dividerStyle={{marginTop: 1}}/>

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
                                    height: normalizeSize(15),
                                    width: normalizeSize(30)
                                }}
                                >
                                    <View
                                    style={{
                                        width: normalizeSize(8),
                                        height: normalizeSize(8),
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
                                        fontSize: normalizeSize(12),
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
                                        fontSize: normalizeSize(12.5)
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

    const friendsListRender = ({ item }) => {
        return (
            <View
            key={"friend-" + item.id}
            style={{
                overflow: "hidden",
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20
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
                        alignItems: "center"
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
                            fontSize: normalizeSize(10),
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
            marginVertical: 20
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
                        {userData?.friendsCount}
                    </Text>
                </Text>
            }
            onPress={() => navigate("user.friends", { friends: friends })}
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: userData?.subscribersCount >= 1 ? theme.accent : theme.divider_color,
                    borderRadius: 100,
                    paddingVertical: 2,
                    paddingHorizontal: 9,
                }}
                >
                    <Text
                    style={{
                        color: "#fff",
                        fontSize: normalizeSize(10),
                        textAlignVertical: "center"
                    }}
                    >
                        {userData?.subscribersCount || 0} {declOfNum(userData?.subscribersCount, ["заявка","заявки","заявок"])}
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
            title={item?.anime?.title}
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
                        name="play"
                        color={theme.text_secondary_color}
                        size={9}
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
                        size={12}
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
                        size={14}
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

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            divider={false}
            title="Профиль"
            afterComponent={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 7,
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
                                fontSize: normalizeSize(11),
                                textAlign: "center"
                            }}
                            >
                                Дата регистрации: {dayjs(userData?.createdAt).format("DD MMM YYYY")}
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
            }
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            onClose={() => {
                getUserData();
                EventRegister.emit("changeTabbar", { type: "show" });
            }}
            >
                {modalContent}
            </Modalize>

            <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            refreshControl={
                <RefreshControl
                progressBackgroundColor={theme.refresh_control_background}
                colors={[theme.accent]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }
            >
                {userInfoRender()}  
                {statisticsRender()}
                {renderBrowsingHistory()}
            </ScrollView>
        </View>
    )
};