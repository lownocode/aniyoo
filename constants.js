import { Dimensions, StatusBar } from "react-native";

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
export const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");

export const STATUSBAR_HEIGHT = (SCREEN_HEIGHT - WINDOW_HEIGHT) || StatusBar.currentHeight;