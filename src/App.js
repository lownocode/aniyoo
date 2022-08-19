import React, { useEffect, useRef } from "react";
import { Linking } from "react-native";
import { CommonActions, NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import axios from "axios";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, getAuthorized, getTheme, getUserData, setAuthorized } from "./redux/reducers";
import { Modalize } from "react-native-modalize";
import FBMessaging from "@react-native-firebase/messaging";
import Firebase from "@react-native-firebase/app";

import { BottomModalContent } from "./modals";
import { store } from "./redux/store";
import {
    Authorization,
    AuthorizationRegistrationConfirmation,
} from "./panels";
import Tabs from "./navigation/Tabs";
import { storage } from "./functions";
import { WINDOW_WIDTH } from "../constants";

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

export const App = () => {
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.theme);
    const { authorized, modal } = useSelector(state => state.app);

    const navigation = useNavigationContainerRef();
    const modalRef = useRef();

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
        axios.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if(error.response.data.code === "INVALID_SIGN") {
                storage.setItem("AITHORIZATION_SIGN", null);
                return dispatch(setAuthorized(false));
            }
        
            return Promise.reject(error);
        });
    }, []);

    const notificationsAndUserInit = async () => {
        await FBMessaging().registerDeviceForRemoteMessages();
        const notifyToken = await FBMessaging().getToken();

        dispatch(getUserData(notifyToken ?? null));
    };

    useEffect(() => {
        store.subscribe(() => {
            const modalIsVisible = store.getState().app.modal.visible;

            if(modal.visible !== modalIsVisible) {
                if(modalIsVisible) {
                    return modalRef.current?.open();
                }

                modalRef.current?.close();
            }
        });
    }, []);

    const initialize = () => {
        dispatch(getTheme());
        dispatch(getAuthorized());

        notificationsAndUserInit();
        handleDeeplink();
    };

    return (
        <NavigationContainer 
        onReady={() => initialize()}
        ref={navigation}
        >
            <Modalize
            ref={modalRef}
            onClosed={() => dispatch(closeModal())}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={{
                left: 10,
                width: WINDOW_WIDTH - 20,
                bottom: 10,
                borderRadius: 15,
                backgroundColor: theme.bottom_modal.background,
                borderColor: theme.bottom_modal.border,
                borderWidth: 0.5,
                overflow: "hidden",
                borderRadius: 15,
            }}
            adjustToContentHeight
            >
                <BottomModalContent/>
            </Modalize>
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