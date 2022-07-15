import React, { useContext, useState, useRef, useEffect } from "react";
import { Text, View, Keyboard, ToastAndroid, TextInput, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import {
    Header,
    Avatar,
    ContentHeader,
    Button,
    Icon,
    PressIcon,
    Cell,
} from "../../components";

import {
    storage,
} from "../../functions";

import ThemeContext from "../../config/ThemeContext";
import axios from "axios";

export const EditProfileChangeNickname = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
        },
    } = props;

    const [ userData, setUserData ] = useState({
        nickname: "Загрузка...",
        photo: ""
    });
    const [ history, setHistory ] = useState([]);
    const [ newNickname, setNewNickname ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const inputRef = useRef();

    const getUserData = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/users.signIn", null, {
            headers: {
                'Authorization': sign
            }
        })
        .then(({ data }) => {
            setUserData({
                nickname: data.nickname,
                photo: data.photo
            });
        })
        .catch(({ response: { data }}) => {
            console.log(data);
        });
    };

    const getHistory = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/users.getNicknameHistory", null, {
            headers: {
                'Authorization': sign
            }
        })
        .then(({ data }) => {
            setHistory(data);
        })
        .catch(({ response: { data }}) => {
            console.log(data);
        });
    };

    useEffect(() => {
        getHistory();
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
            console.log(data)
            setNewNickname("");
            setHistory([data.newNickname, ...history]);

            ToastAndroid.show(data?.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data }}) => {
            ToastAndroid.show(data?.message, ToastAndroid.CENTER);
        })
        .finally(() => {
            setLoading(false);
            Keyboard.dismiss();
        });
    };

    const renderInput = () => {
        return (
            <View
            style={{
                backgroundColor: theme.divider_color,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                flex: 1
            }}
            >
                <View
                style={{
                    marginLeft: 15,
                    marginRight: 10
                }}
                >
                    <Icon
                    name="pencil-write"
                    color={theme.text_secondary_color}
                    />
                </View>

                <TextInput
                value={newNickname}
                placeholder="Введите новый никнейм"
                style={{
                    height: 45,
                    flex: 1,
                    color: theme.text_color
                }}
                placeholderTextColor={theme.text_secondary_color}
                onChangeText={setNewNickname}
                returnKeyType="done"
                autoComplete="username"
                selectionColor={theme.accent}
                ref={inputRef}
                />

                {
                    newNickname.length > 0 && (
                        <PressIcon
                        icon={
                            <Icon
                            name="backspace-outline"
                            type="Ionicons"
                            color={theme.text_secondary_color}
                            size={20}
                            />
                        }
                        containerStyle={{
                            marginHorizontal: 10
                        }}
                        onPress={() => {
                            inputRef.current?.focus();
                            setNewNickname("");
                        }}
                        />
                    )
                }
            </View>
        )
    };

    const renderHistory = ({ item }) => {
        return (
            <Cell
            onPress={() => setNewNickname(item.nickname)}
            title={item.nickname}
            subtitle={item.date ? dayjs().to(dayjs(item.date)) : "Указан при регистрации"}
            before={
                <View
                style={{
                    width: 45,
                    height: 45,
                    borderRadius: 10,
                    backgroundColor: theme.accent + "20",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                >
                    <Icon
                    name="pencil-write"
                    color={theme.accent}
                    />
                </View>
            }
            />
        )
    };
    
    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Смена никнейма"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <FlatList
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderHistory}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="always"
            ListHeaderComponent={(
                <View>
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

                    <View
                    style={{
                        margin: 15,
                        marginTop: 0
                    }}
                    >
                        {renderInput()}

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

                    <ContentHeader
                    indents
                    text="История изменений"
                    />
                </View>
            )}
            />
        </GestureHandlerRootView>
    )
};