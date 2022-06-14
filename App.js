import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "react-native-splash-screen";
import { StatusBar } from 'react-native';

import {
  Settings,
  Authorization,
  EditProfile,
  NetworkError,
  EditProfile_Profile,
  EditProfile_Privacy,
  EditProfile_Security,
  Settings_Another,
  Settings_Application
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

    axios.post("/user.signIn", null, {
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
              <Stack.Screen name="tabs" options={{ animation: "none" }}>
                {
                  props => <Tabs {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="settings" options={{ animation: "none" }}>
                {
                  props => <Settings {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="authorization">
                {
                  props => <Authorization {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="edit_profile" options={{ animation: "none" }}>
                {
                  props => <EditProfile {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="network_error" options={{ animation: "none" }}>
                {
                  props => <NetworkError {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="edit_profile.profile" options={{ animation: "none" }}>
                {
                  props => <EditProfile_Profile {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="edit_profile.privacy" options={{ animation: "none" }}>
                {
                  props => <EditProfile_Privacy {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="edit_profile.security" options={{ animation: "none" }}>
                {
                  props => <EditProfile_Security {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="settings.application" options={{ animation: "none" }}>
                {
                  props => <Settings_Application {...props} />
                }
              </Stack.Screen>

              <Stack.Screen name="settings.another" options={{ animation: "none" }}>
                {
                  props => <Settings_Another {...props} />
                }
              </Stack.Screen>
            </Stack.Navigator>
          ) : null
        }
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};