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
    Image
} from "react-native";
import { PieChart } from 'react-native-svg-charts';
import axios from "axios";
import { Modalize } from "react-native-modalize";
import { EventRegister } from "react-native-event-listeners";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../config/ThemeContext";

import {
    Avatar,
    Button,
    Cell,
    ContentHeader,
    Divider,
    Header,
    Icon,
    Placeholder,
    PressIcon,
    Snackbar
} from "../components";
import {
    storage,
    declOfNum,
    sleep
} from "../functions";
import {
    USER_SCHEMA
} from "../variables";
import { SetStatus, SocialNetworks } from "../modals";

export const Profile = props => {
    const theme = useContext(ThemeContext);
    
    const { 
        navigation: {
            navigate,
        },
        navigation
    } = props;

    const [ refreshing, setRefreshing ] = useState(false);
    const [ userData, setUserData ] = useState(USER_SCHEMA);
    const [ modalContent, setModalContent ] = useState(null);
    const [ snackbar, setSnackbar ] = useState(null);
    const [ friends, setFriends ] = useState([]);

    const modalRef = useRef();
    const snackbarRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserData();
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
        
        axios.post("/friends.get", null, {
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
        const eventListener = EventRegister.addEventListener("profile", (event) => {
            if(event.type === "show_snackbar") {
                getUserData();

                setSnackbar({ 
                    text: event.data.text,
                    before: event.data.before
                });

                snackbarRef?.current?.show();
                
                sleep(5).then(() => snackbarRef?.current?.hide());
            }
        });

        return () => {
            EventRegister.removeEventListener(eventListener);
        };
    }, []);

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
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            ),
        },
        {
            name: "Просмотрено",
            icon: (
                <Icon
                name="check"
                type="FontAwesome"
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
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            )
        },
        {
            name: "Отложено",
            icon: (
                <Icon
                name="pause-circle-outline"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            )
        },
        {
            name: "Брошено",
            icon: (
                <Icon
                name="cancel"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={13}
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
            bottom: 80,
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
                    fontSize: 20,
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
                            color: theme.text_secondary_color,
                            fontStyle: userData?.status?.trim()?.length >= 1 ? "normal" : "italic"
                        }}
                        numberOfLines={3}
                        >
                            {userData?.status?.trim()?.length >= 1 ? userData?.status : "Статус не установлен"}
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
                        type="Feather" 
                        color="gray"
                        style={{marginRight: 4}}
                        />
                        <Text style={{color: "gray", fontSize: 12}}>
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
                size={85}
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
                                type={item?.icon?.type}
                                color={item?.icon?.color || item?.color || theme.accent}
                                style={{
                                    marginRight: 5
                                }}
                                size={item?.icon?.size || 9}
                                />

                                <Text
                                style={{
                                    fontWeight: "500",
                                    color: item.color || theme.accent
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
                    type="Ionicons"
                    name="globe-outline"
                    color={theme.button.primary.text_color}
                    size={17}
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
                    type="MaterialCommunityIcons"
                    name="account-edit-outline"
                    color={theme.button.primary.text_color}
                    size={19}
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
                                fontSize: 20,
                                color: theme.accent,
                                fontWeight: "700"
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
                                name="comment-multiple-outline"
                                type="MaterialCommunityIcons"
                                color={theme.accent}
                                size={10}
                                style={{
                                    marginRight: 5
                                }}
                                />
                                <Text
                                style={{
                                    color: theme.accent,
                                    fontSize: 12,
                                    fontWeight: "500"
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
                                fontSize: 20,
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
                                type="Ionicons"
                                color={theme.accent}
                                size={10}
                                style={{
                                    marginRight: 5
                                }}
                                />
                                <Text
                                style={{
                                    color: theme.accent,
                                    fontSize: 12,
                                    fontWeight: "500"
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
            marginTop: 20,
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
                            paddingVertical: 2,
                            paddingLeft: 4,
                            paddingRight: 5,
                            borderRadius: 100,
                            borderWidth: 0.5,
                            borderColor: statisticsChartColors[index] + "90",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
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
                                fontSize: 16
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
                name="users"
                type="FontAwesome5"
                color={theme.text_color}
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
                        fontSize: 12,
                        textAlignVertical: "center"
                    }}
                    >
                        {userData?.subscribers || 0} {declOfNum(userData?.subscribers, ["заявка","заявки","заявок"])}
                    </Text>

                    <Icon
                    name="chevron-forward"
                    type="Ionicons"
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
                    subtitle="Похоже, Вы ещё не завели друзей :("
                    />
                )
            }
        </View>
    );

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            divider={false}
            title="Профиль"
            afterComponent={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 7
                }}
                >
                    <PressIcon 
                    icon={<Icon name="dots-three-horizontal" type="Entypo" color={theme.icon_color} size={20}/>}
                    onPress={() => navigate("settings")}
                    containerStyle={{
                        marginRight: 15
                    }}
                    />

                    <PressIcon 
                    icon={<Icon name="settings" type="Feather" color={theme.icon_color} size={20}/>}
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

            <Snackbar
            ref={snackbarRef}
            text={snackbar?.text}
            before={snackbar?.before}
            containerStyle={{ bottom: 80 }}
            />

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
                {
                    userData?.online?.payload?.anime && (
                        <>
                            <ContentHeader
                            text={`${userData?.nickname} сейчас смотрит`}
                            indents
                            />
                            <View
                            style={{
                                marginBottom: 10,
                                marginHorizontal: 10,
                                height: 120,
                                justifyContent: "center"
                            }}
                            >
                                <Image
                                source={{
                                    uri: userData?.online?.payload?.anime?.poster
                                }}
                                style={{
                                    width: "100%",
                                    height: 120,
                                    // opacity: 0.3,
                                    borderRadius: 15,
                                }}
                                resizeMethod="resize"
                                resizeMode="cover"
                                blurRadius={15}
                                />

                                <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    borderRadius: 15,
                                    overflow: "hidden"
                                }}
                                >
                                    <Cell
                                    title={userData?.online?.payload?.anime?.title}
                                    centered={false}
                                    before={
                                        <Image
                                        resizeMethod="resize"
                                        source={{
                                            uri: userData?.online?.payload?.anime?.poster
                                        }}
                                        style={{
                                            width: 60,
                                            height: 100,
                                            resizeMode: "cover",
                                            borderRadius: 10,
                                        }}
                                        />
                                    }
                                    titleStyle={{
                                        color: "#fff",
                                        textShadowColor: "#000",
                                        textShadowRadius: 5
                                    }}
                                    subtitle={
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap"
                                        }}
                                        >
                                            <View>
                                                <Text
                                                style={{
                                                    color: "#fff",
                                                    textShadowColor: "#000",
                                                    textShadowRadius: 5,
                                                    fontSize: 12,
                                                    backgroundColor: theme.divider_color + "98",
                                                    paddingHorizontal: 5,
                                                    paddingVertical: 1,
                                                    borderRadius: 5,
                                                    marginTop: 5,
                                                    marginRight: 10,
                                                }}
                                                >
                                                    {userData?.online?.payload?.episode} серия
                                                </Text>
                                            </View>

                                            <View>
                                                <Text
                                                style={{
                                                    color: "#fff",
                                                    textShadowColor: "#000",
                                                    textShadowRadius: 5,
                                                    fontSize: 12,
                                                    backgroundColor: theme.divider_color + "98",
                                                    paddingHorizontal: 5,
                                                    paddingVertical: 1,
                                                    borderRadius: 5,
                                                    marginTop: 5,
                                                    marginRight: 10,
                                                }}
                                                >
                                                    {userData?.online?.payload?.translation?.title}
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                    />
                                </View>
                            </View> 
                        </>
                    )
                } 
                {statisticsRender()}

                <View
                style={{marginBottom: 100}}
                />  
            </ScrollView>

            <View style={{ marginBottom: 60 }}/>
        </GestureHandlerRootView>
    )
};