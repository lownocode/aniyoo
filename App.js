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
import { style as StylesStack } from './styles';
import axios from 'axios';

const Stack = createNativeStackNavigator();

export default App = () => {
  const [ darkThemeMode, setDarkThemeMode ] = useState(false);
  const [ initialScreenName, setInitialScreenName ] = useState();

  const getTheme = async () => {
    const theme = await storage.getItem("darkTheme");
    if(theme === null) {
      await storage.setItem("darkTheme", true);
      return setDarkThemeMode(true);
    }

    setDarkThemeMode(theme);
    return theme;
  }; 

  const authorization = async () => {
    const authorizationData = await storage.getItem("authorization_data");
    if(!authorizationData) {
      setInitialScreenName("authorization");
      return SplashScreen.hide();
    }

    const { data } = await axios.post("/user.signIn", authorizationData)
    .catch((error) => {
      if(error.toJSON().message === "Network Error") {
        SplashScreen.hide();
        return setInitialScreenName("network_error");
      }
    });

    if(!data.success) {
      storage.setItem("authorization_data", null);
      setInitialScreenName("authorization");
      return SplashScreen.hide();
    }

    setInitialScreenName("tabs");
    SplashScreen.hide();
  };

  useEffect(() => {
    getTheme();
    authorization();
  }, []);

  const style = StylesStack(darkThemeMode);

  return (
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
                props => <Tabs {...props} style={style}/>
              }
            </Stack.Screen>

            <Stack.Screen name="settings" options={{ animation: "none" }}>
              {
                props => <Settings {...props} style={style} getTheme={getTheme}/>
              }
            </Stack.Screen>

            <Stack.Screen name="authorization">
              {
                props => <Authorization {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="edit_profile" options={{ animation: "none" }}>
              {
                props => <EditProfile {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="network_error" options={{ animation: "none" }}>
              {
                props => <NetworkError {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="edit_profile.profile" options={{ animation: "none" }}>
              {
                props => <EditProfile_Profile {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="edit_profile.privacy" options={{ animation: "none" }}>
              {
                props => <EditProfile_Privacy {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="edit_profile.security" options={{ animation: "none" }}>
              {
                props => <EditProfile_Security {...props} style={style} />
              }
            </Stack.Screen>

            <Stack.Screen name="settings.application" options={{ animation: "none" }}>
              {
                props => <Settings_Application {...props} style={style} getTheme={getTheme} />
              }
            </Stack.Screen>

            <Stack.Screen name="settings.another" options={{ animation: "none" }}>
              {
                props => <Settings_Another {...props} style={style} />
              }
            </Stack.Screen>
          </Stack.Navigator>
        ) : null
      }
    </NavigationContainer>
  );
};