import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Linking } from 'react-native';
import Orientation from 'react-native-orientation';
import changeNavigationBarColor from "react-native-navigation-bar-color";

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
  EditProfile,
  NetworkError,
  EditProfile_Profile,
  EditProfile_Privacy,
  EditProfile_Security,
  EditProfile_ChangeNickname,
  Settings_Another,
  Settings_Application,
  EditSocialNetworks,
  Anime,
  LinkedAnime,
  Anime_ReplyComments,
  Anime_AllComments,
  SplashScreen,
  Anime_SelectTranslation,
  Anime_SelectEpisode,
  Anime_VideoPlayer
} from "./panels";
import { Tabs } from './navigation/Tabs';

import { storage } from './functions';
import axios from 'axios';
import { EventRegister } from 'react-native-event-listeners';

import theme from "./config/theme";
import ThemeContext from "./config/ThemeContext";
import UserContext from "./config/UserContext";

const Stack = createNativeStackNavigator();
Orientation.lockToPortrait();

export default App = () => {
  const [ darkThemeMode, setDarkThemeMode ] = useState(false);
  const [ initialScreenName, setInitialScreenName ] = useState(null);
  const [ UserData, setUserData ] = useState({});

  const getTheme = async () => {
    const darkMode = await storage.getItem("DARK_THEME_MODE");
    if(darkMode === null) {
      await storage.setItem("DARK_THEME_MODE", true);
      return setDarkThemeMode(true);
    }

    changeNavigationBarColor(darkMode ? theme.DARK.background_content : theme.LIGHT.background_content, false, true);
    setDarkThemeMode(darkMode);
    return darkMode;
  }; 

  const authorization = async () => {
    const sign = await storage.getItem("AUTHORIZATION_SIGN");

    if(!sign) {
      return setInitialScreenName("authorization");
    }

    // await FBMessaging().registerDeviceForRemoteMessages();
    // const notifySign = await FBMessaging().getToken();

    // FBMessaging().setBackgroundMessageHandler(() => {
    //   console.log("new notice")
    // });
    // FBMessaging()
    // .getInitialNotification()
    // .then((data) => {
    //   if(data) {
    //     console.log(data)
    //   }
    // });

    axios.post("/user.signIn", {
      // notifySign: notifySign
    }, {
        headers: {
          "Authorization": sign,
        }
    })
    .then(({ data }) => setUserData(data))
    .catch((error) => {
      if(error.toJSON().message === "Network Error") {
        return setInitialScreenName("network_error");
      }

      storage.setItem("AUTHORIZATION_SIGN", null);
      return setInitialScreenName("authorization");
    });

    handleDeeplink();
    setInitialScreenName("tabs")
  };

  useEffect(() => {
    const eventListener = EventRegister.addEventListener("changeTheme", data => {
      storage.setItem("DARK_THEME_MODE", data);
      setDarkThemeMode(data);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  const handleDeeplink = async () => {
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

    if(url) {
      storage.setItem("DEEPLINK_INITIAL_PARAMS", params);
    }
    if(/\/anime/i.test(url)) {
      return setInitialScreenName("anime");
    }

    Linking.addEventListener("url", ({ url }) => {
      if(url) {
        storage.setItem("DEEPLINK_INITIAL_PARAMS", getUrlVars(url));
      }
      if(/\/anime/i.test(url)) {
        return setInitialScreenName("anime");
      }
    });

    setInitialScreenName("tabs");
  }; 

  useEffect(() => {
    getTheme();
    authorization();
  }, []);

  return (
    <ThemeContext.Provider value={darkThemeMode ? theme.DARK : theme.LIGHT}>
      <UserContext.Provider value={UserData}>
        <NavigationContainer>
          <StatusBar
          backgroundColor="transparent"
          translucent
          />

          {
            initialScreenName ? (
              <Stack.Navigator 
              initialRouteName={initialScreenName} 
              screenOptions={{ headerShown: false }}
              >
                <Stack.Screen 
                name="tabs" 
                component={Tabs}
                />

                <Stack.Screen 
                name="settings" 
                options={{ animation: "none" }}
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
                name="network_error" 
                options={{ animation: "none" }}
                component={NetworkError}
                />

                <Stack.Screen 
                name="edit_profile.profile" 
                options={{ animation: "none" }}
                component={EditProfile_Profile}
                />

                <Stack.Screen 
                name="edit_profile.privacy" 
                options={{ animation: "none" }}
                component={EditProfile_Privacy}
                />

                <Stack.Screen 
                name="edit_profile.security" 
                options={{ animation: "none" }}
                component={EditProfile_Security}
                />

                <Stack.Screen 
                name="edit_profile.change_nickname" 
                options={{ animation: "none" }}
                component={EditProfile_ChangeNickname}
                />

                <Stack.Screen 
                name="settings.application" 
                options={{ animation: "none" }}
                component={Settings_Application}
                />

                <Stack.Screen 
                name="settings.another" 
                options={{ animation: "none" }}
                component={Settings_Another}
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
                component={Anime_ReplyComments}
                />

                <Stack.Screen 
                name="anime.all_comments" 
                options={{ animation: "none" }}
                component={Anime_AllComments}
                />

                <Stack.Screen 
                name="anime.select_translation" 
                options={{ animation: "none" }}
                component={Anime_SelectTranslation}
                />

                <Stack.Screen 
                name="anime.select_episode" 
                options={{ animation: "none" }}
                component={Anime_SelectEpisode}
                />

                <Stack.Screen 
                name="anime.videoplayer" 
                options={{ animation: "none" }}
                component={Anime_VideoPlayer}
                />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator
              screenOptions={{ headerShown: false }}
              >
                <Stack.Screen 
                name="SPLASH_SCREEN" 
                component={SplashScreen}
                />
              </Stack.Navigator>
            )
          }
        </NavigationContainer>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};