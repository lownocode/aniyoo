import { Dimensions, StatusBar, NativeModules } from "react-native";

const { ExtraDimensions } = NativeModules;
 
export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
export const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");
export const { SOFT_BAR_MENU_HEIGHT } = ExtraDimensions;

export const STATUSBAR_HEIGHT = SOFT_BAR_MENU_HEIGHT ? StatusBar.currentHeight : (SCREEN_HEIGHT - WINDOW_HEIGHT) || StatusBar.currentHeight;