import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import axios from "axios";

import {
    Button,
    Divider,
    Input,
    Icon,
    PressIcon,
} from "../components";
import {
    storage
} from "../functions";
import appLogo from "../android/app/src/main/res/mipmap/ic_launch_screen.png";

export const Authorization = props => {
    const { 
        style,
        navigation: {
            navigate,
        },
        navigation
    } = props;

    const [ authType, setAuthType ] = useState("signin");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ nickname, setNickname ] = useState("");
    const [ error, setError ] = useState({ show: false });
    const [ loading, setLoading ] = useState(false);
    const [ hidePassword, setHidePassword ] = useState(true);

    const signIn = async () => {
        setLoading(true);
        const { data } = await axios.post("/user.signIn", {
            email: email,
            password: password
        });

        if(!data?.success) {
            setLoading(false);
            return setError({ show: true, message: data?.message });
        }

        storage.setItem("authorization_data", {
            email: email,
            password: password
        });
        storage.setItem("user_data", data.user_data);

        setLoading(false);
        setError({ show: false });
        navigation.reset({
            index: 0,
            routes: [{name: "tabs"}]
        });
        navigate("tabs");
    };

    const registration = async () => {
        setLoading(true);
        const { data } = await axios.post("/user.registration", {
            email: email,
            password: password,
            nickname: nickname
        });

        if(!data.success) {
            setLoading(false);
            return setError({ show: true, message: data.message });
        }

        storage.setItem("authorization_data", {
            email: email,
            password: password
        });
        storage.setItem("user_data", data.user_data);

        setLoading(false);
        setError({ show: false });
        navigation.reset({
            index: 0,
            routes: [{name: "tabs"}]
        });
        navigate("tabs");
    };  

    return (
        <ScrollView style={style.view}>
            <View 
            style={{
                alignItems: "center",
                marginTop: 100
            }}
            >
                <Image
                source={appLogo}
                style={{
                    width: 100,
                    height: 100
                }}
                />  
            </View> 

            <Text
            style={{
                fontSize: 20,
                textAlign: "center",
                color: style.text_color,
                fontWeight: "500"
            }}
            >
                {
                    authType === "signin"
                    ? "Вход в аккаунт"
                    : authType === "registration"
                    ? "Регистрация аккаунта"
                    : "Авторизация"
                }
            </Text>

            {
                authType === "signin" ? (
                    <View>
                        <View
                        style={{
                            padding: 10,
                            marginTop: 10
                        }}
                        >
                            <Input
                            style={style}
                            placeholder="Введите почту"
                            before={
                                <Icon
                                type="Entypo"
                                name="email"
                                size={17}
                                color={style.icon_color}
                                />
                            }
                            type="email-address"
                            onChangeText={text => setEmail(text)}
                            value={email}
                            inputStyle={{
                                backgroundColor: "transparent"
                            }}
                            />

                            <Input
                            style={style}
                            placeholder="Введите пароль"
                            type="visible-password"
                            before={
                                <Icon
                                type="Feather"
                                name="lock"
                                size={17}
                                color={style.icon_color}
                                />
                            }
                            after={
                                <PressIcon
                                style={style}
                                onPress={() => setHidePassword(!hidePassword)}
                                icon={
                                    hidePassword ? (
                                        <Icon
                                        type="Ionicons"
                                        name="eye-outline"
                                        size={19}
                                        color={style.icon_color}
                                        />
                                    ) : (
                                        <Icon
                                        type="Ionicons"
                                        name="eye-off-outline"
                                        size={19}
                                        color={style.icon_color}
                                        />
                                    )
                                    
                                }
                                />
                            }
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={hidePassword}
                            inputStyle={{
                                backgroundColor: "transparent"
                            }}
                            />
                        </View>

                        <View 
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginHorizontal: 10
                        }}
                        >
                            <Text style={{color: style.accent, maxWidth: "50%", textDecorationLine: "underline"}}>Восстановить пароль</Text>
                            <View>
                                <Button
                                style={style}
                                title="Войти"
                                upperTitle={false}
                                textColor="#fff"
                                backgroundColor={style.accent}
                                onPress={() => signIn()}
                                loading={loading}
                                buttonStyle={{
                                    width: 200
                                }}
                                containerStyle={{
                                    marginRight: 0
                                }}
                                />
                            </View>
                        </View>
                    </View>
                ) : authType === "registration" ? (
                    <View>
                        <View
                        style={{
                            padding: 10,
                            marginTop: 10
                        }}
                        >
                            <Input
                            style={style}
                            placeholder="Придумайте никнейм"
                            before={
                                <Icon
                                type="AntDesign"
                                name="user"
                                size={17}
                                color={style.icon_color}
                                />
                            }
                            onChangeText={text => setNickname(text)}
                            value={nickname}
                            inputStyle={{
                                backgroundColor: "transparent"
                            }}
                            />

                            <Input
                            style={style}
                            placeholder="Введите свою почту"
                            before={
                                <Icon
                                type="Entypo"
                                name="email"
                                size={17}
                                color={style.icon_color}
                                />
                            }
                            onChangeText={text => setEmail(text)}
                            value={email}
                            inputStyle={{
                                backgroundColor: "transparent"
                            }}
                            type="email-address"
                            />

                            <Input
                            style={style}
                            placeholder="Придумайте пароль"
                            before={
                                <Icon
                                type="Feather"
                                name="lock"
                                size={17}
                                color={style.icon_color}
                                />
                            }
                            onChangeText={text => setPassword(text)}
                            value={password}
                            inputStyle={{
                                backgroundColor: "transparent"
                            }}
                            type="visible-password"
                            after={
                                <PressIcon
                                style={style}
                                onPress={() => setHidePassword(!hidePassword)}
                                icon={
                                    hidePassword ? (
                                        <Icon
                                        type="Ionicons"
                                        name="eye-outline"
                                        size={19}
                                        color={style.icon_color}
                                        />
                                    ) : (
                                        <Icon
                                        type="Ionicons"
                                        name="eye-off-outline"
                                        size={19}
                                        color={style.icon_color}
                                        />
                                    )
                                    
                                }
                                />
                            }
                            secureTextEntry={hidePassword}
                            />
                        </View>

                        <Button
                        style={style}
                        title="Зарегистрироваться"
                        upperTitle={false}
                        textColor="#fff"
                        backgroundColor={style.accent}
                        onPress={() => registration()}
                        loading={loading}
                        />
                    </View>
                ) : null
            }

            <Divider
            style={style}
            dividerStyle={{
                marginTop: 10
            }}
            centerComponent={
                <Text 
                style={{
                    color: style.text_secondary_color, 
                    marginHorizontal: 10, 
                    marginTop: 10
                }}
                >
                    Или
                </Text>
            }
            />

            <View>
                <Button
                style={style}
                title={
                    authType === "signin"
                    ? "Зарегистрироваться"
                    : authType === "registration"
                    ? "Войти"
                    : ""
                }
                type="outline"
                upperTitle={false}
                onPress={() => {
                    authType === "signin"
                    ? setAuthType("registration")
                    : authType === "registration"
                    ? setAuthType("signin")
                    : null
                }}
                />
            </View>

            {
                error.show && (
                    <View 
                    style={{
                        backgroundColor: "#c90e3a30",
                        borderRadius: 10,
                        marginBottom: 10,
                        marginTop: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 10,
                        marginHorizontal: 10
                    }}
                    >
                        <Text 
                        style={{
                            fontSize: 18,
                            color: style.text_secondary_color
                        }}
                        >
                            Ошибка
                        </Text>
                        <Text 
                        style={{
                            fontSize: 12,
                            color: style.text_secondary_color
                        }}
                        >
                            {error.message || ""}
                        </Text>
                    </View>
                )
            }
        </ScrollView>
    )
};