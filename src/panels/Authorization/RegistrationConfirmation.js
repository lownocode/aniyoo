import React, { useContext, useRef, useState } from "react";
import { View, Text, TextInput, Keyboard, ToastAndroid } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import {
    Header, 
    Icon,
    Button
} from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { storage, normalizeSize } from "../../functions";

export const AuthorizationRegistrationConfirmation = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const {
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const [ loading, setLoading ] = useState(false);
    const [ values, setValues ] = useState({ 1: "", 2: "", 3: "", 4: "" });

    const renderInputs = () => {
        const unselectColor = theme.divider_color;
        const selectColor = theme.accent;

        const [ selectInput, setSelectInput ] = useState(0);

        const value1Ref = useRef();
        const value2Ref = useRef();
        const value3Ref = useRef();
        const value4Ref = useRef();

        return (
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 45
            }}
            >
                <TextInput
                placeholder={selectInput === null ? values[1] : "✱"}
                value={values[1]}
                ref={value1Ref}
                textAlign="center"
                style={{
                    width: normalizeSize(30),
                    height: normalizeSize(40),
                    borderRadius: 8,
                    borderColor: selectInput === 1 ? selectColor : unselectColor,
                    borderWidth: 1.3,
                    marginRight: 15,
                    color: theme.text_color
                }}
                maxLength={1}
                keyboardType="number-pad"
                onFocus={() => setSelectInput(1)}
                selectionColor={theme.accent}
                onChange={(e) => {
                    setValues({ ...values, 1: e.nativeEvent.text });
                    if(e.nativeEvent.text.length === 1) {
                        return value2Ref.current?.focus();
                    }
                }}
                />

                <TextInput
                placeholder={selectInput === 2 ? null : "✱"}
                textAlign="center"
                value={values[2]}
                ref={value2Ref}
                style={{
                    width: normalizeSize(30),
                    height: normalizeSize(40),
                    borderRadius: 8,
                    borderColor: selectInput === 2 ? selectColor : unselectColor,
                    borderWidth: 1.3,
                    marginRight: 15,
                    color: theme.text_color
                }}
                maxLength={1}
                keyboardType="number-pad"
                onFocus={() => setSelectInput(2)}
                selectionColor={theme.accent}
                onChange={(e) => {
                    setValues({ ...values, 2: e.nativeEvent.text });
                    if(e.nativeEvent.text.length === 1) {
                        return value3Ref.current?.focus();
                    }

                    value1Ref.current?.focus();
                }}
                />

                <TextInput
                placeholder={selectInput === 3 ? null : "✱"}
                textAlign="center"
                value={values[3]}
                ref={value3Ref}
                style={{
                    width: normalizeSize(30),
                    height: normalizeSize(40),
                    borderRadius: 8,
                    borderColor: selectInput === 3 ? selectColor : unselectColor,
                    borderWidth: 1.3,
                    marginRight: 15,
                    color: theme.text_color
                }}
                maxLength={1}
                keyboardType="number-pad"
                onFocus={() => setSelectInput(3)}
                selectionColor={theme.accent}
                onChange={(e) => {
                    setValues({ ...values, 3: e.nativeEvent.text });
                    if(e.nativeEvent.text.length === 1) {
                        return value4Ref.current?.focus();
                    }

                    value2Ref.current?.focus();
                }}
                />

                <TextInput
                placeholder={selectInput === 4 ? null : "✱"}
                textAlign="center"
                value={values[4]}
                ref={value4Ref}
                style={{
                    width: normalizeSize(30),
                    height: normalizeSize(40),
                    borderRadius: 8,
                    borderColor: selectInput === 4 ? selectColor : unselectColor,
                    borderWidth: 1.3,
                    color: theme.text_color
                }}
                maxLength={1}
                keyboardType="number-pad"
                onFocus={() => setSelectInput(4)}
                selectionColor={theme.accent}
                onChange={(e) => {
                    setValues({ ...values, 4: e.nativeEvent.text });
                    if(e.nativeEvent.text.length === 1) {
                        setSelectInput(0);
                        Keyboard.dismiss();
                        return //registration();
                    } 

                    value3Ref.current?.focus();
                }}
                />
            </View>
        )
    };

    const registration = () => {
        setLoading(true);

        const code = Object.values(values).join("");

        axios.post("/users.registration", {
            email: route.params?.email,
            confirmation_code: code
        })
        .then(({ data }) => {
            storage.setItem("AUTHORIZATION_SIGN", data.user.sign);
            navigate("tabs", { userData: data.user });
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        }).finally(() => setLoading(false));
    };
    
    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Подтверждение регистрации"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
            }}
            >
                <Icon
                name="authentication-lock"
                size={105}
                />

                <Text
                style={{
                    color: theme.text_color,
                    fontSize: normalizeSize(20),
                    fontWeight: "500",
                    marginHorizontal: 15,
                    textAlign: "center"
                }}
                >
                    Введите код
                </Text>
                <Text
                style={{
                    textAlign: "center",
                    color: theme.text_secondary_color,
                    marginHorizontal: 15
                }}
                >
                    На указанный электронный адрес <Text style={{ color: theme.accent, fontWeight: "500" }}>{route.params?.email}</Text> был отправлен код подтверждения, пожалуйста, введите его ниже для завершения регистрации. Если в основной почте нет письма, проверьте папку «Спам»
                </Text>

                {renderInputs()}
            </View>

            <View>
                <Button
                onPress={() => registration()}
                disabled={loading}
                loading={loading}
                title="Зарегистрироваться"
                backgroundColor={theme.accent}
                textColor="#ffffff"
                />
            </View>
        </View>
    )
};