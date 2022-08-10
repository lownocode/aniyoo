import React from "react";
import { View, } from "react-native";
import { useSelector } from "react-redux";

import {
    Header,
    Icon,
    Placeholder
} from "../components";

export const Notices = () => {
    const { theme: { theme } } = useSelector(state => state);

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
                name="notifications-disable"
                color={theme.accent}
                size={50}
                />
            }
            />
        </View>
    )
};