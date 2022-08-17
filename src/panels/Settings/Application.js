import React from "react";
import { ScrollView, View, Switch } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
    setTheme
} from "../../redux/reducers";

import { 
    Panel,
    Cell,
    Icon
} from "../../components";

export const SettingsApplication = (props) => {
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    const { 
        navigation: {
            goBack
        },
    } = props;

    const switchDarkTheme = (value) => {
        dispatch(setTheme(value ? "DARK" : "LIGHT"));
    };

    return (
        <Panel
        headerProps={{
            title: "Настройки",
            subtitle: "Приложение",
            backOnPress: () => goBack()
        }}
        >
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>

                <Cell
                title="Тёмная тема"
                before={
                    <Icon 
                    name="moon-outline" 
                    size={23} 
                    type="Feather" 
                    color={theme.icon_color} 
                    />
                }
                subtitle="Интерфейс приобретает тёмный цвет"
                after={
                    <Switch
                    value={theme.name === "dark"}
                    onValueChange={(value) => switchDarkTheme(value)}
                    trackColor={{ false: theme.switch.track_off, true: theme.switch.track_on }}
                    thumbColor={theme.name === "dark" ? theme.switch.thumb : theme.switch.thumb_light}
                    />
                }
                onPress={() => switchDarkTheme(theme.name === "dark" ? false : true)}
                />
            </ScrollView>
        </Panel>
    )
};