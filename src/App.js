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
    UserFriends
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

        changeNavigationBarColor(darkMode ? theme.DARK.background_content : theme.LIGHT.background_content, !darkMode, true);
        setDarkThemeMode(darkMode);
    }; 

    useEffect(() => {
        const eventListener = EventRegister.addEventListener("changeTheme", mode => {
            storage.setItem("DARK_THEME_MODE", mode);

            setDarkThemeMode(mode);
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

        await axios.post("/users.signIn", {
          // notifySign: notifySign
        }, {
            headers: {
              "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setUserData(data);
        })
        .catch(async () => {
            navigation.navigate("authorization");
            storage.setItem("AUTHORIZATION_SIGN", null);
            await sleep(1);
        });

        handleDeeplink().finally(async () => {
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
                      // options={{ orientation: "portrait" }}
                      initialParams={{
                        userData: UserData
                      }}
                      />

                      <Stack.Screen 
                      name="settings" 
                      options={{ animation: "slide_from_left", }}
                      component={Settings}
                      />

                      <Stack.Screen 
                      name="authorization"
                      component={Authorization}
                      />

                      <Stack.Screen 
                      name="edit_profile" 
                      options={{ animation: "slide_from_left" }}
                      component={EditProfile}
                      />

                      <Stack.Screen 
                      name="edit_profile.profile" 
                      options={{ animation: "slide_from_left" }}
                      component={EditProfileProfile}
                      />

                      <Stack.Screen 
                      name="edit_profile.privacy" 
                      options={{ animation: "slide_from_left" }}
                      component={EditProfilePrivacy}
                      />

                      <Stack.Screen 
                      name="edit_profile.security" 
                      options={{ animation: "slide_from_left" }}
                      component={EditProfileSecurity}
                      />

                      <Stack.Screen 
                      name="edit_profile.change_nickname" 
                      options={{ animation: "slide_from_left" }}
                      component={EditProfileChangeNickname}
                      />

                      <Stack.Screen 
                      name="settings.application" 
                      options={{ animation: "slide_from_left" }}
                      component={SettingsApplication}
                      />

                      <Stack.Screen 
                      name="settings.another" 
                      options={{ animation: "slide_from_left" }}
                      component={SettingsAnother}
                      />

                      <Stack.Screen 
                      name="edit_social_networks" 
                      options={{ animation: "slide_from_left" }}
                      component={EditSocialNetworks}
                      />

                      <Stack.Screen 
                      name="anime" 
                      options={{ animation: "slide_from_left" }}
                      component={Anime}
                      />

                      <Stack.Screen 
                      name="linked_anime" 
                      options={{ animation: "slide_from_left" }}
                      component={LinkedAnime}
                      />

                      <Stack.Screen 
                      name="anime.reply_comments" 
                      options={{ animation: "slide_from_left" }}
                      component={AnimeReplyComments}
                      />

                      <Stack.Screen 
                      name="anime.all_comments" 
                      options={{ animation: "slide_from_left" }}
                      component={AnimeAllComments}
                      />

                      <Stack.Screen 
                      name="anime.select_translation" 
                      options={{ animation: "slide_from_left" }}
                      component={AnimeSelectTranslation}
                      />

                      <Stack.Screen 
                      name="anime.select_episode" 
                      options={{ animation: "slide_from_left" }}
                      component={AnimeSelectEpisode}
                      />

                      <Stack.Screen 
                      name="anime.videoplayer" 
                      options={{ animation: "none" }}
                      component={AnimeVideoPlayer}
                      />

                      <Stack.Screen 
                      name="user_profile" 
                      options={{ animation: "slide_from_left" }}
                      component={AnotherUserProfile}
                      />

                      <Stack.Screen 
                      name="search_anime" 
                      options={{ animation: "slide_from_left" }}
                      component={SearchAnime}
                      />

                      <Stack.Screen 
                      name="search_users" 
                      options={{ animation: "slide_from_left" }}
                      component={SearchUsers}
                      />

                      <Stack.Screen 
                      name="authorization.registration_confirmation" 
                      options={{ animation: "slide_from_right" }}
                      component={AuthorizationRegistrationConfirmation}
                      />

                      <Stack.Screen 
                      name="user.friends" 
                      options={{ animation: "slide_from_left" }}
                      component={UserFriends}
                      />
                    </Stack.Navigator>
                </NavigationContainer>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
};