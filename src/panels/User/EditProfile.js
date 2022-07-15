import React, { useContext } from "react";
import { View, ScrollView } from "react-native";

import {
    Header,
    Cell,
    Icon,
} from "../../components";

import ThemeContext from "../../config/ThemeContext";

export const EditProfile = props => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            navigate
        },
    } = props;

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать профиль"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <ScrollView 
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            >
                <View style={{  marginTop: 10 }}/>

                <Cell
                title="Профиль"
                subtitle="Аватарка, никнейм, статус"
                onPress={() => navigate("edit_profile.profile")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: theme.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="user-profile"
                        size={18}
                        color={theme.accent}
                        />
                    </View>
                }
                />

                <View style={{marginTop: 5}} />

                <Cell
                title="Безопасность"
                subtitle="Пароль, почта"
                onPress={() => navigate("edit_profile.security")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: theme.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="shield-security"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                />

                <View style={{marginTop: 5}} />

                <Cell
                title="Приватность"
                subtitle="Закрытый профиль, настройки приватности"
                onPress={() => navigate("edit_profile.privacy")}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: theme.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="key"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                />
                <View style={{paddingBottom: 50}}/>
            </ScrollView>
        </View>
    )
};