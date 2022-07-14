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
import { Icon } from "../components";
import ThemeContext from "../config/ThemeContext";

const Tab = createBottomTabNavigator();

const bottomNavigationHeight = Dimensions.get("screen").height - Dimensions.get("window").height - StatusBar.currentHeight;

export const Tabs = (props) => {
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

        return (
            <View 
            style={{
                backgroundColor: theme.bottom_tabbar.background, 
                height: 60, 
                shadowColor: "transparent",
                flexDirection: "row", 
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.bottom_tabbar.border_color,
                position: "absolute",
                bottom: bottomNavigationHeight,
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
                                    height: 59
                                }}
                                >
                                    <Icon
                                    name={isFocused ? options.iconFocus.name : options.iconUnfocus.name}
                                    type={isFocused ? options.iconFocus.type : options.iconUnfocus.type}
                                    size={isFocused ? options.iconFocus.size - 5 : options.iconUnfocus.size}
                                    color={isFocused ? theme.bottom_tabbar.active_icon_color : "gray"}
                                    />

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
                iconFocus: {
                    name: "home",
                    type: "MaterialCommunityIcons",
                    size: 27,
                },
                iconUnfocus: {
                    name: "home-outline",
                    type: "MaterialCommunityIcons",
                    size: 27,
                },
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
                iconFocus: {
                    name: "search",
                    type: "Ionicons",
                    size: 24,
                },
                iconUnfocus: {
                    name: "search",
                    type: "Ionicons",
                    size: 24,
                }
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
                iconFocus: {
                    name: "book-multiple",
                    type: "MaterialCommunityIcons",
                    size: 23,
                },
                iconUnfocus: {
                    name: "book-multiple-outline",
                    type: "MaterialCommunityIcons",
                    size: 23,
                }
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
                iconFocus: {
                    name: "notifications",
                    type: "MaterialIcons",
                    size: 26,
                },
                iconUnfocus: {
                    name: "notifications-none",
                    type: "MaterialIcons",
                    size: 26,
                }
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
                iconFocus: {
                    name: "account-circle",
                    type: "MaterialCommunityIcons",
                    size: 25,
                },
                iconUnfocus: {
                    name: "account-circle-outline",
                    type: "MaterialCommunityIcons",
                    size: 25,
                }
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