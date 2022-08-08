import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { CommonActions, NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import Orientation from "react-native-orientation";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import SplashScreen from "react-native-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { EventRegister } from "react-native-event-listeners";

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
    Authorization,
    AuthorizationRegistrationConfirmation,
} from "./panels";
import Tabs from "./navigation/Tabs";
import { sleep, storage } from "./functions";

import theme from "./config/theme";
import ThemeContext from "./config/ThemeContext";
import UserContext from "./config/UserContext";

Orientation.lockToPortrait();

const AuthorizationStack = createNativeStackNavigator();

export default App = () => {
    const [ darkThemeMode, setDarkThemeMode ] = useState(false);
    const [ UserData, setUserData ] = useState({});
    const [ authorized, setAuthorized ] = useState(false);

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
                return setAuthorized(false);
            }
        
            return Promise.reject(error);
        });
    }, []);

    useEffect(() => {
        const eventListener = EventRegister.addEventListener("app", (data) => {
            switch(data.type) {
                case "changeTheme": {
                    storage.setItem("DARK_THEME_MODE", data.value);

                    changeNavigationBarColor(data.value ? theme.DARK.bottom_tabbar.background : theme.LIGHT.bottom_tabbar.background, !data.value, true);
                    return setDarkThemeMode(data.value);
                }
                case "changeUser": {
                    setUserData(data.user);
                    return storage.setItem("cachedUserData", data.user);
                }
                case "changeAuthorized": {
                    setUserData(data.user);
                    return setAuthorized(data.value);
                }
                default:
                    return;
            }
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
            let hashes = url.slice(url.indexOf("?") + 1).split("&");
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split("=");
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

    const getIsSignedIn = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        if(!sign) return;

        return setAuthorized(true);
    };

    const initialize = new Promise((resolve) => {
        getTheme();
        handleDeeplink();
        getIsSignedIn();

        return sleep(0.5).then(() => resolve());
    });

    return (
        <ThemeContext.Provider value={darkThemeMode ? theme.DARK : theme.LIGHT}>
            <UserContext.Provider value={UserData}>
                <NavigationContainer 
                onReady={() => initialize.finally(() => SplashScreen.hide())}
                ref={navigation}
                >
                    {
                        authorized ? (
                            <Tabs />
                        ) : (
                            <AuthorizationStack.Navigator
                            screenOptions={{
                                headerShown: false,
                                animation: "none"
                            }}
                            >
                                <AuthorizationStack.Screen 
                                name="authorization" 
                                component={Authorization} 
                                />

                                <AuthorizationStack.Screen 
                                name="authorization.registration_confirmation" 
                                component={AuthorizationRegistrationConfirmation} 
                                />
                            </AuthorizationStack.Navigator>
                        )
                    }
                </NavigationContainer>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
};