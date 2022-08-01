import React, { useState, useRef, useContext, useEffect } from "react";
import { ScrollView, View, StyleSheet, Dimensions, ToastAndroid } from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { Modalize } from "react-native-modalize";

import ThemeContext from "../../config/ThemeContext";

import { 
    Header,
    Cell,
    Icon,
    Avatar,
} from "../../components";
import {
    SetStatus
} from "../../modals";

import { storage } from "../../functions";

export const EditProfileProfile = (props) => {
    const theme = useContext(ThemeContext);

    const [ cachedUserData, setCachedUserData ] = useState({});

    const { 
        navigation: {
            goBack,
            navigate
        },
    } = props;

    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

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

            ToastAndroid.show("Загрузка картинки на сервер, подождите немного...", ToastAndroid.LONG);

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
                ToastAndroid.show("Аватарка успешно загружена", ToastAndroid.CENTER);
            })
            .catch(({ response: { data } }) => {
                ToastAndroid.show(data?.message, ToastAndroid.CENTER);
            });
        });
    };

    const getCachedUserData = async () => {
        const data = await storage.getItem("cachedUserData");

        setCachedUserData(data);
    };

    useEffect(() => {
        getCachedUserData();
    }, []);

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
                        width: 43,
                        height: 43,
                        backgroundColor: "red",//theme.accent + "10",
                        borderRadius: 100,
                        overflow: "hidden"
                    }}
                    >
                        <Avatar
                        url={cachedUserData?.photo}
                        size={43}
                        blurRadius={5}
                        />

                        <View
                        style={{
                            position: "absolute",
                            backgroundColor: "rgba(0, 0, 0, .4)",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="gallery"
                            size={17}
                            />
                        </View>
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
                        width: 43,
                        height: 43,
                        backgroundColor: theme.accent + "10",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="pencil-write"
                        size={17}
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
        </View>
    )
};