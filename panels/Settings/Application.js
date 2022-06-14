import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Switch } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

import { storage } from "../../functions";

export const Settings_Application = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack
        },
    } = props;

    const [ darkThemeMode, setDarkThemeMode ] = useState(false);

    useEffect(() => {
        (async () => {
            const theme = await storage.getItem("DARK_THEME_MODE");

            setDarkThemeMode(theme);
        })();
    }, []);

    const switchDarkTheme = (value) => {
        EventRegister.emit("changeTheme", value);
        setDarkThemeMode(value);

        storage.setItem("DARK_THEME_MODE", value);
        console.log(value)
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Настройки"
            subtitle="Приложение"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>

                <Cell
                title="Тёмная тема"
                before={
                    <Icon 
                    name="moon" 
                    size={23} 
                    type="Feather" 
                    color={theme.icon_color} 
                    />
                }
                subtitle="Интерфейс приобретает тёмный цвет"
                after={
                    <Switch
                    value={darkThemeMode}
                    onValueChange={(value) => switchDarkTheme(value)}
                    trackColor={{ false: theme.switch.track_off, true: theme.switch.track_on }}
                    thumbColor={darkThemeMode ? theme.switch.thumb : theme.switch.thumb_light}
                    />
                }
                disabled
                />
            </ScrollView>
        </View>
    )
};