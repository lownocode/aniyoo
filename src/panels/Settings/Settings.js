import React, { useState, useRef, useContext } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";

import ThemeContext from "../../config/ThemeContext";
import { normalizeSize } from "../../functions";

import {
    Header,
    Cell,
    Icon,
    Divider,
} from "../../components";
import {
    ConfirmExit,
} from "../../modals";

export const Settings = props => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            navigate
        },
    } = props;

    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

    const styles = StyleSheet.create({
        modalContainer: {
            left: 10,
            width: Dimensions.get("window").width - 20,
            bottom: 10,
            borderRadius: 15,
            backgroundColor: theme.bottom_modal.background,
            borderColor: theme.bottom_modal.border,
            borderWidth: 0.5,
            overflow: "hidden",
            borderRadius: 15,
        },
    });

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Настройки"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>
            
            <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{ paddingTop: 15 }}/>

                <Cell
                centered={false}
                title="Выйти из аккаунта"
                subtitle="Вы снова сможете войти по логину и паролю"
                before={
                    <View
                    style={{
                        width: normalizeSize(33),
                        height: normalizeSize(33),
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
                onPress={() => {
                    setModalContent(<ConfirmExit navigate={navigate} onClose={() => modalRef.current?.close()}/>);
                    modalRef.current?.open();
                }}
                />

                <Divider dividerStyle={{marginVertical: 10}}/>

                <Cell
                title="Приложение"
                before={
                    <View
                    style={{
                        width: normalizeSize(33),
                        height: normalizeSize(33),
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
                        width: normalizeSize(33),
                        height: normalizeSize(33),
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
                        width: normalizeSize(33),
                        height: normalizeSize(33),
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
        </View>
    )
};