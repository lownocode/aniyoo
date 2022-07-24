import React, { useEffect, useState } from 'react';
import { CommonActions, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Linking } from 'react-native';
import Orientation from 'react-native-orientation';
import changeNavigationBarColor from "react-native-navigation-bar-color";
import SplashScreen from 'react-native-splash-screen';

// import FBMessaging from "@react-native-firebase/messaging";
// import Firebase from "@react-native-firebase/app";

// if (!Firebase.apps.length) {
//   Firebase.initializeApp({
//     appId: "1:746738249066:android:5efc0116808568abf20913",
//     apiKey: "AIzaSyCzQhtAUcazg3-Ol01BwtpUOc9INxPCTZE",
//     projectId: "aniyoo",
//     storageBucket: "aniyoo.appspot.com",
//     databaseURL: "https://aniyoo-default-rtdb.europe-west1.firebasedatabase.app/",
//     messagingSenderId: "746738249066",
//   });
// }

import {
    Settings,
    Authorization,
    AuthorizationRegistrationConfirmation,
    EditProfile,
    EditProfileProfile,
    EditProfilePrivacy,
    EditProfileSecurity,
    EditProfileChangeNickname,
    SettingsAnother,
    SettingsApplication,
    EditSocialNetworks,
    Anime,
    LinkedAnime,
    AnimeReplyComments,
    AnimeAllComments,
    AnimeSelectTranslation,
    AnimeSelectEpisode,
    AnimeVideoPlayer,
    AnotherUserProfile,
    SearchAnime,
    SearchUsers,
    UserFriends,
    AnimePlaylists
} from "./panels";
import { Tabs } from './navigation/Tabs';

import { sleep, storage } from './functions';
import axios from 'axios';
import { EventRegister } from 'react-native-event-listeners';

import theme from "./config/theme";
import ThemeContext from "./config/ThemeContext";
import UserContext from "./config/UserContext";

const Stack = createNativeStackNavigator();
Orientation.lockToPortrait();

export default App = () => {
    const [ darkThemeMode, setDarkThemeMode ] = useState(false);
    const [ UserData, setUserData ] = useState({});

    const navigation = useNavigationContainerRef();

    const getTheme = async () => {
        const darkMode = await storage.getItem("DARK_THEME_MODE");
        if(darkMode === null) {
            await storage.setItem("DARK_THEME_MODE", true);
            return setDarkThemeMode(true);
        }

        changeNavigationBarColor(darkMode ? theme.DARK.bottom_tabbar.background : theme.LIGHT.bottom_tabbar.background, !darkMode, true);
        setDarkThemeMode(darkMode);
    }; 

    useEffect(() => {
        axios.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if(error.response.data.code === "INVALID_SIGN") {
                storage.setItem("AITHORIZATION_SIGN", null);
                navigation.navigate("authorization");
            }
        
            return Promise.reject(error);
        });
    }, []);

    useEffect(() => {
        const eventListener = EventRegister.addEventListener("app", (data) => {
            if(data.type === "changeTheme") {
                storage.setItem("DARK_THEME_MODE", data.value);

                changeNavigationBarColor(data.value ? theme.DARK.bottom_tabbar.background : theme.LIGHT.bottom_tabbar.background, !data.value, true);
                setDarkThemeMode(data.value);
                return;
            }

            if(data.type === "changeUser") {
                setUserData(data.user)
                return;
            }
        });

        return () => {
            EventRegister.removeEventListener(eventListener);
        };
    }, []);

    const handleDeeplink = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        if(!sign) return;

        const getUrlVars = (url) => {
            if(!url) return;

            let hash;
            let myJson = {};
            let hashes = url.slice(url.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                myJson[hash[0]] = hash[1];
            }
            return myJson;
        }

        const url = await Linking.getInitialURL();
        const params = getUrlVars(url);

        if(/\/anime/i.test(url)) {
            if(!params.id) return;

            navigation.dispatch(
              CommonActions.navigate({
                name: "anime",
                params: {
                  animeData: {
                    id: params.id
                  }
                }
              })
            );
        }

        return Linking.addEventListener("url", ({ url }) => {
            const params = getUrlVars(url);
            
            if(/\/anime/i.test(url)) {
                if(!params.id) return;
                
                navigation.dispatch(
                  CommonActions.navigate({
                    name: "anime",
                    params: {
                      animeData: {
                        id: params.id
                      }
                    },
                  })
                );
            }
        });
    }; 

    useEffect(() => {
        getTheme();
    }, []);

    const readyHandler = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        handleDeeplink().finally(() => {
            if(!sign) {
                navigation.navigate("authorization");
            }   
            
            SplashScreen.hide();
        });
    };

    return (
        <ThemeContext.Provider value={darkThemeMode ? theme.DARK : theme.LIGHT}>
            <UserContext.Provider value={UserData}>
                <NavigationContainer 
                onReady={() => readyHandler()}
                ref={navigation}
                >
                    <StatusBar
                    backgroundColor="transparent"
                    translucent
                    />

                    <Stack.Navigator 
                    screenOptions={{ headerShown: false }}
                    >
                      <Stack.Screen 
                      name="tabs" 
                      component={Tabs}
                      initialParams={{
                        userData: UserData
                      }}
                      />

                      <Stack.Screen 
                      name="settings" 
                      options={{ animation: "none", }}
                      component={Settings}
                      />

                      <Stack.Screen 
                      name="authorization"
                      component={Authorization}
                      />

                      <Stack.Screen 
                      name="edit_profile" 
                      options={{ animation: "none" }}
                      component={EditProfile}
                      />

                      <Stack.Screen 
                      name="edit_profile.profile" 
                      options={{ animation: "none" }}
                      component={EditProfileProfile}
                      />

                      <Stack.Screen 
                      name="edit_profile.privacy" 
                      options={{ animation: "none" }}
                      component={EditProfilePrivacy}
                      />

                      <Stack.Screen 
                      name="edit_profile.security" 
                      options={{ animation: "none" }}
                      component={EditProfileSecurity}
                      />

                      <Stack.Screen 
                      name="edit_profile.change_nickname" 
                      options={{ animation: "none" }}
                      component={EditProfileChangeNickname}
                      />

                      <Stack.Screen 
                      name="settings.application" 
                      options={{ animation: "none" }}
                      component={SettingsApplication}
                      />

                      <Stack.Screen 
                      name="settings.another" 
                      options={{ animation: "none" }}
                      component={SettingsAnother}
                      />

                      <Stack.Screen 
                      name="edit_social_networks" 
                      options={{ animation: "none" }}
                      component={EditSocialNetworks}
                      />

                      <Stack.Screen 
                      name="anime" 
                      options={{ animation: "none" }}
                      component={Anime}
                      />

                      <Stack.Screen 
                      name="linked_anime" 
                      options={{ animation: "none" }}
                      component={LinkedAnime}
                      />

                      <Stack.Screen 
                      name="anime.reply_comments" 
                      options={{ animation: "none" }}
                      component={AnimeReplyComments}
                      />

                      <Stack.Screen 
                      name="anime.all_comments" 
                      options={{ animation: "none" }}
                      component={AnimeAllComments}
                      />

                      <Stack.Screen 
                      name="anime.select_translation" 
                      options={{ animation: "none" }}
                      component={AnimeSelectTranslation}
                      />

                      <Stack.Screen 
                      name="anime.select_episode" 
                      options={{ animation: "none" }}
                      component={AnimeSelectEpisode}
                      />

                      <Stack.Screen 
                      name="anime.videoplayer" 
                      options={{ animation: "none" }}
                      component={AnimeVideoPlayer}
                      />

                      <Stack.Screen 
                      name="user_profile" 
                      options={{ animation: "none" }}
                      component={AnotherUserProfile}
                      />

                      <Stack.Screen 
                      name="search_anime" 
                      options={{ animation: "none" }}
                      component={SearchAnime}
                      />

                      <Stack.Screen 
                      name="search_users" 
                      options={{ animation: "none" }}
                      component={SearchUsers}
                      />

                      <Stack.Screen 
                      name="authorization.registration_confirmation" 
                      options={{ animation: "slide_from_right" }}
                      component={AuthorizationRegistrationConfirmation}
                      />

                      <Stack.Screen 
                      name="user.friends" 
                      options={{ animation: "none" }}
                      component={UserFriends}
                      />

                      <Stack.Screen 
                      name="anime.playlists" 
                      options={{ animation: "none" }}
                      component={AnimePlaylists}
                      />
                    </Stack.Navigator>
                </NavigationContainer>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
};