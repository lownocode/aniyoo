import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "react-native-splash-screen";
import { StatusBar } from 'react-native';

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
  EditSocialNetworks
} from "./panels";
import { Tabs } from './navigation/Tabs';

import { storage } from './functions';
import axios from 'axios';
import { EventRegister } from 'react-native-event-listeners';

import theme from "./config/theme";
import ThemeContext from "./config/ThemeContext";

const Stack = createNativeStackNavigator();

export default App = () => {
  const [ darkThemeMode, setDarkThemeMode ] = useState(false);
  const [ initialScreenName, setInitialScreenName ] = useState();

  const getTheme = async () => {
    const theme = await storage.getItem("DARK_THEME_MODE");
    if(theme === null) {
      await storage.setItem("DARK_THEME_MODE", true);
      return setDarkThemeMode(true);
    }

    setDarkThemeMode(theme);
    return theme;
  }; 

  const authorization = async () => {
    const sign = await storage.getItem("AUTHORIZATION_SIGN");

    if(!sign) {
      setInitialScreenName("authorization");
      return SplashScreen.hide();
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
            "authorization": sign,
            "Content-Type": "application/json"
        }
    })
    .catch((error) => {
      if(error.toJSON().message === "Network Error") {
        SplashScreen.hide();
        return setInitialScreenName("network_error");
      }

      storage.setItem("AUTHORIZATION_SIGN", null);
      setInitialScreenName("authorization");
      return SplashScreen.hide();
    });

    setInitialScreenName("tabs");
    SplashScreen.hide();
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

  useEffect(() => {
    getTheme();
    authorization();
  }, []);

  return (
    <ThemeContext.Provider value={darkThemeMode ? theme.DARK : theme.LIGHT}>
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
            </Stack.Navigator>
          ) : null
        }
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};