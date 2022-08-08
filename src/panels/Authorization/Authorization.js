import React, { useState, useContext, useRef, useEffect } from "react";
import { 
    View, 
    ToastAndroid, 
    TextInput, 
    StatusBar, 
    TouchableNativeFeedback,
    Text,
    Animated,
    Easing
} from "react-native";
import axios from "axios";
import { EventRegister } from "react-native-event-listeners";

import {
    Button,
    Icon,
    PressIcon,
} from "../../components";
import {
    storage,
} from "../../functions";

import ThemeContext from "../../config/ThemeContext";

const Input = (props) => {
    const theme = useContext(ThemeContext);

    const {
        value,
        onChangeText,
        before,
        placeholder,
        secureTextEntry,
        secureTextChange,
        isPassword = false,
        autoComplete
    } = props;

    return (
        <View
        style={{
            backgroundColor: theme.divider_color,
            marginHorizontal: 15,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            marginBottom: 10,
        }}
        >
            {before}

            <TextInput
            value={value}
            placeholder={placeholder}
            style={{
                height: 45,
                flex: 1,
                color: theme.text_color
            }}
            autoComplete={autoComplete}
            placeholderTextColor={theme.text_secondary_color}
            onChangeText={onChangeText}
            selectionColor={theme.accent}
            secureTextEntry={secureTextEntry}
            />

            {
                value.length > 0 && (
                    <PressIcon
                    icon={
                        <Icon
                        name="backspace"
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginLeft: 10,
                        marginRight: isPassword ? 0 : 10
                    }}
                    onPress={() => onChangeText("")}
                    />
                )
            }

            {
                isPassword &&  (
                    <PressIcon
                    icon={
                        <Icon
                        name={secureTextEntry ? "eye" : "eye-outline"}
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginHorizontal: 10
                    }}
                    onPress={() => secureTextChange(!secureTextEntry)}
                    />
                )
            }
        </View>
    )
};

export const Authorization = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            navigate,
        },
    } = props;

    const [ mode, setMode ] = useState("signIn");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ nickname, setNickname ] = useState("");
    const [ secureSignInPassword, setSecureSignInPassword ] = useState(true);
    const [ secureRegistrationPassword, setSecureRegistrationPassword ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ switchWidth, setSwitchWidth ] = useState(0);

    const switchButtonPosition = useRef(new Animated.Value(2)).current;

    const signIn = () => {
        setLoading(true);
        
        axios.post("/users.signIn", {
            email: email,
            password: password
        })
        .then(({ data }) => {
            storage.setItem("AUTHORIZATION_SIGN", data?.sign);
            EventRegister.emit("app", {
                type: "changeAuthorized",
                value: true,
                user: data
            });
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        }).finally(() => setLoading(false));
    };

    const registrationNextStep = () => {
        setLoading(true);
        navigate("authorization.registration_confirmation", {
            email: email,
        });
        
        axios.post("/users.registration", {
            nickname: nickname,
            email: email,
            password: password,
        })
        .then(({ data }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
            navigate("authorization.registration_confirmation", {
                email: email,
            });
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        }).finally(() => setLoading(false));
    };

    const changeSwitch = (newSwitch, index) => {
        const toValue = index === 1 ? 2 : (switchWidth / index) - 2;
        
        Animated.timing(switchButtonPosition, {
            toValue: toValue,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.elastic(1)
        }).start();

        setMode(newSwitch);
    };
    
    return (
        <View 
        style={{
            backgroundColor: theme.background_content, 
            flex: 1,
            paddingTop: StatusBar.currentHeight + 30
        }}
        >
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 30
            }}
            >
                <Icon
                name="logo"
                size={100}
                />
            </View>

            <View 
            onLayout={(e) => setSwitchWidth(e.nativeEvent.layout.width)}
            style={{ 
                flexDirection: "row", 
                justifyContent: "center", 
                alignItems: "center", 
                backgroundColor: theme.divider_color + "50",
                marginHorizontal: 15,
                borderRadius: 10,
                height: 45,
            }}
            >
                <Animated.View
                style={{
                    backgroundColor: theme.accent,
                    borderRadius: 10,
                    position: "absolute",
                    height: 40,
                    width: "50%",
                    left: switchButtonPosition,
                }}
                />

                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    flex: 1,
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.accent + "50", false)}
                    onPress={() => changeSwitch("signIn", 1)}
                    disabled={mode === "signIn" || loading}
                    >
                        <View style={{ height: 45, justifyContent: "center" }}>
                            <Text
                            style={{
                                textAlign: "center",
                                fontWeight: "700",
                                fontSize: 15,
                                color: mode === "signIn" ? "#fff" : theme.text_secondary_color,
                            }}
                            >
                                Вход
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    flex: 1,
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.accent + "50", false)}
                    onPress={() => changeSwitch("registration", 2)}
                    disabled={mode === "registration" || loading}
                    >
                        <View style={{ height: 45, justifyContent: "center" }}>
                            <Text
                            style={{
                                textAlign: "center",
                                fontWeight: "500",
                                fontSize: 15,
                                color: mode === "registration" ? "#fff" : theme.text_secondary_color,
                            }}
                            >
                                Регистрация
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>

            <View 
            style={{
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1
            }}
            >
                {
                    mode === "signIn" ? (
                        <View>
                            <View style={{ marginTop: 25 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Input
                                    placeholder="Ваш email или никнейм"
                                    autoComplete="email"
                                    value={email}
                                    before={
                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        >
                                            <Icon
                                            name="email"
                                            color={theme.icon_color}
                                            size={17}
                                            />
                                        </View>
                                    }
                                    onChangeText={setEmail}
                                    />
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <Input
                                    placeholder="Ваш пароль"
                                    autoComplete="password"
                                    value={password}
                                    before={
                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        >
                                            <Icon
                                            name="shield-security"
                                            color={theme.icon_color}
                                            size={17}
                                            />
                                        </View>
                                    }
                                    onChangeText={setPassword}
                                    secureTextEntry={secureSignInPassword}
                                    secureTextChange={setSecureSignInPassword}
                                    isPassword
                                    />
                                </View>
                            </View>

                            <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginHorizontal: 15,
                                marginTop: 5
                            }}
                            >
                                <Text
                                numberOfLines={2}
                                style={{
                                    color: theme.text_secondary_color,
                                    marginRight: 15,
                                    textAlign: "center"
                                }}
                                >
                                    {`Восстановить\nпароль`}
                                </Text>

                                <Button
                                title="Войти"
                                containerStyle={{
                                    marginRight: 0
                                }}
                                textColor="#ffffff"
                                backgroundColor={theme.accent}
                                onPress={() => signIn()}
                                loading={loading}
                                disabled={!email || !password}
                                />
                            </View>
                        </View>
                    ) : mode === "registration" ? (
                        <View>
                            <View style={{ marginTop: 25 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Input
                                    placeholder="Ваш никнейм"
                                    autoComplete="username"
                                    value={nickname}
                                    before={
                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        >
                                            <Icon
                                            name="alphabet"
                                            color={theme.icon_color}
                                            size={17}
                                            />
                                        </View>
                                    }
                                    onChangeText={setNickname}
                                    />
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <Input
                                    placeholder="Ваш email"
                                    autoComplete="email"
                                    value={email}
                                    before={
                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        >
                                            <Icon
                                            name="email"
                                            color={theme.icon_color}
                                            size={17}
                                            />
                                        </View>
                                    }
                                    onChangeText={setEmail}
                                    />
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <Input
                                    placeholder="Ваш пароль"
                                    value={password}
                                    autoComplete="password"
                                    before={
                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        >
                                            <Icon
                                            name="shield-security"
                                            color={theme.icon_color}
                                            size={17}
                                            />
                                        </View>
                                    }
                                    onChangeText={setPassword}
                                    secureTextEntry={secureRegistrationPassword}
                                    secureTextChange={setSecureRegistrationPassword}
                                    isPassword
                                    />
                                </View>
                            </View>

                            <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginHorizontal: 15,
                                marginTop: 5
                            }}
                            >
                                <Text
                                numberOfLines={2}
                                style={{
                                    color: theme.text_secondary_color,
                                    marginRight: 15,
                                    textAlign: "center"
                                }}
                                >
                                    {`Восстановить\nпароль`}
                                </Text>

                                <Button
                                title="Продолжить"
                                onPress={() => registrationNextStep()}
                                containerStyle={{
                                    marginRight: 0
                                }}
                                textColor="#ffffff"
                                backgroundColor={theme.accent}
                                loading={loading}
                                disabled={!email || !password || !nickname}
                                />
                            </View>
                        </View>
                    ) : null
                }
                
                <View
                style={{
                    marginBottom: 10,
                    flexDirection: "row"
                }}
                >
                    <Button
                    title="ВКонтакте"
                    textColor={theme.text_color}
                    backgroundColor={theme.divider_color}
                    type="outline"
                    containerStyle={{
                        marginRight: 0,
                        flex: 1
                    }}
                    before={
                        <Icon
                        name="vk"
                        size={17}
                        color="#0062ff"
                        />
                    }
                    />

                    <Button
                    title="Google"
                    textColor={theme.text_color}
                    backgroundColor={theme.divider_color}
                    type="outline"
                    before={
                        <Icon
                        name="google-logo"
                        size={17}
                        />
                    }
                    containerStyle={{
                        flex: 1
                    }}
                    />
                </View>
            </View>
        </View>
    )
};