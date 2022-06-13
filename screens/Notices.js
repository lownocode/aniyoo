import React, { useContext} from "react";
import { View, } from "react-native";

import {
    Header,
    Icon,
    Placeholder
} from "../components";

import themeContext from "../config/themeContext";

export const Notices = () => {
    const theme = useContext(themeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Уведомления"
            height={30}
            />
            <View style={{ paddingTop: 15 }}/>

            <Placeholder
            title="Уведомлений нет"
            subtitle="Вы ещё не получили ни одного уведомления от системы"
            icon={
                <Icon
                name="md-notifications-off-outline"
                type="Ionicons"
                color={theme.accent}
                size={50}
                />
            }
            />
        </View>
    )
};