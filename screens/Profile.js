import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { View, RefreshControl, ScrollView, Text, Image, Linking, TouchableNativeFeedback, StyleSheet, Dimensions } from "react-native";
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
    Divider,
    Header,
    Icon,
    Placeholder,
    PressIcon,
    Rating,
    Snackbar
} from "../components";
import {
    dateFormatter, 
    storage,
    declOfNum,
    sleep
} from "../functions";
import {
    USER_SCHEMA
} from "../variables";
import { SetStatus } from "../modals";

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

    const modalRef = useRef();
    const snackbarRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserData();
    }, []);

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        
        axios.post("/user.signIn", null, {
            headers: {
                "Authorization": sign,
                "Content-Type": "application/json"
            }
        })
        .then(({ data }) => {
            setUserData(data);
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        })
        .finally(() => {
            setRefreshing(false);
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
        onRefresh();

        const willFocusSubscription = navigation.addListener('focus', () => {
            getUserData();
        });
    
        return willFocusSubscription;
    }, []);

    const statisticsChartValues = [0,0,0,0,0
        // userData.watch.length,
        // userData.watched.length,
        // userData.rewatching.length,
        // userData.in_plans.length,
        // userData.postponed.length,
        // userData.abandoned.length
    ];
    const statisticsChartColors = ['#34c759','#5856d6','#af52de','#ff9500', '#ff453a'];

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

    const socialNetworksButtonsRender = (item) => {
        let icon;
        let textColor;
        let title;
        let pressLink;

        if(item.network === "telegram") {
            icon = {type: "EvilIcons", name: "sc-telegram", size: 25};
            title = "Telegram";
            textColor = "#00a6ff";
            pressLink = "https://t.me/" + item.link;
        }
        if(item.network === "instagram") {
            icon = {type: "AntDesign", name: "instagram", size: 20};
            title = "Instagram";
            textColor = "#ff005d";
            pressLink = "https://instagram.com/" + item.link;
        }
        if(item.network === "vk") {
            icon = {type: "Entypo", name: "vk", size: 20};
            title = "ВКонтакте";
            textColor = "#0062ff";
            pressLink = "https://vk.com/" + item.link;
        }

        return (
            <Button
            key={item.network}
            title={title}
            onPress={() => Linking.openURL(pressLink)}
            before={
                <Icon
                {...icon}
                color={textColor}
                />
            }
            upperTitle={false}
            textColor={textColor}
            backgroundColor={textColor + "10"}
            containerStyle={{
                marginHorizontal: 5,
                marginBottom: 0
            }}
            />
        )
    };

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
                    {userData.nickname || ""}
                </Text>
            }
            subtitle={
                <View>
                    <TouchableNativeFeedback 
                    onPress={() => {
                        EventRegister.emit("changeTabbar", { type: "hide" });
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
                        style={{color: theme.text_secondary_color}}
                        numberOfLines={3}
                        >
                            {userData.status.trim().length < 1 ? "Статус не установлен" : userData.status}
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
                                Number(userData?.online) < Number(Date.now() + (1 * 1000 * 60)) ? "Онлайн" : 
                                `Был(-а) ${dayjs().to(Number(userData?.online) || 0)}`
                            } 
                        </Text>
                    </View>
                </View>
            }
            disabled
            before={
                <Avatar
                url={userData.photo || ""}
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
                            <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(item.color, false)}
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
                                    name="hashtag"
                                    type="Fontisto"
                                    color={item.color || theme.accent}
                                    style={{
                                        marginRight: 5
                                    }}
                                    size={9}
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
                            </TouchableNativeFeedback>
                        </View>
                    ))
                }
            </View>

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
                            <Icon
                            name="comment-multiple-outline"
                            type="MaterialCommunityIcons"
                            color={theme.accent}
                            size={30}
                            />

                            <Text
                            style={{
                                color: theme.accent,
                                fontSize: 12,
                                fontWeight: "500"
                            }}
                            >
                                <Text style={{fontWeight: "600"}}>{userData.comments} </Text>
                                {declOfNum(userData.comments, ["комментарий","комментария","комментариев"])}
                            </Text>
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
                            <Icon
                            name="layers"
                            type="Ionicons"
                            color={theme.accent}
                            size={30}
                            />

                            <Text
                            style={{
                                color: theme.accent,
                                fontSize: 12,
                                fontWeight: "500"
                            }}
                            >
                                <Text style={{fontWeight: "600"}}>{userData.collections} </Text>
                                {declOfNum(userData.collections, ["коллекция","коллекции","коллекций"])}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>

            <Divider dividerStyle={{marginTop: 1}}/>

            {friendsRender()}

            <Divider dividerStyle={{marginTop: 1}}/>

            {socialNetworksRender()}
        </View>
    );

    const socialNetworksRender = () => (
        <View>
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginHorizontal: 5,
                marginTop: 15
            }}
            >
                {   
                    userData?.social_networks.length > 0 && userData?.social_networks.map(socialNetworksButtonsRender)
                }

                <Button
                title="Редактировать социальные сети"
                before={
                    <Icon
                    type="Feather"
                    name="edit"
                    size={20}
                    color={theme.button.primary.text_color}
                    />
                }
                upperTitle={false}
                containerStyle={{
                    marginLeft: userData?.social_networks.length > 0 ? 5 : 15
                }}
                onPress={() => navigate("edit_social_networks")}
                />
            </View>
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
                    innerRadius={22}
                    style={{ height: 120, width: 109 }}
                    />
                )
            }
        </View>
    );

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
                    Друзья <Text style={{color: theme.text_secondary_color}}>{userData?.friends}</Text>
                </Text>
            }
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: userData?.friends >= 1 ? theme.accent : theme.divider_color,
                    borderRadius: 100,
                    paddingVertical: 2,
                    paddingHorizontal: 9,
                }}
                >
                    <Text
                    style={{
                        color: "#fff",
                        fontSize: 12
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
                userData.friends >= 1 ? (
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        {
                            userData?.friends?.map((item, index) => {
                                return (
                                    <View
                                    key={"friend_" + index}
                                    style={{
                                        overflow: "hidden",
                                        borderRadius: 8,
                                        marginHorizontal: 3,
                                    }}
                                    >
                                        <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
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
                            })
                        }
                    </ScrollView>
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
            title="Профиль"
            height={30}
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
            </ScrollView>
        </GestureHandlerRootView>
    )
};