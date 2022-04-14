import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import ImgToBase64 from 'react-native-image-base64';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { 
    Header,
    Cell,
    Icon,
    BottomModal,
    Snackbar
} from "../../components";
import {
    ChangeNickname,
    SetStatus
} from "../../modals";

import { storage, sleep } from "../../functions";

export const EditProfile_Profile = (props) => {
    const { 
        style,
        navigation: {
            goBack,
            reset
        }
    } = props;

    const [ modalContent, setModalContent ] = useState(null);
    const [ authData, setAuthData ] = useState({});
    const [ snackbar, setSnackbar ] = useState(null);

    const modalRef = useRef();
    const snackbarRef = useRef();

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");
            setAuthData(authorizationData);
        })();
    }, []);

    const changePhoto = async () => {
        const pickImage = await launchImageLibrary({
            mediaType: "photo"
        });

        if(pickImage.didCancel) return;
        if(pickImage.assets[0].fileSize > 5242880) {
            setSnackbar({ 
                text: "Максимальный размер изображения - 5MB",
                before: (
                    <Icon
                    name="md-images-outline"
                    type="Ionicons"
                    color="#fff"
                    size={17}
                    />
                )
            });

            snackbarRef?.current?.show();
            sleep(5).then(() => snackbarRef?.current?.hide());

            return;
        }

        setSnackbar({ 
            text: "Загрузка картинки на сервер, подождите немного...",
            before: (
                <ActivityIndicator size={17} color="#fff"/>
            )
        });
        snackbarRef?.current?.show();

        ImgToBase64.getBase64String(pickImage.assets[0].uri)
        .then(async (base64String) => {
            const { data } = await axios.post("/user.updateAvatar", {
                ...authData,
                picture: base64String
            });

            if(!data.success) {
                setSnackbar({ 
                    text: data.message,
                    before: (
                        <Icon
                        name="error-outline"
                        type="MaterialIcons"
                        color="#fff"
                        size={17}
                        />
                    )
                });

                sleep(5).then(() => snackbarRef?.current?.hide());

                return;
            }

            reset({
                index: 0,
                routes: [{name: "profile"}]
            });

            setSnackbar({ 
                text: "Успешно! Аватарка профиля обновлена",
                before: (
                    <Icon
                    name="checkmark-done"
                    type="Ionicons"
                    color="#fff"
                    size={17}
                    />
                )
            });

            sleep(5).then(() => snackbarRef?.current?.hide());
        })
        .catch(err => console.log(err));
    };

    return (
        <GestureHandlerRootView style={style.view}>
            <Header
            title="Редактировать профиль"
            subtitle="Профиль"
            height={30}
            backgroundColor={style.header_background_color}
            backButtonOnPress={() => goBack()}
            backButton
            style={style}
            />

            <Snackbar
            ref={snackbarRef}
            style={style}
            text={snackbar?.text}
            before={snackbar?.before}
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
                <View style={{marginTop: 10, paddingTop: 15}}/>

                <Cell
                style={style}
                title="Сменить аватарку"
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
                        name="photo-library"
                        type="MaterialIcons"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Загрузить с устройства"
                onPress={() => changePhoto()}
                />

                <View style={{marginTop: 5}} />

                <Cell
                style={style}
                title="Изменить никнейм"
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
                        name="user"
                        type="Feather"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Не нравится текущий никнейм? Просто смените его!"
                onPress={() => {
                    setModalContent(<ChangeNickname style={style} reset={reset} onClose={() => modalRef?.current?.hide()}/>);
                    modalRef?.current?.show();
                }}
                />

                <View style={{marginTop: 5}} />

                <Cell
                style={style}
                title="Редактировать статус"
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
                        name="pencil"
                        type="EvilIcons"
                        size={25}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Выразите свои мысли..."
                onPress={() => {
                    setModalContent(<SetStatus style={style} reset={reset} onClose={() => modalRef?.current?.hide()}/>);
                    modalRef?.current?.show();
                }}
                />
            </ScrollView>
        </GestureHandlerRootView>
    )
};