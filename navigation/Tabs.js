import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableWithoutFeedback } from "react-native";

import {
    Bookmarks,
    Home,
    Notices,
    Search,
    Profile
} from "../screens";
import { Icon } from "../components";

const Tab = createBottomTabNavigator();

const CustomTab = ({ label, icon, accessibilityState, onPress, style }) => {
    return (
        <View
        style={{
            flexGrow: 1, 
        }}
        >
            <TouchableWithoutFeedback 
            onPress={() => onPress()}
            delayPressIn={0}
            >
                <View  
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 100,
                    paddingVertical: 7,
                    backgroundColor: accessibilityState.selected ? style.bottom_tab_bar_active_tab_background : "transparent",
                }}
                >
                    <Icon
                    name={icon.name}
                    type={icon.type}
                    size={accessibilityState.selected ? icon.size - 7 : icon.size}
                    color={accessibilityState.selected ? style.bottom_tab_active_color : "gray"}
                    style={{
                        marginRight: accessibilityState.selected ? 5 : 0,
                        ...icon.style
                    }}
                    />
                    {
                        accessibilityState.selected && (
                            <Text
                            style={{
                                color: accessibilityState.selected ? style.bottom_tab_active_color : "gray"
                            }}
                            >
                                {label}
                            </Text>
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
};

export const Tabs = ({ style }) => {
    return (
        <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: style.bottom_tab_background_color, 
                paddingTop: 10,
                height: 60, 
                shadowColor: "transparent",
                flexDirection: "row", 
                alignItems: "flex-start",
                borderTopWidth: style.bottom_tab_border_width,
                borderColor: style.divider_color
            },
            tabBarAllowFontScaling: true,
            headerShown: false,
            tabBarHideOnKeyboard: true
        }}
        >
            <Tab.Screen
            name="home"
            options={{
                tabBarButton: (props) => (
                    <CustomTab 
                    label="Главная" 
                    {...props}
                    style={style}
                    icon={{
                        name: props.accessibilityState.selected ? "home" : "home-outline",
                        type: "MaterialCommunityIcons",
                        size: 27,
                        style: {
                            marginTop: props.accessibilityState.selected ? 0 : -2
                        }
                    }}
                    />
                ),
            }}
            >
                {
                    props => <Home {...props} style={style}/>
                }
            </Tab.Screen>

            <Tab.Screen
            name="search"
            options={{
                tabBarButton: (props) => (
                    <CustomTab 
                    label="Поиск" 
                    {...props}
                    style={style}
                    icon={{
                        name: props.accessibilityState.selected ? "search" : "search",
                        type: "Ionicons",
                        size: 23.5,
                        style: {
                            marginTop: props.accessibilityState.selected ? 0 : -1.5
                        }
                    }}
                    />
                ),
            }}
            >
                {
                    props => <Search {...props} style={style}/>
                }
            </Tab.Screen>

            <Tab.Screen
            name="bookmarks"
            options={{
                tabBarButton: (props) => (
                    <CustomTab 
                    label="Закладки" 
                    {...props}
                    style={style}
                    icon={{
                        name: props.accessibilityState.selected ? "bookmark-multiple" : "bookmark-multiple-outline",
                        type: "MaterialCommunityIcons",
                        size: 22.4,
                        style: {
                            marginTop: props.accessibilityState.selected ? 0 : -0.7
                        }
                    }}
                    />
                ),
            }}
            >
                {
                    props => <Bookmarks {...props} style={style}/>
                }
            </Tab.Screen>

            <Tab.Screen
            name="notices"
            options={{
                tabBarButton: (props) => (
                    <CustomTab 
                    label="Уведомления" 
                    {...props}
                    style={style}
                    icon={{
                        name: props.accessibilityState.selected ? "notifications" : "notifications-none",
                        type: "MaterialIcons",
                        size: 26,
                        style: {
                            marginTop: props.accessibilityState.selected ? 0 : -2
                        }
                    }}
                    />
                ),
            }}
            >
                {
                    props => <Notices {...props} style={style}/>
                }
            </Tab.Screen>

            <Tab.Screen
            name="profile"
            options={{
                tabBarButton: (props) => (
                    <CustomTab 
                    label="Профиль"
                    {...props}
                    style={style}
                    icon={{
                        name: props.accessibilityState.selected ? "account-circle" : "account-circle-outline",
                        type: "MaterialCommunityIcons",
                        size: 25,
                        style: {
                            marginTop: props.accessibilityState.selected ? 0 : -1.4
                        }
                    }}
                    />
                ),
            }}
            >
                {
                    props => <Profile {...props} style={style}/>
                }
            </Tab.Screen>
        </Tab.Navigator>
    )
}