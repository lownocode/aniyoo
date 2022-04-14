import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";

import {
    Button,
    Cell,
    Input,
    Icon,
    PressIcon,
    Placeholder
} from "../components";
import { storage } from "../functions";

export const EmailConfirmation = props => {
    const { style, onClose } = props;

    const [ cellData, setCellData ] = useState({
        title: "Подтверждение личности",
        subtitle: "Введите текущую почту и пароль, чтобы мы могли знать, что аккаунт действительно Ваш"
    });
    const [ password, setPassword ] = useState("");
    const [ hidePassword, setHidePassword ] = useState(true);
    const [ passwordInputBadText, setPassowrdInputBadText ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ emailInputBadText, setEmailInputBadText ] = useState("");
    const [ step, setStep ] = useState("confirm");
    const [ authData, setAuthData ] = useState({});
    const [ code, setCode ] = useState(null);
    const [ codelInputBadText, setCodelInputBadText ] = useState("");

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");
            setAuthData(authorizationData);
        })();
    }, []);

    const confirmAuthData = async () => {
        if(authData.password.split(" ").join("") !== password.split(" ").join("")) {
            setPassowrdInputBadText("Пароль введён неверно!");
        } else {
            setPassowrdInputBadText("");
        }

        if(authData.email !== email) {
            return setEmailInputBadText("Почта введена неверно!");
        } 

        const { data } = await axios.post("/user.verifyEmail", authData);
        if(!data.success) {
            if(data.code === 1) {
                setCellData({
                    title: "Успешно!",
                    subtitle: `Шестизначный код отправлен на почту ${authData.email}, введите его ниже в течение 15 минут. Проверьте папку «Спам» в Вашей почте, возможно, наше письмо попало туда`
                });
                return setStep("enter_code");
            }
            return setCellData({
                title: "Ошибка",
                subtitle: data.message
            });
        }

        setCellData({
            title: "Успешно!",
            subtitle: `Шестизначный код успешно отправлен на почту ${authData.email}, введите его ниже в течение 15 минут`
        });
        return setStep("enter_code");
    };

    const hideEmail = (email = "") => {
        if(!email) {
            return "..."
        }

        const selectors = email.split("@");

        return selectors[0]
        .substring(0, 1) + "*"
        .repeat(selectors[0].length - 2) + selectors[0]
        .substring(selectors[0].length, selectors[0].length - 1) + "@" + selectors[1];
    };

    const sendCode = async () => {
        const { data } = await axios.post("/user.verifyEmail", {
            ...authData,
            type: "enter_code",
            confirmation_code: code
        });

        if(!data.success) {
            return setCellData({
                title: "Ошибка",
                subtitle: data.message
            });
        }

        setCellData({title: "", subtitle: ""});
        setStep("email_verified");
    };

    const renderConfirmStep = () => (
        <View 
        style={{
            margin: 10
        }}
        >
            <Input
            style={style}
            placeholder="Введите почту"
            onChangeText={text => setEmail(text)}
            value={email}
            badText={emailInputBadText}
            type="email-address"
            />

            <Input
            style={style}
            placeholder="Введите пароль"
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
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={hidePassword}
            badText={passwordInputBadText}
            />

            <Text style={{color: style.text_color}}>
                Подсказка для почты: {hideEmail(authData.email)}
            </Text>
            <Button
            style={style}
            title="Получить код"
            upperTitle={false}
            containerStyle={{margin: 0, marginTop: 10}}
            onPress={() => confirmAuthData()}
            />
        </View>
    );

    const renderEnterCodeStep = () => (
        <View
        style={{
            margin: 10
        }}
        >
            <Input
            style={style}
            placeholder="Введите полученный код"
            onChangeText={text => setCode(text)}
            value={code}
            badText={codelInputBadText}
            textAlign="center"
            />

            <View
            style={{
                flexDirection: "row"
            }}
            >
                <View>
                    <Button
                    style={style}
                    title="Назад"
                    upperTitle={false}
                    containerStyle={{margin: 0, marginTop: 10 }}
                    textStyle={{paddingHorizontal: 10}}
                    onPress={() => setStep("confirm")}
                    type="outline"
                    beforeIcon={{
                        name: "chevron-thin-left",
                        type: "Entypo",
                        style: {
                            marginRight: 0
                        }
                    }}
                    />
                </View>
                <Button
                style={style}
                title="Отправить код"
                upperTitle={false}
                containerStyle={{margin: 0, marginTop: 10, marginLeft: 10}}
                onPress={() => sendCode()}
                />
            </View>
        </View>
    );

    const renderEmailVerified = () => (
        <View
        style={{
            marginBottom: 20,
            marginTop: 10
        }}
        >
            <Placeholder
            style={style}
            title="Успешно!"
            subtitle="Ваша почта успешно подтверждена!"
            button={
                <Button
                style={style}
                type="outline"
                upperTitle={false}
                title="Закрыть"
                beforeIcon={{
                    name: "close",
                    type: "AntDesign"
                }}
                onPress={() => onClose()}
                />
            }
            icon={
                <Icon
                name="checkcircleo"
                type="AntDesign"
                size={30}
                color="#00cc00"
                />
            }
            />
        </View>
    );

    return (
        <ScrollView>
            <Cell
            style={style}
            title={cellData.title}
            subtitle={cellData.subtitle}
            centered
            containerStyle={{
                marginTop: 0
            }}
            disabled
            />

            {
                step === "confirm" ? renderConfirmStep() :
                step === "enter_code" ? renderEnterCodeStep() : 
                step === "email_verified" ? renderEmailVerified() : null
            }
        </ScrollView>
    )
};