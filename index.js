import { AppRegistry, LogBox } from "react-native";
import axios from "axios";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import Orientation from "react-native-orientation";
import notifee from "@notifee/react-native";
import FBMessaging from "@react-native-firebase/messaging";

import App from "./src/App";
import { REQUEST_DOMAIN } from "./variables";

LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "VirtualizedLists should never be nested",
    "TypeError: Cannot read property 'uri' of null"
]);

const onMessageReceived = async (message) => {
    console.log(message);
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    notifee.displayNotification({
        title: 'Your order has been shipped',
        body: `Your order was shipped at this`,
        android: {
            channelId
        },
    });
};

FBMessaging().onMessage(onMessageReceived);
FBMessaging().setBackgroundMessageHandler(onMessageReceived);

axios.defaults.baseURL = REQUEST_DOMAIN;
Orientation.lockToPortrait();

AppRegistry.registerComponent("aniyoo", () => gestureHandlerRootHOC(App));