import React from "react";
import { AppRegistry, LogBox, } from "react-native";
import { Provider } from "react-redux";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import axios from "axios";
import Orientation from "react-native-orientation";
import notifee, { EventType, AndroidStyle, AndroidImportance } from "@notifee/react-native";
import FBMessaging from "@react-native-firebase/messaging";

import { App } from "./src/App";
import { REQUEST_DOMAIN } from "./variables";
import { store } from "./src/redux/store";

LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "VirtualizedLists should never be nested",
    "TypeError: Cannot read property 'uri' of null"
]);

const onMessageReceived = async (message) => {
    await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH
    });

    return notifee.displayNotification({
        title: '08:00am Alarm',
        body: 'The alarm you set for 08:00am requires attention!',
        android: {
            channelId: 'default',
            style: {
                type: AndroidStyle.MESSAGING,
                person: {
                  name: 'John Doe',
                  icon: 'https://my-cdn.com/avatars/123.png',
                },
                messages: [
                  {
                    text: 'Hey, how are you?',
                    timestamp: Date.now() - 600000, // 10 minutes ago
                  },
                  {
                    text: 'Great thanks, food later?',
                    timestamp: Date.now(), // Now
                    person: {
                      name: 'Sarah Lane',
                      icon: 'https://my-cdn.com/avatars/567.png',
                    },
                  },
                ],
                
              },
              actions: [
                {
                  title: '<b>ответить</b> &#128111;',
                  pressAction: { id: 'dance' },
                  input: true
                },
              ],
        },
    });
};

notifee.onBackgroundEvent(async ({ type, detail, headless }) => {
    if (type === EventType.DISMISSED) {
        console.log("dismiss notice")
    }
});
FBMessaging().onMessage(onMessageReceived);
FBMessaging().setBackgroundMessageHandler(onMessageReceived);

axios.defaults.baseURL = REQUEST_DOMAIN;

Orientation.lockToPortrait();

const Component = () => (
	<Provider store={store}>
		<App/>
	</Provider>
);

AppRegistry.registerComponent("aniyoo", () => gestureHandlerRootHOC(Component));