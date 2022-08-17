import React from "react";
import { ScrollView, View } from "react-native";

import { 
    Panel,
    Cell,
} from "../../components";

export const EditProfilePrivacy = (props) => {
    const { 
        navigation: {
            goBack
        }
    } = props;

    return (
        <Panel
        headerProps={{
            title: "Редактировать профиль",
            subtitle: "Приватность",
            backOnPress: () => goBack()
        }}
        >
            <ScrollView>
                <Cell
                title="Закрытый профиль"
                subtitle="При включении этой функции все Ваши данные в профиле будут скрыты для всех людей"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                title="Кто может отправлять мне заявки в друзья"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                title="Кто может видеть в профиле мои комментарии"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                title="Кто может видеть в профиле мои сборки"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                title="Кто может видеть в профиле моих друзей"
                subtitle="Все пользователи"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                title="Кто может видеть мои социальные сети"
                subtitle="Все пользователи"
                />
            </ScrollView>
        </Panel>
    )
};