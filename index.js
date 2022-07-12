import { AppRegistry, LogBox } from "react-native";
import axios from "axios";

import App from "./src/App";
import { REQUEST_DOMAIN } from "./variables";

LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    "VirtualizedLists should never be nested"
]);

axios.defaults.baseURL = REQUEST_DOMAIN;

AppRegistry.registerComponent("aniyoo", () => App);