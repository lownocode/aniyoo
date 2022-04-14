import React from "react";
import { ScrollView, View, Switch } from "react-native";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

export const EditProfile_Privacy = (props) => {
    const { 
        style,
        navigation: {
            goBack
        }
    } = props;

    return (
        <View style={style.view}>
            <Header
            title="Редактировать профиль"
            subtitle="Приватность"
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
                title="Закрытый профиль"
                subtitle="При включении этой функции все Ваши данные в профиле будут скрыты для всех людей"
                after={
                    <Switch
                    value={false}
                    // onValueChange={}
                    trackColor={{ false: style.switch_track_color_off, true: style.switch_track_color_on }}
                    thumbColor={style.switch_thumb_color_light}
                    />
                }
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Кто может отправлять мне заявки в друзья"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Кто может видеть в профиле мои комментарии"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Кто может видеть в профиле мои сборки"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Кто может видеть в профиле моих друзей"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Кто может видеть мои социальные сети"
                subtitle="Все пользователи"
                />
            </ScrollView>
        </View>
    )
};