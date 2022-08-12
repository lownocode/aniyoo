import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { CommonActions, NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { EventRegister } from "react-native-event-listeners";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { getThemeIsDark, getUserData } from "./redux/reducers";

import FBMessaging from "@react-native-firebase/messaging";
import Firebase from "@react-native-firebase/app";
import notifee from "@notifee/react-native";

import {
    Authorization,
    AuthorizationRegistrationConfirmation,
} from "./panels";
import Tabs from "./navigation/Tabs";
import { sleep, storage } from "./functions";

const AuthorizationStack = createNativeStackNavigator();

if (!Firebase.apps.length) {
    Firebase.initializeApp({
        appId: "1:746738249066:android:5efc0116808568abf20913",
        apiKey: "AIzaSyCzQhtAUcazg3-Ol01BwtpUOc9INxPCTZE",
        projectId: "aniyoo",
        storageBucket: "aniyoo.appspot.com",
        databaseURL: "https://aniyoo-default-rtdb.europe-west1.firebasedatabase.app/",
        messagingSenderId: "746738249066",
    });
}

const App = () => {
    const dispatch = useDispatch();

    const [ authorized, setAuthorized ] = useState(false);

    const navigation = useNavigationContainerRef();

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
                case "changeAuthorized": {
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

    const getIsSignedIn = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        if(!sign) return;

        return setAuthorized(true);
    };

    const notificationsAndUserInit = async () => {
        await FBMessaging().registerDeviceForRemoteMessages();
        const notifyToken = await FBMessaging().getToken();

        dispatch(getUserData(notifyToken ?? null));
    };

    const initialize = new Promise((resolve) => {
        dispatch(getThemeIsDark());

        notificationsAndUserInit();
        handleDeeplink();
        getIsSignedIn();

        return sleep(0.5).then(() => resolve());
    });

    return (
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
    );
};

export default AppWrapper = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
};