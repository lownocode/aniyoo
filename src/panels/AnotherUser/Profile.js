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
    ToastAndroid,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Modalize } from "react-native-modalize";
import { PieChart } from "react-native-svg-charts";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";

import {
    Avatar,
    Button,
    Cell,
    Divider,
    Header,
    Icon,
    Placeholder,
} from "../../components";
import {
    FriendActions,
    SocialNetworks
} from "../../modals";

import {
    storage,
    declOfNum,
    normalizeSize
} from "../../functions";
import UserContext from "../../config/UserContext";

export const AnotherUserProfile = (props) => {
    const theme = useContext(ThemeContext);
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
    const [ friends, setFriends ] = useState([]);

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
            userId: route.params?.userId
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

    const friendsListRender = ({ item }) => {
        return (
            <View
            key={"friend-" + item.id}
            style={{
                overflow: "hidden",
                borderRadius: 8,
                marginHorizontal: 3,
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
                        size={40}
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
                    Друзья <Text style={{color: theme.text_secondary_color}}>{userData?.friendsCount}</Text>
                </Text>
            }
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: userData?.subscribers >= 1 ? theme.accent : theme.divider_color,
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
                        {userData?.subscribers || 0} {declOfNum(userData?.subscribers, ["подписчик","подписчика","подписчиков"])}
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
                    fontSize: normalizeSize(16),
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
                        fontStyle: userData?.status?.trim()?.length >= 1 ? "normal" : "italic"
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
                        <Text style={{ color: "gray", fontSize: normalizeSize(11), marginLeft: 4 }}>
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
                size={60}
                borderRadius={29}
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
                                <Icon
                                name={item?.icon?.name}
                                color={item?.icon?.color || item?.color || theme.accent}
                                size={item?.icon?.size || 9}
                                />

                                <Text
                                style={{
                                    fontWeight: "500",
                                    color: item.color || theme.accent,
                                    marginLeft: 5
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

                <Button
                title={
                    {
                        "nobody": "Добавить в друзья",
                        "friends": "В друзьях",
                        "sendSubscribe": "Ваш подписчик",
                        "subscriber": "Вы подписаны"
                    }[userData?.relation]
                }
                upperTitle={false}
                size={37}
                textStyle={{
                    fontWeight: "400"
                }}
                before={
                    <Icon
                    name="chevron-down"
                    color={theme.button.primary.text_color}
                    size={19}
                    />
                }
                containerStyle={{
                    marginBottom: 0
                }}
                onPress={() => {
                    setModalContent(
                        <FriendActions 
                        relation={userData?.relation}
                        onClose={() => {
                            modalRef.current?.close();
                        }}
                        />
                    );
                    modalRef.current?.open();
                }}
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
                                fontWeight: "700",
                            }}
                            >
                                {userData?.comments}
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
                                    {declOfNum(userData?.comments, ["комментарий","комментария","комментариев"])}
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
                                {userData?.collections}
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
                                    {declOfNum(userData?.collections, ["коллекция","коллекции","коллекций"])}
                                </Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>

            <Divider dividerStyle={{marginTop: 1}}/>

            {friendsRender()}

            <Divider dividerStyle={{marginTop: 1}}/>
        </View>
    );

    const statisticsRender = () => (
        <View
        style={{
            marginHorizontal: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
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
                            height: 20,
                            width: 40
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
    );

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Профиль"
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

                <Cell
                title="Списки"
                subtitle="Нажмите, чтобы открыть"
                before={
                    <Icon
                    name="text-bullet-list"
                    color={theme.icon_color}
                    size={17}
                    />
                }
                after={
                    <Icon
                    name="chevron-right"
                    color={theme.icon_color}
                    size={17}
                    />
                }
                />
                {statisticsRender()}
            </ScrollView>
        </GestureHandlerRootView>
    )
};