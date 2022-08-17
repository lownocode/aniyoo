import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { 
    View, 
    RefreshControl, 
    ScrollView, 
    FlatList, 
    TouchableNativeFeedback, 
    StyleSheet, 
    Dimensions, 
    ToastAndroid,
    Image,
    Text
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Modalize } from "react-native-modalize";
import { PieChart } from "react-native-svg-charts";
import { Menu as Popup } from "react-native-material-menu";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Avatar,
    Button,
    Cell,
    ContentHeader,
    Divider,
    Panel,
    Icon,
    Placeholder,
    PressIcon,
} from "../../components";
import {
    SocialNetworks
} from "../../modals";

import {
    storage,
    declOfNum,
} from "../../functions";
import UserContext from "../../config/UserContext";

export const AnotherUserProfile = (props) => {
    const { theme } = useSelector(state => state.theme);
    const user = useContext(UserContext);

    const route = useRoute();

    const { 
        navigation: {
            navigate,
            goBack
        },
        navigation
    } = props;

    const [ refreshing, setRefreshing ] = useState(false);
    const [ userData, setUserData ] = useState({});
    const [ modalContent, setModalContent ] = useState(null);
    const [ popupVisible, setPopupVisible ] = useState(false);
    const [ friends, setFriends ] = useState([]);
    const [ browsingHistory, setBrowsingHistory ] = useState([]);

    const modalRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserData();
    }, []);

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/users.get", {
            userId: route.params?.userId
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setUserData(data);
            if(data?.friendsCount >= 1) {
                getFriends();
            }
            console.log(data.relation)
            getBrowsingHistory();
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
            navigate("authorization");
        })
        .finally(() => {
            setRefreshing(false);
        });
    }; 

    const getFriends = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/friends.get", {
            userId: route.params?.userId,
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
            limit: 5,
            userId: route.params?.userId
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
                onPress={() => {
                    if(item.id === user.id) {
                        return ToastAndroid.show("Это Вы", ToastAndroid.CENTER);
                    }

                    navigation.push("user_profile", { userId: item.id })
                }}
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
                        fontSize: 12,
                        textAlignVertical: "center"
                    }}
                    >
                        {userData?.subscribersCount || 0} {declOfNum(userData?.subscribersCount, ["подписчик","подписчика","подписчиков"])}
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
                    subtitle={`Похоже, ${userData?.nickname} ещё не завел(-а) друзей :(`}
                    />
                )
            }
        </View>
    );

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
                    fontWeight: "600"
                }}
                >
                    {userData?.nickname || ""}
                </Text>
            }
            subtitle={
                <View>
                    <Text 
                    style={{
                        color: theme.text_secondary_color,
                        fontStyle: userData?.status?.trim()?.length >= 1 ? "normal" : "italic",
                        fontSize: 13
                    }}
                    numberOfLines={3}
                    >
                        {userData?.status?.trim()?.length >= 1 ? userData?.status : "Статус не установлен"}
                    </Text>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon 
                        name="radio" 
                        color="gray"
                        />
                        <Text style={{ color: "gray", fontSize: 12, marginLeft: 4 }}>
                            {
                                (+new Date() - +new Date(userData?.online?.time || new Date())) < 1 * 60 * 1000 ? "Онлайн" : 
                                `Был(-а) ${dayjs().to(userData?.online?.time || new Date())}`
                            } 
                        </Text>
                    </View>
                </View>
            }
            disabled
            before={
                <Avatar
                url={userData?.photo || ""}
                size={80}
                borderRadius={29}
                />
            }
            />

            {
                userData?.online?.state === "watching" && (
                    <View>
                        <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                        onPress={() => navigate("anime", { animeData: userData?.online?.payload?.anime })}
                        >
                            <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                // alignItems: "center"
                            }}
                            >
                                <View
                                style={{
                                    marginRight: 10,
                                    alignItems: "center"
                                }}
                                >
                                    <Image
                                    source={{
                                        uri: userData?.online?.payload?.anime?.poster
                                    }}
                                    style={{
                                        width: 25,
                                        height: 30,
                                        borderRadius: 3
                                    }}
                                    />

                                    <Text
                                    style={{
                                        fontSize: 8,
                                        textAlign: "center",
                                        color: theme.text_secondary_color
                                    }}
                                    >
                                        Смотрю
                                    </Text>
                                </View>

                                <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    flex: 1,
                                    marginRight: 5
                                }}
                                >
                                    <View>
                                        <Text
                                        numberOfLines={1}
                                        style={{
                                            color: theme.text_color,
                                            fontWeight: "500",
                                            fontSize: 15
                                        }}
                                        >
                                            {
                                                userData?.online?.payload?.anime?.title
                                            }  
                                        </Text>

                                        <Text
                                        numberOfLines={1}
                                        style={{
                                            color: theme.text_secondary_color,
                                            fontSize: 12,
                                        }}
                                        >
                                            {
                                                userData?.online?.payload?.episode
                                            } серия • {
                                                userData?.online?.payload?.translation?.title
                                            } • {
                                                userData?.online?.payload?.source
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                >
                                    <Icon
                                    name="chevron-right"
                                    color={theme.icon_color}
                                    />
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>   
                )
            }

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
                        from="another"
                        onClose={() => {
                            modalRef.current?.close();
                        }}
                        />
                    );
                    modalRef.current?.open();
                }}
                />

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
                    <Button
                    title={
                        {
                            "nobody": "Добавить в друзья",
                            "friends": "В друзьях",
                            "sendSubscribe": "Вы подписаны",
                            "subscriber": "Ваш подписчик"
                        }[userData?.relation]
                    }
                    upperTitle={false}
                    size={37}
                    textStyle={{
                        fontWeight: "400"
                    }}
                    before={
                        <Icon
                        color={theme.button.primary.text_color}
                        name={
                            {
                                "nobody": "user-check",
                                "friends": "user-check",
                                "sendSubscribe": "user-check",
                                "subscriber": "user-check"
                            }[userData?.relation]
                        }
                        />
                    }
                    containerStyle={{
                        marginBottom: 0
                    }}
                    onPress={() => friendActions()}
                    />
                }
                >
                    <View>
                        <Text>
                            test
                        </Text>
                    </View>
                </Popup>
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
                    onPress={() => navigate("general_user.comments", { userId: route.params?.userId })}
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
                                fontSize: 22,
                                color: theme.accent,
                                fontWeight: "700",
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
                                    fontSize: 12,
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
                                fontSize: 22,
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
                                    fontSize: 12,
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
                        type="FontAwesome"
                        name="pie-chart"
                        color={theme.divider_color}
                        size={109}
                        />
                    ) : (
                        <PieChart 
                        data={statisticsChartData}
                        innerRadius={25}
                        animate={true}
                        style={{ height: 120, width: 109 }}
                        />
                    )
                }
            </View>
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
                <Image
                resizeMethod="resize"
                source={{
                    uri: item?.anime?.poster
                }}
                style={{
                    width: 85,
                    height: 110,
                    resizeMode: "cover",
                    borderRadius: 7,
                    borderColor: theme.divider_color,
                    borderWidth: 0.5,
                    backgroundColor: theme.divider_color,
                }}
                />
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
                    initialHistory: browsingHistory,
                    userId: route.params?.userId,
                    username: userData?.nickname
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
                        subtitle={`${userData?.nickname} ещё ничего не посмотрел(-а)`}
                        />
                    ) : browsingHistory.map(renderBrowsingHistoryItems)
                }
            </View>
        )
    };

    const friendActions = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        if(userData?.relation === "nobody" || userData?.relation === "subscriber") {
            setUserData({
                ...userData,
                relation: "sendSubscribe"
            });
        
            return axios.post("/friends.sendRequest", {
                userId: route.params?.userId
            }, {
                headers: {
                    "Authorization": sign,
                }
            })
            .then(({ data }) => {
                getUserData();
                ToastAndroid.show(data.message, ToastAndroid.LONG);
            })
            .catch(({ response: { data } }) => {
                ToastAndroid.show(data.message, ToastAndroid.LONG);
            })
            .finally(() => getUserData());
        }

        if(userData?.relation === "sendSubscribe" || userData?.relation === "friends") {
            setUserData({
                ...userData,
                relation: "nobody"
            });
        
            return axios.post("/friends.delete", {
                userId: route.params?.userId
            }, {
                headers: {
                    "Authorization": sign,
                }
            })
            .then(({ data }) => {
                ToastAndroid.show(data.message, ToastAndroid.LONG);
            })
            .catch(({ response: { data } }) => {
                ToastAndroid.show(data.message, ToastAndroid.LONG);
            })
            .finally(() => getUserData());
        }
    };

    return (
        <Panel
        headerProps={{
            title: "Профиль",
            backOnPress: () => goBack()
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
        </Panel>
    )
};