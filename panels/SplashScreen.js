import React, { useContext } from "react";
import { View, Image } from "react-native";

import appLogo from "../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png";
import ThemeContext from "../config/ThemeContext";

export const SplashScreen = () => {
    const theme = useContext(ThemeContext);

    return (
        <View style={{ 
            backgroundColor: theme.background_content, 
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}
        >
            <Image
            source={appLogo}
            resizeMethod="resize"
            style={{
                width: 200,
                height: 200
            }}
            />
        </View>
    )
};