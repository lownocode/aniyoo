import React, { useState, useRef, useContext } from "react";
import { View, Text, ScrollView, Image, Keyboard } from "react-native";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
    Button,
    Divider,
    Input,
    Icon,
    PressIcon,
    Snackbar
} from "../components";
import {
    storage,
    sleep
} from "../functions";

import ThemeContext from "../config/ThemeContext";
import appLogo from "../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png";

export const Authorization = props => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            navigate,
        },
        navigation
    } = props;

    const [ authType, setAuthType ] = useState("signin");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ nickname, setNickname ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ hideSignInPassword, setHideSignInPassword ] = useState(true);
    const [ hideSignUpPassword, setHideSignUpPassword ] = useState(true);
    const [ snackbar, setSnackbar ] = useState(null);

    const snackbarRef = useRef();

    const signIn = async () => {
        setLoading(true);
        
        axios.post("/user.signIn", {
            email: email,
            password: password
        })
        .then(({ data }) => {
            storage.setItem("AUTHORIZATION_SIGN", data.sign);

            setLoading(false);
            navigation.reset({
                index: 0,
                routes: [{name: "tabs"}]
            });
            navigate("tabs");
        })
        .catch(({ response: { data } }) => {
            setLoading(false);
            setSnackbar({
                text: data?.message || "Неизвестная ошибка",
                before: <Icon
                name="error-outline"
                type="MaterialIcons"
                color="orangered"
                size={20}
                />
            });

            snackbarRef.current.show();
            sleep(5).then(() => snackbarRef?.current?.hide());
        });
    };

    const registration = async () => {
        setLoading(true);

        axios.post("/user.registration", {
            email: email,
            password: password,
            nickname: nickname
        })
        .then(({ data }) => {
            storage.setItem("AUTHORIZATION_SIGN", data.sign);

            setLoading(false);
            navigation.reset({
                index: 0,
                routes: [{name: "tabs"}]
            });
            navigate("tabs");
        })
        .catch(({ response: { data } }) => {
            setLoading(false);
            setSnackbar({
                text: data.message,
                before: <Icon
                name="error-outline"
                type="MaterialIcons"
                color="orangered"
                size={20}
                />
            });

            snackbarRef.current.show();
            sleep(5).then(() => snackbarRef?.current?.hide());
        });
    }; 
    
    const renderSignIn = () => (
        <View>
            <View
            style={{
                padding: 10,
                marginTop: 10
            }}
            >
                <Input
                placeholder="Адрес электронной почты"
                before={
                    <Icon
                    type="Entypo"
                    name="email"
                    size={17}
                    color={theme.icon_color}
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
                placeholder="Пароль"
                type={!hideSignInPassword ? "visible-password" : "default"}
                before={
                    <Icon
                    type="Feather"
                    name="lock"
                    size={17}
                    color={theme.icon_color}
                    />
                }
                after={
                    <PressIcon
                    onPress={() => setHideSignInPassword(!hideSignInPassword)}
                    icon={
                        hideSignInPassword ? (
                            <Icon
                            type="Ionicons"
                            name="eye-outline"
                            size={19}
                            color={theme.icon_color}
                            />
                        ) : (
                            <Icon
                            type="Ionicons"
                            name="eye-off-outline"
                            size={19}
                            color={theme.icon_color}
                            />
                        )
                        
                    }
                    />
                }
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry={hideSignInPassword}
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
                <Text 
                style={{
                    color: theme.accent, 
                    textDecorationLine: "underline",
                    marginRight: 50
                }}
                >
                    Восстановить пароль
                </Text>
                
                <Button
                title="Войти"
                upperTitle={false}
                textColor="#fff"
                backgroundColor={theme.accent}
                onPress={() => {
                    Keyboard.dismiss();
                    signIn();
                }}
                loading={loading}
                containerStyle={{
                    marginRight: 0
                }}
                />
            </View>
        </View>
    );

    const renderRegistration = () => (
        <View>
            <View
            style={{
                padding: 10,
                marginTop: 10
            }}
            >
                <Input
                placeholder="Ваш никнейм"
                before={
                    <Icon
                    type="AntDesign"
                    name="user"
                    size={17}
                    color={theme.icon_color}
                    />
                }
                onChangeText={text => setNickname(text)}
                value={nickname}
                inputStyle={{
                    backgroundColor: "transparent"
                }}
                />

                <Input
                placeholder="Адрес электронной почты"
                before={
                    <Icon
                    type="Entypo"
                    name="email"
                    size={17}
                    color={theme.icon_color}
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
                placeholder="Пароль"
                before={
                    <Icon
                    type="Feather"
                    name="lock"
                    size={17}
                    color={theme.icon_color}
                    />
                }
                onChangeText={text => setPassword(text)}
                value={password}
                inputStyle={{
                    backgroundColor: "transparent"
                }}
                type={!hideSignUpPassword ? "visible-password" : "default"}
                after={
                    <PressIcon
                    onPress={() => setHideSignUpPassword(!hideSignUpPassword)}
                    icon={
                        hideSignUpPassword ? (
                            <Icon
                            type="Ionicons"
                            name="eye-outline"
                            size={19}
                            color={theme.icon_color}
                            />
                        ) : (
                            <Icon
                            type="Ionicons"
                            name="eye-off-outline"
                            size={19}
                            color={theme.icon_color}
                            />
                        )
                        
                    }
                    />
                }
                secureTextEntry={hideSignUpPassword}
                />
            </View>

            <Button
            title="Зарегистрироваться"
            upperTitle={false}
            textColor="#fff"
            backgroundColor="#04b84f"
            onPress={() => {
                Keyboard.dismiss();
                registration();
            }}
            loading={loading}
            />
        </View>
    );

    return (
        <GestureHandlerRootView 
        style={{
            backgroundColor: theme.background_content, 
            flex: 1,
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between"
        }}
        >
            <Snackbar
            ref={snackbarRef}
            text={snackbar?.text}
            before={snackbar?.before}
            />

            <View>
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
                        height: 100,
                    }}
                    />  
                </View> 

                <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: theme.text_color,
                    fontWeight: "500",
                }}
                >
                    {
                        authType === "signin" ? "Вход в аккаунт"
                        : authType === "registration" && "Регистрация аккаунта"
                    }
                </Text>

                {
                    authType === "signin" ? renderSignIn() 
                    : authType === "registration" && renderRegistration()
                }
            </View>
            
            <View
            style={{
                marginBottom: 15
            }}
            >
                <Button
                title={
                    authType === "signin" ? "Зарегистрироваться"
                    : authType === "registration" && "Войти"
                }
                size={45}
                upperTitle={false}
                onPress={() => {
                    authType === "signin" ? setAuthType("registration")
                    : authType === "registration" && setAuthType("signin")
                }}
                backgroundColor={
                    authType === "signin" ? "#04b84f"
                    : authType === "registration" && theme.accent
                }
                />
            </View>
        </GestureHandlerRootView>
    )
};