import React, { useState, useRef, useEffect, useContext } from "react";
import { ScrollView, View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { EventRegister } from "react-native-event-listeners";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
    Icon,
    Snackbar
} from "../../components";
import {
    SetStatus
} from "../../modals";

import { storage, sleep } from "../../functions";

export const EditProfile_Profile = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            reset,
            navigate
        },
    } = props;

    const [ modalContent, setModalContent ] = useState(null);
    const [ snackbar, setSnackbar ] = useState(null);

    const modalRef = useRef();
    const snackbarRef = useRef();

    useEffect(() => {
        const eventListener = EventRegister.addEventListener("edit_profile.profile", (event) => {
            if(event.type === "show_snackbar") {
                setSnackbar({ 
                    text: event.data.text,
                    before: event.data.before
                });

                snackbarRef?.current?.show();
                sleep(5).then(() => snackbarRef?.current?.hide());
            }
        });

        return () => {
            EventRegister.removeEventListener(eventListener);
        };
    }, []);

    const changePhoto = async () => {
        launchImageLibrary({
            mediaType: "photo",
        })
        .then(async (image) => {
            const sign = await storage.getItem("AUTHORIZATION_SIGN");

            const formData = new FormData();
            formData.append("avatar", {
                uri: image.assets[0].uri,
                type: image.assets[0].type,
                name: image.assets[0].fileName
            });

            setSnackbar({ 
                text: "Загрузка картинки на сервер, подождите немного...",
                before: (
                    <ActivityIndicator size={17} color="#fff"/>
                )
            });
            snackbarRef?.current?.show();

            axios({
                method: "post",
                url: "/settings.updateAvatar",
                data: formData,
                headers: { 
                    "Content-Type": `multipart/form-data`,
                    "Authorization": sign,
                    Accept: 'application/json',
                },
            })
            .then(() => {
                setSnackbar({ 
                    text: "Аватарка успешно загружена",
                    before: (
                        <Icon
                        name="checkmark-done"
                        type="Ionicons"
                        color="#fff"
                        size={17}
                        />
                    )
                });

                snackbarRef?.current?.show();
                sleep(5).then(() => snackbarRef?.current?.close());
            })
            .catch(({ response: { data } }) => {
                setSnackbar({ 
                    text: data?.message,
                    before: (
                        <Icon
                        name="error-outline"
                        type="MaterialIcons"
                        color="#fff"
                        size={17}
                        />
                    )
                });

                snackbarRef?.current?.show();
                sleep(5).then(() => snackbarRef?.current?.close());
            });
        });
    };

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
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать профиль"
            subtitle="Профиль"
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

            <Snackbar
            ref={snackbarRef}
            text={snackbar?.text}
            before={snackbar?.before}
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 10, paddingTop: 15}}/>

                <Cell
                title="Сменить аватарку"
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
                        name="photo-library"
                        type="MaterialIcons"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                subtitle="Загрузить с устройства"
                onPress={() => changePhoto()}
                />

                <View style={{marginTop: 5}} />

                <Cell
                title="Изменить никнейм"
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
                        name="user"
                        type="Feather"
                        size={20}
                        color={theme.accent}
                        />
                    </View>
                }
                subtitle="Не нравится текущий никнейм? Просто смените его!"
                onPress={() => navigate("edit_profile.change_nickname")}
                />

                <View style={{marginTop: 5}} />

                <Cell
                title="Редактировать статус"
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
                        name="pencil"
                        type="EvilIcons"
                        size={25}
                        color={theme.accent}
                        />
                    </View>
                }
                subtitle="Выразите свои мысли..."
                onPress={() => {
                    setModalContent(<SetStatus onClose={() => modalRef?.current?.close()}/>);
                    modalRef?.current?.open();
                }}
                />
            </ScrollView>
        </GestureHandlerRootView>
    )
};