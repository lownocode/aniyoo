import React from "react";
import { View, Text, ScrollView } from "react-native";

import {
    Divider,
    Header,
    Icon,
    Placeholder
} from "../components";

export const Notices = props => {
    const { 
        style,
    } = props;

    return (
        <View style={style.view}>
            <Header
            title="Уведомления"
            titleStyle={style.header_title}
            height={30}
            backgroundColor={style.header_background_color}
            style={style}
            />
            <View style={{ paddingTop: 15 }}/>

            <Placeholder
            style={style}
            title="Уведомлений нет"
            subtitle="Вы ещё не получили ни одного уведомления от системы"
            icon={
                <Icon
                name="md-notifications-off-outline"
                type="Ionicons"
                color={style.accent}
                size={50}
                />
            }
            />

            {/* <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginTop: -15}}
            >

            </ScrollView> */}
        </View>
    )
};