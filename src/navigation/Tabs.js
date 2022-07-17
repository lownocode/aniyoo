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

    const MyTabBar = ({ state, descriptors, navigation }) => {
        const theme = useContext(ThemeContext);
        const user = useContext(UserContext);

        return (
            <View 
            style={{
                backgroundColor: theme.bottom_tabbar.background, 
                height: normalizeSize(50), 
                shadowColor: "transparent",
                flexDirection: "row", 
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.bottom_tabbar.border_color,
                position: "absolute",
                bottom: 10,
                right: 13,
                left: 13,
                borderRadius: 12,
            }}
            >
                {
                    state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                
                        const isFocused = state.index === index;
                
                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate({ name: route.name, merge: true });
                            }
                        };

                        return (
                            <TouchableNativeFeedback 
                            key={"tab-" + index}
                            onPress={() => onPress()}
                            delayPressIn={0}
                            background={TouchableNativeFeedback.Ripple(theme.divider_color, true)}
                            >
                                <View  
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 12,
                                    paddingVertical: 7,
                                    backgroundColor: isFocused ? theme.bottom_tabbar.active_tab_background : "transparent",
                                    flex: 1,
                                    height: "100%"
                                }}
                                >
                                    {
                                        route.name === "profile" ? (
                                            <Avatar
                                            url={user?.photo}
                                            containerStyle={{
                                                borderWidth: 0,
                                                borderRadius: 100,
                                            }}
                                            size={isFocused ? 20 : 25}
                                            />
                                        ) : (
                                            <Icon
                                            name={options.icon}
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
                                                    options.label
                                                }
                                            </Text> 
                                        )
                                    }
                                    
                                </View>
                            </TouchableNativeFeedback>
                        )
                    })
                }
            </View>
        )
    };

    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
        }}
        tabBar={props => hideTabs ? null : <MyTabBar {...props} />}
        initialRouteName="profile"
        >
            <Tab.Screen
            name="home"
            options={{
                label: "Главная",
                icon: "home",
            }}
            >
                {
                    props => <Home {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="search"
            options={{
                label: "Поиск",
                icon: "search",
            }}
            >
                {
                    props => <Search {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="lists"
            options={{
                label: "Списки",
                icon:"text-bullet-list",
            }}
            >
                {
                    props => <Lists {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="notices"
            options={{
                label: "Уведомления",
                icon: "notifications",
            }}
            >
                {
                    props => <Notices {...props} />
                }
            </Tab.Screen>

            <Tab.Screen
            name="profile"
            options={{
                label: "Профиль",
            }}
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