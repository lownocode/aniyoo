import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableNativeFeedback, Dimensions, StatusBar } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useRoute } from "@react-navigation/native";

import {
    Lists,
    Home,
    Notices,
    Search,
    Profile
} from "../screens";
import { Avatar, Icon } from "../components";
import ThemeContext from "../config/ThemeContext";
import UserContext from "../config/UserContext";
import { normalizeSize } from "../functions";

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    const theme = useContext(ThemeContext);
    const user = useContext(UserContext);

    const route = useRoute();

    const [ hideTabs, setHideTabs ] = useState(false);

    useEffect(() => {
        const eventListener = EventRegister.addEventListener("changeTabbar", data => {
            if(data.type === "hide") {
                return setHideTabs(true);
            }

            else if(data.type === "show") {
                return setHideTabs(false);
            }
        });

        return () => {
            EventRegister.removeEventListener(eventListener);
        };
    }, []);

    const CustomTabButton = (props) => {
        const isFocused = props.accessibilityState.selected;
        const routeName = props.to.split("/tabs")[1].split("/")[1].split("?")[0];

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
            onPress={() => props.onPress()}
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
                            url={user?.photo}
                            size={isFocused ? 20 : 25}
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
                                fontSize: normalizeSize(10)
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

    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarButton: (props) => <CustomTabButton {...props} />,
            tabBarStyle: {
                backgroundColor: theme.bottom_tabbar.background, 
                height: normalizeSize(50), 
                shadowColor: "transparent",
                borderTopWidth: 0 
            },
            tabBarHideOnKeyboard: true
        }}
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
                    props => <Profile {...props} />
                }
            </Tab.Screen>
        </Tab.Navigator>
    )
}