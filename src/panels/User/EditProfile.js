import React, { useState } from "react";
import { View, ScrollView, Linking } from "react-native";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import {
    Cell,
    Icon,
    Accordion,
    Panel,
} from "../../components";

export const EditProfile = props => {
    const { theme } = useSelector(state => state.theme);
    const route = useRoute();

    const { 
        navigation: {
            goBack,
            navigate
        },
    } = props;

    const [ userData ] = useState(route.params?.userData || {});

    return (
        <Panel
        headerProps={{
            title: "Редактировать профиль",
            backOnPress: () => goBack()
        }}
        >
            <ScrollView 
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            >
                <View style={{  marginTop: 10 }}/>

                <Accordion
                trigger={
                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    disabled
                    after={
                        <Icon
                        name="chevron-down"
                        color={theme.text_secondary_color}
                        />
                    }
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                }
                >
                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                </Accordion>

                <Accordion
                trigger={
                    <Cell
                    title="Безопасность"
                    subtitle="Пароль, почта"
                    disabled
                    after={
                        <Icon
                        name="chevron-down"
                        color={theme.text_secondary_color}
                        />
                    }
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                }
                >
                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                </Accordion>

                <Accordion
                trigger={
                    <Cell
                    title="Приватность"
                    subtitle="Закрытый профиль, настройки приватности"
                    disabled
                    after={
                        <Icon
                        name="chevron-down"
                        color={theme.text_secondary_color}
                        />
                    }
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                }
                >
                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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

                    <Cell
                    title="Профиль"
                    subtitle="Аватарка, никнейм, статус"
                    onPress={() => navigate("edit_profile.profile")}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
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
                </Accordion>

                <Accordion
                trigger={
                    <Cell
                    title="Привязка к сервисам"
                    subtitle="Telegram"
                    disabled
                    after={
                        <Icon
                        name="chevron-down"
                        color={theme.text_secondary_color}
                        />
                    }
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
                            backgroundColor: theme.accent + "10",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="link"
                            size={18}
                            color={theme.accent}
                            />
                        </View>
                    }
                    />
                }
                >
                    <Cell
                    title="Telergam"
                    subtitle="Привязка аккаунта через бота"
                    onPress={() => Linking.openURL("https://t.me/aniyoobot?start=" + userData?.sign)}
                    before={
                        <View
                        style={{
                            width: 43,
                            height: 43,
                            backgroundColor:  "#00a6ff10",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="telegram"
                            size={18}
                            color="#00a6ff"
                            />
                        </View>
                    }
                    />
                </Accordion>
            </ScrollView>
        </Panel>
    )
};