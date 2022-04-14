import React, { useState, useEffect } from "react";
import { ScrollView, View, Switch } from "react-native";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

import { storage } from "../../functions";

export const Settings_Application = (props) => {
    const { 
        style,
        navigation: {
            goBack
        },
        getTheme
    } = props;

    const [ darkTheme, setDarkTheme ] = useState(false);

    useEffect(() => {
        (async () => {
            const theme = await getTheme();

            setDarkTheme(theme);
        })();
    }, []);

    const switchDarkTheme = () => {
        storage.setItem("darkTheme", !darkTheme);
        setDarkTheme(!darkTheme);
        getTheme();
    };

    return (
        <View style={style.view}>
            <Header
            title="Настройки"
            subtitle="Приложение"
            height={30}
            backgroundColor={style.header_background_color}
            backButtonOnPress={() => goBack()}
            backButton
            style={style}
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>

                <Cell
                style={style}
                title="Тёмная тема"
                before={
                    <Icon 
                    name="moon" 
                    size={23} 
                    type="Feather" 
                    color={style.icon_color} 
                    />
                }
                subtitle="Интерфейс приобретает тёмный цвет"
                after={
                    <Switch
                    value={darkTheme}
                    onValueChange={() => switchDarkTheme()}
                    trackColor={{ false: style.switch_track_color_off, true: style.switch_track_color_on }}
                    thumbColor={darkTheme ? style.switch_thumb_color : style.switch_thumb_color_light}
                    />
                }
                onPress={() => switchDarkTheme()}
                />
            </ScrollView>
        </View>
    )
};