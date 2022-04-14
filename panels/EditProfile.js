import React from "react";
import { View, ScrollView } from "react-native";

import {
    Header,
    Cell,
    Icon,
} from "../components";

export const EditProfile = props => {
    const { 
        style,
        navigation: {
            goBack,
            navigate
        },
    } = props;

    return (
        <View style={style.view}>
            <Header
            title="Редактировать профиль"
            titleStyle={style.header_title}
            height={30}
            backgroundColor={style.header_background_color}
            backButtonOnPress={() => goBack()}
            backButton
            style={style}
            />

            <ScrollView 
            showsVerticalScrollIndicator={false}
            >
                <View style={{  marginTop: 10 }}/>

                <Cell
                style={style}
                title="Профиль"
                subtitle="Аватарка, никнейм, статус"
                onPress={() => navigate("edit_profile.profile")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: style.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="user-alt"
                        type="FontAwesome5"
                        size={18}
                        color={style.accent}
                        />
                    </View>
                }
                />

                <View style={{marginTop: 5}} />

                <Cell
                style={style}
                title="Безопасность"
                subtitle="Пароль, почта"
                onPress={() => navigate("edit_profile.security")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: style.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="security"
                        type="MaterialIcons"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                />

                <View style={{marginTop: 5}} />

                <Cell
                style={style}
                title="Приватность"
                subtitle="Закрытый профиль, настройки приватности"
                onPress={() => navigate("edit_profile.privacy")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: style.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="privacy-tip"
                        type="MaterialIcons"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                />
                <View style={{paddingBottom: 50}}/>
            </ScrollView>
        </View>
    )
};