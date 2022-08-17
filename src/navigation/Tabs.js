import React, { useState, useRef, useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Vibration, Text, Animated, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
    Lists,
    Home,
    Notices,
    Search,
    Profile,
} from "../screens";
import {
    Anime,
    AnimeAllComments,
    AnimePlaylists,
    AnimeReplyComments,
    AnimeSelectEpisode,
    AnimeSelectTranslation,
    AnimeVideoPlayer,
    AnotherUserProfile,
    EditProfile,
    EditProfileChangeNickname,
    EditProfilePrivacy,
    EditProfileProfile,
    EditProfileSecurity,
    EditSocialNetworks,
    GeneralUserBrowsingHistory,
    GeneralUserComments,
    LinkedAnime,
    SearchAnime, 
    SearchUsers, 
    Settings, 
    SettingsAnother, 
    SettingsApplication, 
    UserFriends
} from "../panels";

import { Avatar, Icon } from "../components";

const Tab = createBottomTabNavigator();

const HomeStackNavigator = createNativeStackNavigator();
const SearchStackNavigator = createNativeStackNavigator();
const ListsStackNavigator = createNativeStackNavigator();
const NoticesStackNavigator = createNativeStackNavigator();
const ProfileStackNavigator = createNativeStackNavigator();

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const TAB_OFFSET = 7;
const TABS_COUNT = 5;
const TAB_WIDTH = WINDOW_WIDTH / TABS_COUNT;
const ROUTES_NO_TABBAR = [
    "anime.videoplayer",
];

export default Tabs = () => {
    const { user } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);

    const [ tabBarHidden, setTabBarHidden ] = useState(false);

    const indicatorPosition = useRef(new Animated.Value(0)).current;
    const tabBarHeight = useRef(new Animated.Value(65)).current;

    const changeTabBarVisibility = (hide) => {
        setTabBarHidden(hide);

        return Animated.timing(tabBarHeight, {
            toValue: hide ? 0 : 65,
            duration: 300,
            useNativeDriver: false
        }).start();
    };

    const CustomTabbar = (props) => {
        const {
            state,
            navigation,
        } = props;

        const onPress = (isFocused, route) => {
            const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });
    
            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true });
            }
        };

        const renderButtons = (route, index) => {
            const isFocused = state.index === index;

            return (
                <CustomTabButton
                key={route.key}
                routeName={route.name}
                isFocused={isFocused}
                onPress={() => onPress(isFocused, route, index)}
                />
            )
        };

        return (
            <Animated.View
            style={{
                backgroundColor: theme.bottom_tabbar.background,
                height: tabBarHeight,
                flexDirection: "row",
                alignItems: "center",
            }}
            >
                {
                    !tabBarHidden && (
                        <>
                            <Animated.View
                            style={{
                                backgroundColor: theme.bottom_tabbar.active_tab_background,
                                borderRadius: 10,
                                position: "absolute",
                                width: TAB_WIDTH,
                                height: 50,
                                left: indicatorPosition,
                            }}
                            />

                            {
                                state.routes.map(renderButtons)
                            }
                        </>
                    )
                }
            </Animated.View>
        )
    };

    const CustomTabButton = (props) => {
        const {
            isFocused,
            routeName
        } = props;

        const routeNameDecode = {
            "profile-stack": "Профиль",
            "notices-stack": "Уведомления",
            "lists-stack": "Списки",
            "search-stack": "Поиск",
            "home-stack": "Главная",
        }[routeName];

        const iconName = {
            "notices-stack": "notifications",
            "lists-stack": "text-bullet-list",
            "search-stack": "search",
            "home-stack": "home",
        }[routeName];

        return (
            <TouchableWithoutFeedback 
            onPressIn={() => props.onPress()}
            disabled={isFocused}
            >
                <View  
                style={{
                    alignItems: "center",
                    flex: 1,
                    marginRight: isFocused && routeName === "profile-stack" ? TAB_OFFSET : 0,
                    marginLeft: isFocused && routeName === "home-stack" ? TAB_OFFSET : 0,
                    height: 50,
                    justifyContent: isFocused ? "space-evenly" : "center",
                    borderRadius: 12,
                }}
                >
                    {
                        routeName === "profile-stack" ? (
                            <Avatar
                            url={user?.photo}
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
            </TouchableWithoutFeedback>
        )
    };

    const transitionEndListener = (e) => {
        const route = e.target.split("-")[0];
        
        if(!e.data.closing && ROUTES_NO_TABBAR.findIndex(x => x === route) > -1) {
            if(tabBarHidden) return;

            return changeTabBarVisibility(true)
        }

        if(tabBarHidden) {
            return changeTabBarVisibility(false);
        }
    };

    const tabbarOptions = useMemo(() => {
        return {
            headerShown: false,
            tabBarHideOnKeyboard: true
        }
    });

    const HomeStack = React.memo(() => (
        <HomeStackNavigator.Navigator
        initialRouteName="home"
        screenOptions={{ headerShown: false, animation: "none" }}
        screenListeners={{
            transitionEnd: transitionEndListener
        }}
        >
            <HomeStackNavigator.Screen
            name="home"
            component={Home}
            />
        </HomeStackNavigator.Navigator>
    ));

    const SearchStack = React.memo(() => (
        <SearchStackNavigator.Navigator
        initialRouteName="search"
        screenOptions={{ headerShown: false, animation: "none" }}
        screenListeners={{
            transitionEnd: transitionEndListener
        }}
        >
            <SearchStackNavigator.Screen
            name="search"
            component={Search}
            />

            <SearchStackNavigator.Screen
            name="search_anime"
            component={SearchAnime}
            />

            <SearchStackNavigator.Screen
            name="search_users"
            component={SearchUsers}
            />

            <SearchStackNavigator.Screen
            name="anime"
            component={Anime}
            />

            <SearchStackNavigator.Screen 
            name="linked_anime" 
            component={LinkedAnime}
            />

            <SearchStackNavigator.Screen 
            name="anime.reply_comments" 
            component={AnimeReplyComments}
            />

            <SearchStackNavigator.Screen 
            name="anime.all_comments" 
            component={AnimeAllComments}
            />

            <SearchStackNavigator.Screen 
            name="anime.select_translation" 
            component={AnimeSelectTranslation}
            />

            <SearchStackNavigator.Screen 
            name="anime.select_episode" 
            component={AnimeSelectEpisode}
            />

            <SearchStackNavigator.Screen 
            name="anime.videoplayer" 
            component={AnimeVideoPlayer}
            />

            <SearchStackNavigator.Screen 
            name="anime.playlists" 
            component={AnimePlaylists}
            />
        </SearchStackNavigator.Navigator>
    ));

    const ListsStack = React.memo(() => (
        <ListsStackNavigator.Navigator
        initialRouteName="lists"
        screenOptions={{ headerShown: false, animation: "none" }}
        screenListeners={{
            transitionEnd: transitionEndListener
        }}
        >
            <ListsStackNavigator.Screen
            name="lists"
            component={Lists}
            />
        </ListsStackNavigator.Navigator>
    ));

    const NoticesStack = React.memo(() => (
        <NoticesStackNavigator.Navigator
        initialRouteName="notices"
        screenOptions={{ headerShown: false, animation: "none" }}
        screenListeners={{
            transitionEnd: transitionEndListener
        }}
        >
            <NoticesStackNavigator.Screen
            name="notices"
            component={Notices}
            />
        </NoticesStackNavigator.Navigator>
    ));

    const ProfileStack = React.memo(() => (
        <ProfileStackNavigator.Navigator
        initialRouteName="profile"
        screenOptions={{ headerShown: false, animation: "none" }}
        screenListeners={{
            transitionEnd: transitionEndListener
        }}
        >
            <ProfileStackNavigator.Screen
            name="profile"
            component={Profile}
            />

            <ProfileStackNavigator.Screen
            name="edit_profile"
            component={EditProfile}
            />

            <ProfileStackNavigator.Screen
            name="edit_profile.profile"
            component={EditProfileProfile}
            />

            <ProfileStackNavigator.Screen
            name="edit_profile.privacy"
            component={EditProfilePrivacy}
            />

            <ProfileStackNavigator.Screen
            name="edit_profile.security"
            component={EditProfileSecurity}
            />

            <ProfileStackNavigator.Screen
            name="edit_profile.change_nickname"
            component={EditProfileChangeNickname}
            />

            <ProfileStackNavigator.Screen
            name="settings"
            component={Settings}
            />

            <ProfileStackNavigator.Screen
            name="settings.another"
            component={SettingsAnother}
            />

            <ProfileStackNavigator.Screen
            name="settings.application"
            component={SettingsApplication}
            />

            <ProfileStackNavigator.Screen
            name="edit_social_networks"
            component={EditSocialNetworks}
            />

            <ProfileStackNavigator.Screen
            name="anime"
            component={Anime}
            />

            <ProfileStackNavigator.Screen 
            name="linked_anime" 
            component={LinkedAnime}
            />

            <ProfileStackNavigator.Screen 
            name="anime.reply_comments" 
            component={AnimeReplyComments}
            />

            <ProfileStackNavigator.Screen 
            name="anime.all_comments" 
            component={AnimeAllComments}
            />

            <ProfileStackNavigator.Screen 
            name="anime.select_translation" 
            component={AnimeSelectTranslation}
            />

            <ProfileStackNavigator.Screen 
            name="anime.select_episode" 
            component={AnimeSelectEpisode}
            />

            <ProfileStackNavigator.Screen 
            name="anime.videoplayer" 
            options={{
                tabBarVisible: false
            }}
            component={AnimeVideoPlayer}
            />

            <ProfileStackNavigator.Screen 
            name="anime.playlists" 
            component={AnimePlaylists}
            />

            <ProfileStackNavigator.Screen 
            name="user_profile" 
            component={AnotherUserProfile}
            />

            <ProfileStackNavigator.Screen 
            name="user.friends" 
            component={UserFriends}
            />

            <ProfileStackNavigator.Screen 
            name="general_user.browsing_history"
            component={GeneralUserBrowsingHistory}
            />

            <ProfileStackNavigator.Screen 
            name="general_user.comments" 
            component={GeneralUserComments}
            />
        </ProfileStackNavigator.Navigator>
    ));

    return (
        <Tab.Navigator
        initialRouteName="profile-stack"
        screenOptions={tabbarOptions}
        tabBar={props => <CustomTabbar {...props} />}
        screenListeners={{
            focus: event => {
                const stackIndex = {
                    "home": 1,
                    "search": 2,
                    "lists": 3,
                    "notices": 4,
                    "profile": 5
                }[event.target.split("-stack")[0]];

                Vibration.vibrate(30);

                const toValue = stackIndex === 1 
                ? TAB_OFFSET : stackIndex === TABS_COUNT 
                ? ((TAB_WIDTH * stackIndex) - TAB_WIDTH) - TAB_OFFSET : (TAB_WIDTH * stackIndex) - TAB_WIDTH;

                Animated.timing(indicatorPosition, {
                    toValue: toValue,
                    duration: 300,
                    useNativeDriver: false
                }).start();
            }
        }}
        >
            <Tab.Screen
            name="home-stack"
            component={HomeStack}
            />

            <Tab.Screen
            name="search-stack"
            component={SearchStack}
            />

            <Tab.Screen
            name="lists-stack"
            component={ListsStack}
            />

            <Tab.Screen
            name="notices-stack"
            component={NoticesStack}
            />

            <Tab.Screen
            name="profile-stack"
            component={ProfileStack}
            />
        </Tab.Navigator>
    );
}