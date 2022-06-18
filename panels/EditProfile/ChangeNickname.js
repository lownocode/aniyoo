import React, { useContext, useState, useRef, useEffect } from "react";
import { ScrollView, Text, View, Keyboard } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventRegister } from "react-native-event-listeners";

import {
    Header,
    Avatar,
    Divider,
    ContentHeader,
    Button,
    Input,
    Placeholder,
    Icon,
    Snackbar
} from "../../components";

import {
    storage,
    sleep
} from "../../functions";

import ThemeContext from "../../config/ThemeContext";
import axios from "axios";

export const EditProfile_ChangeNickname = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            state
        },
        navigation
    } = props;

    const [ userData, setUserData ] = useState({
        nickname: "Загрузка...",
        photo: ""
    });
    const [ newNickname, setNewNickname ] = useState("");
    const [ snackbar, setSnackbar ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const snackbarRef = useRef();

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/user.signIn", {
            nickname: newNickname
        }, {
            headers: {
                'Authorization': sign
            }
        })
        .then(({ data }) => {
            setUserData({
                nickname: data.nickname,
                photo: data.photo
            })
        })
        .catch(({ response: { data }}) => {
            console.log(data);
        });
    };
    useEffect(() => {
        getUserData();
    }, []);

    const updateNickname = async () => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/settings.changeNickname", {
            nickname: newNickname
        }, {
            headers: {
                'Authorization': sign
            }
        })
        .then(({ data }) => {
            const newUserData = Object.defineProperty(userData, "nickname", { value: newNickname });
            setUserData(newUserData);
            setNewNickname("");

            setSnackbar({
                text: data?.message,
                before: <Icon
                name="check"
                type="Feather"
                color="#00cc00"
                size={20}
                />
            });

            snackbarRef.current.show();
            sleep(5).then(() => snackbarRef?.current?.hide());
        })
        .catch(({ response: { data }}) => {
            setSnackbar({
                text: data?.message,
                before: <Icon
                name="error-outline"
                type="MaterialIcons"
                color="orangered"
                size={20}
                />
            });

            snackbarRef.current.show();
            sleep(5).then(() => snackbarRef?.current?.hide());
        })
        .finally(() => {
            setLoading(false);
            Keyboard.dismiss();
        });
    };
    
    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Смена никнейма"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <Snackbar
            ref={snackbarRef}
            text={snackbar?.text}
            before={snackbar?.before}
            />

            <ScrollView>
                <View
                style={{
                    marginVertical: 30
                }}
                >
                    <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Avatar
                        url={userData?.photo}
                        size={80}
                        />
                    </View>

                    <Text
                    style={{
                        textAlign: "center",
                        color: theme.text_color,
                        fontSize: 24,
                        fontWeight: "700",
                        marginHorizontal: 15
                    }}
                    >
                        {
                            userData?.nickname || "Загрузка..."
                        }
                    </Text>

                    <Text
                    style={{
                        fontSize: 13,
                        color: theme.text_secondary_color,
                        textAlign: "center"
                    }}
                    >
                        Ваш текущий никнейм
                    </Text>
                </View>

                <Divider />

                <View>
                    {/* <View
                    style={{
                        backgroundColor: theme.divider_color + "70",
                        padding: 10,
                        margin: 15,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.divider_color
                    }}
                    >
                        <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 19,
                            color: theme.text_color
                        }}
                        >
                            Обратите внимание!
                        </Text>

                        <Text
                        style={{
                            color: theme.text_secondary_color
                        }}
                        >
                            Пользователи с Premium могут менять свой никнейм раз в день, а пользователи без подписки - раз в неделю.
                        </Text>

                        <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10
                        }}
                        >
                            <Button
                            title="Premium"
                            upperTitle={false}
                            containerStyle={{
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0
                            }}
                            />

                            <Button
                            title="Скрыть"
                            upperTitle={false}
                            type="overlay"
                            containerStyle={{
                                marginBottom: 0,
                                marginRight: 0
                            }}
                            />
                        </View>
                    </View> */}

                    <View
                    style={{
                        margin: 15,
                        marginTop: 0
                    }}
                    >
                        <Input
                        placeholder="Новый никнейм"
                        before={
                            <Icon
                            type="EvilIcons"
                            name="pencil"
                            size={25}
                            color={theme.icon_color}
                            />
                        }
                        value={newNickname}
                        onChangeText={(value) => setNewNickname(value)}
                        />

                        <Button
                        title="Сменить никнейм"
                        containerStyle={{
                            marginHorizontal: 0
                        }}
                        upperTitle={false}
                        onPress={() => updateNickname()}
                        loading={loading}
                        />
                    </View>

                    <View>
                        <ContentHeader
                        text="История изменений"
                        indents
                        />

                        <Placeholder
                        icon={
                            <Icon
                            type="Ionicons"
                            name="ios-document-text-outline"
                            color={theme.icon_color}
                            size={40}
                            />
                        }
                        title="Здесь ничего нет"
                        subtitle="С момента регистрации Вы ещё ни разу не изменили свой никнейм."
                        />
                    </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    )
};