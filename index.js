import { AppRegistry, LogBox } from "react-native";
import axios from "axios";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import Orientation from "react-native-orientation";

import App from "./src/App";
import { REQUEST_DOMAIN } from "./variables";

LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "VirtualizedLists should never be nested",
    "TypeError: Cannot read property 'uri' of null"
]);

axios.defaults.baseURL = REQUEST_DOMAIN;
Orientation.lockToPortrait();

AppRegistry.registerComponent("aniyoo", () => gestureHandlerRootHOC(App));