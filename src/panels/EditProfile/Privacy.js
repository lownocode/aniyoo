import React, { useContext } from "react";
import { ScrollView, View, Switch } from "react-native";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
} from "../../components";

export const EditProfilePrivacy = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack
        }
    } = props;

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать профиль"
            subtitle="Приватность"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>

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
        </View>
    )
};