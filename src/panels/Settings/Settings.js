import React from "react";
import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
    Cell,
    Icon,
    Divider,
    Panel,
} from "../../components";
import { openModal } from "../../redux/reducers";

export const Settings = props => {
    const dispatch = useDispatch(); 

    const { theme } = useSelector(state => state.theme);

    const { 
        navigation: {
            goBack,
            navigate
        },
    } = props;

    return (
        <Panel
        headerProps={{
            title: "Настройки",
            backOnPress: () => goBack()
        }}
        >
            <ScrollView>
                <Cell
                centered={false}
                title="Выйти из аккаунта"
                subtitle="Вы снова сможете войти по логину и паролю"
                before={
                    <View
                    style={{
                        width: 43,
                        height: 43,
                        backgroundColor: "#f54545" + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="exit-outline"
                        size={20}
                        color="#f54545"
                        />
                    </View>
                }
                onPress={() => dispatch(openModal({ visible: true, id: "CONFIRM_EXIT", props: { navigate } }))}
                />

                <Divider dividerStyle={{marginVertical: 10}}/>

                <Cell
                title="Приложение"
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
                        name="apps"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                subtitle="Темы, видеоплеер, интерфейс"
                onPress={() => navigate("settings.application")}
                />

                <Cell
                title="Другое"
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
                        name="compass"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                subtitle="Уведомления"
                onPress={() => navigate("settings.another")}
                />

                <Divider dividerStyle={{marginVertical: 10}}/>

                <Cell
                title="Техническая поддержка"
                centered={false}
                before={
                    <View
                    style={{
                        width: 43,
                        height: 43,
                        backgroundColor: "#03fc41" + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="bug"
                        size={20}
                        color="#03fc41"
                        />
                    </View>
                }
                subtitle="Появился вопрос? Задайте его поддержке прямо сейчас!"
                />
            </ScrollView>
        </Panel>
    )
};