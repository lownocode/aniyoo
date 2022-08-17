import React, { useState, useRef } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { Modalize } from "react-native-modalize";

import {
    Cell,
    Icon,
    Divider,
    Panel,
} from "../../components";
import {
    ConfirmExit,
} from "../../modals";

export const Settings = props => {
    const { theme } = useSelector(state => state.theme);

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
        <Panel
        headerProps={{
            title: "Настройки",
            backOnPress: () => goBack()
        }}
        >
            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>
            
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