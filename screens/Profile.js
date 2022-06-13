import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { View, RefreshControl, ScrollView, Text, Image, Linking, TouchableNativeFeedback } from "react-native";
import { PieChart } from 'react-native-svg-charts';
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import themeContext from "../config/themeContext";

import {
    Avatar,
    BottomModal,
    Button,
    Cell,
    Divider,
    Header,
    Icon,
    Placeholder,
    PressIcon,
    Rating
} from "../components";
import {
    dateFormatter, 
    storage,
    declOfNum
} from "../functions";
import {
    USER_SCHEMA
} from "../variables";
import { EditSocialNetworks, SetStatus } from "../modals";

export const Profile = props => {
    const theme = useContext(themeContext);
    
    const { 
        navigation: {
            navigate,
        },
        navigation
    } = props;

    const [ refreshing, setRefreshing ] = useState(false);
    const [ userData, setUserData ] = useState(USER_SCHEMA);
    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserData();
    }, []);

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        axios.post("/user.signIn", null, {
            headers: {
                "authorization": sign,
                "Content-Type": "application/json"
            }
        })
        .then(({ data }) => {
            setUserData(data)
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        })
        .finally(() => {
            setRefreshing(false);
        });
    }; 

    useEffect(() => {
        onRefresh();
    }, []);

    const statisticsChartValues = [0,0,0,0,0,0
        // userData.watch.length,
        // userData.watched.length,
        // userData.rewatching.length,
        // userData.in_plans.length,
        // userData.postponed.length,
        // userData.abandoned.length
    ];
    const statisticsChartColors = ['#25cf19','#1070de','#03fcdf','#770ecc','#f79502', '#f71202'];

    const statisticsChartData = statisticsChartValues.map((value, index) => ({
        value,
        svg: {
            fill: statisticsChartColors[index],
        },
        key: `pie-${index}`,
    }));

    const lastGradeReleasesRender = (item) => (
        <Cell
        key={"release-"+item.id}
        title={item.title}
        before={
            <Image
            source={{
                uri: item.poster
            }}
            style={{
                width: 50,
                height: 80,
                resizeMode: "cover",
                borderRadius: 8
            }}
            />
        }
        subtitle={
            <View>
                <Rating
                length={5}
                select={item.stars}
                iconSelect={<Icon type="AntDesign" name="star" color="gold"/>}
                iconUnselect={<Icon type="AntDesign" name="staro" color="gray"/>}
                containerStyle={{
                    marginBottom: 5
                }}
                />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
                >
                    <Icon type="Fontisto" name="date" style={{marginRight: 5}}/>
                    <Text>
                        {dateFormatter(item.date)}
                    </Text>
                </View>
            </View>
        }
        after={
            <Icon
            name="arrow-up-right"
            type="Feather"
            size={20}
            color={theme.icon_color}
            />
        }
        />
    );

    const recentlyViewsRender = (item) => (
        <Cell
        key={"release-"+item.id}
        title={item.title}
        before={
            <Image
            source={{
                uri: item.poster
            }}
            style={{
                width: 50,
                height: 80,
                resizeMode: "cover",
                borderRadius: 8
            }}
            />
        }
        subtitle={
            <View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
                >
                    <Icon type="Fontisto" name="date" style={{marginRight: 5}}/>
                    <Text>
                        {dateFormatter(item.date)}
                    </Text>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
                >
                    <Icon type="AntDesign" name="eyeo" style={{marginRight: 5}}/>
                    <Text>
                        Просмотренная серия: {item.serie}
                    </Text>
                </View>
            </View>
        }
        after={
            <Icon
            name="arrow-up-right"
            type="Feather"
            size={20}
            color={theme.icon_color}
            />
        }
        />
    );

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
                marginHorizontal: 5
            }}
            />
        )
    };

    const userInfoRender = () => (
        <View
        style={{
            backgroundColor: theme.header_background_color,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
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
                        setModalContent(
                            <SetStatus 
                            onClose={() => {
                                modalRef?.current?.hide();
                                setModalContent(null);
                            }} 
                            navigation={navigation} 
                            />
                        );
                        modalRef?.current?.show();
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
                            В сети
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
                    onPress={() => console.log("assembly")}
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
                    onPress={() => console.log("comments")}
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
                                {declOfNum(userData.collections, ["коллекций","коллекции","коллекций"])}
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
            <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                {
                    userData?.social_networks.length > 0 && userData?.social_networks.map(socialNetworksButtonsRender)
                }

                <Button
                title="Добавить"
                before={
                    <Icon
                    type="Ionicons"
                    name="add"
                    size={25}
                    color={theme.button.primary.text_color}
                    />
                }
                upperTitle={false}
                containerStyle={{
                    marginLeft: 5
                }}
                onPress={() => {
                    setModalContent(
                        <EditSocialNetworks 
                        onClose={() => {
                            modalRef?.current?.hide();
                            setModalContent(null);
                        }} 
                        navigation={navigation} 
                        />
                    );
                    modalRef?.current?.show();
                }}
                />
            </ScrollView>
        </View>
    );

    const statisticsRender = () => (
        <View>
            <View
            style={{
                borderWidth: 1,
                borderColor: theme.divider_color,
                margin: 10,
                borderRadius: 6,
                paddingRight: 9,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme.divider_color + "30",
                overflow: "hidden"
            }}
            >
                <View 
                style={{
                    paddingVertical: 5,
                    paddingHorizontal: 9,
                }}
                >
                    <View
                    style={{
                        marginBottom: 3
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="eye"
                            type="MaterialCommunityIcons"
                            color={statisticsChartColors[0]}
                            style={{
                                marginRight: 5
                            }}
                            size={15}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                Смотрю <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[0]}</Text>
                            </Text>
                        </View>
                    </View> 

                    <View
                    style={{
                        marginBottom: 3
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="check"
                            type="FontAwesome"
                            color={statisticsChartColors[1]}
                            style={{
                                marginRight: 5
                            }}
                            size={14}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                Просмотрено <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[1]}</Text>
                            </Text>
                        </View>
                    </View> 

                    <View
                    style={{
                        marginBottom: 3
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="eye-refresh"
                            type="MaterialCommunityIcons"
                            color={statisticsChartColors[2]}
                            style={{
                                marginRight: 5
                            }}
                            size={15}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                Пересматриваю <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[2]}</Text>
                            </Text>
                        </View>
                    </View> 

                    <View
                    style={{
                        marginBottom: 3
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="calendar"
                            type="MaterialCommunityIcons"
                            color={statisticsChartColors[3]}
                            style={{
                                marginRight: 5
                            }}
                            size={15}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                В планах <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[3]}</Text>
                            </Text>
                        </View>
                    </View> 

                    <View
                    style={{
                        marginBottom: 3
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="pause-circle-outline"
                            type="MaterialIcons"
                            color={statisticsChartColors[4]}
                            style={{
                                marginRight: 5
                            }}
                            size={15}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                Отложено <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[4]}</Text>
                            </Text>
                        </View>
                    </View> 

                    <View>
                        <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="cancel"
                            type="MaterialIcons"
                            color={statisticsChartColors[5]}
                            style={{
                                marginRight: 5
                            }}
                            size={15}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                fontSize: 12
                            }}
                            >
                                Брошено: <Text style={{fontWeight: "700", color: theme.text_color}}>{statisticsChartValues[5]}</Text>
                            </Text>
                        </View>
                    </View> 
                </View>

                {
                    statisticsChartValues.reduce((a, b) => a + b) === 0 ? (
                        <Icon
                        type="FontAwesome"
                        name="pie-chart"
                        color={theme.divider_color}
                        size={100}
                        />
                    ) : (
                        <PieChart 
                        data={statisticsChartData}
                        innerRadius={22}
                        style={{ height: 117, width: 110 }}
                        />
                    )
                }
            </View>

            <Divider indents />
        </View>
    );

    const friendsRender = () => (
        <View
        style={{
            marginVertical: 15
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
                    Друзья <Text style={{color: theme.text_secondary_color}}>{userData?.friend_requests?.length}</Text>
                </Text>
            }
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: userData?.friend_requests?.length >= 1 ? theme.accent : theme.divider_color,
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
                        {userData?.friend_requests?.length || 0} {declOfNum(userData?.friend_requests?.length, ["заявка","заявки","заявок"])}
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

    const ratedRender = () => (
        <View>
            <Cell
            title="Оценённые"
            before={
                <Icon
                type="AntDesign"
                name="star"
                color="gold"
                />
            }
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
                >
                    <Text
                    style={{
                        color: theme.text_secondary_color,
                        fontSize: 13
                    }}
                    >
                        Все
                    </Text>

                    <Icon
                    name="chevron-small-right"
                    type="Entypo"
                    color={theme.text_secondary_color}
                    size={20}
                    />
                </View>
            }
            />

            {/* {
                userData?.rated.length === 0 ? (
                    <Placeholder
                    title="Пусто"
                    subtitle="Вы ещё не оценили ни одного аниме"
                    />
                ) : userData?.rated.map(lastGradeReleasesRender)
            } */}

            <Divider dividerStyle={{marginTop: 15}} indents/>
        </View>
    );

    const lastWatchedRender = () => (
        <View>
            <Cell
            title="Последние просмотры"
            before={
                <Icon
                type="Ionicons"
                name="time-outline"
                color={theme.accent}
                size={15}
                />
            }
            after={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
                >
                    <Text
                    style={{
                        color: theme.text_secondary_color,
                        fontSize: 12
                    }}
                    >
                        Все
                    </Text>

                    <Icon
                    name="chevron-small-right"
                    type="Entypo"
                    color={theme.text_secondary_color}
                    size={20}
                    />
                </View>
            }
            />
            
            {/* {
                userData?.all_watched.length === 0 ? (
                    <Placeholder
                    title="Пусто"
                    subtitle="Вы ещё не посмотрели ни одного аниме"
                    />
                ) : userData?.all_watched.map(recentlyViewsRender)
            } */}
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

            <BottomModal
            ref={modalRef}
            >
                {modalContent}
            </BottomModal>

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
                {ratedRender()}                
                {lastWatchedRender()}
            </ScrollView>
        </GestureHandlerRootView>
    )
};