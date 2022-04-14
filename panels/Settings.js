import React, { useState, useRef } from "react";
import { View, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
    Header,
    Cell,
    Icon,
    Divider,
    BottomModal
} from "../components";
import {
    ConfirmExit,
} from "../modals";

export const Settings = props => {
    const { 
        style,
        navigation: {
            goBack,
            navigate
        },
    } = props;

    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

    return (
        <GestureHandlerRootView style={style.view}>
            <Header
            title="Настройки"
            height={30}
            backgroundColor={style.header_background_color}
            backButtonOnPress={() => goBack()}
            backButton
            style={style}
            />

            <BottomModal
            style={style}
            ref={modalRef}
            >
                {modalContent}
            </BottomModal>
            
            <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{ paddingTop: 15 }}/>

                <Cell
                centered={false}
                style={style}
                title="Выйти из аккаунта"
                subtitle="Вы снова сможете войти по логину и паролю"
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#f54545" + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="account-remove-outline"
                        type="MaterialCommunityIcons"
                        size={20}
                        color="#f54545"
                        />
                    </View>
                }
                onPress={() => {
                    setModalContent(<ConfirmExit style={style} onClose={() => modalRef?.current?.hide()} navigate={navigate}/>);
                    modalRef?.current?.show();
                }}
                />

                <Divider style={style} dividerStyle={{marginVertical: 10}}/>

                <Cell
                style={style}
                title="Приложение"
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
                        name="apps"
                        type="Octicons"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Темы, видеоплеер, интерфейс"
                onPress={() => navigate("settings.application")}
                />

                <Cell
                style={style}
                title="Другое"
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
                        name="compass"
                        type="Entypo"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Уведомления"
                onPress={() => navigate("settings.another")}
                />

                <Divider style={style} dividerStyle={{marginVertical: 10}}/>

                <Cell
                style={style}
                title="Техническая поддержка"
                centered={false}
                before={
                    <View
                    style={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#03fc41" + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="bug-report"
                        type="MaterialIcons"
                        size={20}
                        color="#03fc41"
                        />
                    </View>
                }
                subtitle="Появился вопрос? Задайте его поддержке прямо сейчас!"
                />
            </ScrollView>
        </GestureHandlerRootView>
    )
};