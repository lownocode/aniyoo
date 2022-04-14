import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { 
    Header,
    Cell,
    Icon,
    BottomModal,
    Snackbar,
    Button
} from "../../components";
import { EmailConfirmation } from "../../modals";

import { storage, sleep } from "../../functions";

export const EditProfile_Security = (props) => {
    const { 
        style,
        navigation: {
            goBack,
            reset
        }
    } = props;

    const [ userData, setUserData ] = useState({});
    const [ modalContent, setModalContent ] = useState(null);
    const [ authData, setAuthData ] = useState({});
    const [ snackbar, setSnackbar ] = useState(null);

    const modalRef = useRef();
    const snackbarRef = useRef();

    const getUserData = async () => {
        const authorizationData = await storage.getItem("authorization_data");

        const { data } = await axios.post("/user.signIn", authorizationData);
        setUserData(data.user_data);
    };

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");
            setAuthData(authorizationData);
        })();
        getUserData();
    }, []);

    const warningsRender = () => {
        if(!userData?.email_verified) {
            return (
                <View
                style={{
                    margin: 10,
                    borderRadius: 10,
                    backgroundColor: style.divider_color + "30",
                    borderWidth: 0.5,
                    borderColor: style.divider_color
                }}
                >
                    <Cell
                    style={style}
                    title="Подтвердите почту!"
                    subtitle="В качестве защиты аккаунта Вы можете подтвердить свой адрес электронной почты. В случае потери пароля Вы легко сможете его восстановить!"
                    containerStyle={{
                        marginTop: 0
                    }}
                    disabled
                    />

                    <View style={{width: "50%"}}>
                        <Button
                        style={style}
                        title="Подтвердить"
                        upperTitle={false}
                        onPress={() => {
                            setModalContent(<EmailConfirmation style={style} onClose={() => {
                                getUserData();
                                modalRef?.current?.hide();
                                setModalContent(null);
                            }}/>);
                            modalRef?.current?.show();
                        }}
                        />
                    </View>
                </View>
            )
        }
    };

    return (
        <GestureHandlerRootView style={style.view}>
            <Header
            title="Редактировать профиль"
            subtitle="Безопасность"
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
                <View style={{paddingTop: 15}}/>
                {warningsRender()}

                <Cell
                style={style}
                title="Изменить пароль"
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
                        name="lock"
                        type="Feather"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Держите свой аккаунт в безопасности"
                />

                <View style={{marginTop: 5}}/>

                <Cell
                style={style}
                title="Изменить почту"
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
                        name="email"
                        type="Entypo"
                        size={20}
                        color={style.accent}
                        />
                    </View>
                }
                subtitle="Почта - единственный вариант для восстановления пароля"
                />
            </ScrollView>
        </GestureHandlerRootView>
    )
};