import React, { useContext, useState, useEffect, useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableNativeFeedback, Vibration } from "react-native";
import { useRoute } from "@react-navigation/native";

import {
    Lists,
    Home,
    Notices,
    Search,
    Profile
} from "../screens";
import { Avatar, Icon } from "../components";
import { normalizeSize, storage } from "../functions";

import ThemeContext from "../config/ThemeContext";
import UserContext from "../config/UserContext";

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    const theme = useContext(ThemeContext);

    const route = useRoute();

    const [ cachedUserData, setCachedUserData ] = useState({});

    const getCachedUserData = async () => {
        const data = await storage.getItem("cachedUserData");
        if(!data) return;

        setCachedUserData(data);
    };

    useEffect(() => {
        getCachedUserData();
    }, []);

    const CustomTabButton = (props) => {
        const isFocused = props.accessibilityState.selected;
        const routeName = props.to.split("/")[props.to.split("/").length - 1].split("?")[0];

        const routeNameDecode = {
            "profile": "Профиль",
            "notices": "Уведомления",
            "lists": "Списки",
            "search": "Поиск",
            "home": "Главная",
        }[routeName];

        const iconName = {
            "notices": "notifications",
            "lists": "text-bullet-list",
            "search": "search",
            "home": "home",
        }[routeName];

        return (
            <TouchableNativeFeedback 
            onPress={() => {
                Vibration.vibrate(20);
                props.onPress();
            }}
            delayPressIn={0}
            background={TouchableNativeFeedback.Ripple(theme.divider_color, true)}
            disabled={isFocused}
            >
                <View  
                style={{
                    alignItems: "center",
                    justifyContent: isFocused ? "space-evenly" : "center",
                    borderRadius: 12,
                    paddingVertical: 7,
                    backgroundColor: isFocused ? theme.bottom_tabbar.active_tab_background : "transparent",
                    flex: 1,
                    marginVertical: 5,
                    marginLeft: routeName === "home" && isFocused ? 5 : 0,
                    marginRight: routeName === "profile" && isFocused ? 5 : 0
                }}
                >
                    {
                        routeName === "profile" ? (
                            <Avatar
                            url={cachedUserData?.photo}
                            size={isFocused ? 25 : 30}
                            />
                        ) : (
                            <Icon
                            name={iconName}
                            size={isFocused ? 17 : 20}
                            color={isFocused ? theme.bottom_tabbar.active_icon_color : "gray"}
                            />
                        )
                    }

                    {
                        isFocused && (
                            <Text
                            numberOfLines={1}
                            style={{
                                marginHorizontal: 5,
                                color: theme.bottom_tabbar.active_icon_color,
                                fontWeight: "500",
                                fontSize: 12
                            }}
                            >
                                {
                                    routeNameDecode
                                }
                            </Text> 
                        )
                    }
                    
                </View>
            </TouchableNativeFeedback>
        )
    };

    const navigatorOptions = useMemo(() => {
        return {
            headerShown: false,
            tabBarButton: (props) => <CustomTabButton {...props} />,
            tabBarStyle: {
                backgroundColor: theme.bottom_tabbar.background, 
                height: 65, 
                shadowColor: "transparent",
                borderTopWidth: 0 
            },
            tabBarHideOnKeyboard: true
        }
    }, [theme]); 

    return (
        <Tab.Navigator
        screenOptions={navigatorOptions}
        initialRouteName="profile"
        >
            <Tab.Screen
            name="home"
            >
                {
                    props => <Home {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="search"
            >
                {
                    props => <Search {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="lists"
            >
                {
                    props => <Lists {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="notices"
            >
                {
                    props => <Notices {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="profile"
            initialParams={{
                userData: route.params?.userData
            }}
            >
                {
                    props => <Profile {...props} cachedUserData={cachedUserData} />
                }
            </Tab.Screen>
        </Tab.Navigator>
    )
}