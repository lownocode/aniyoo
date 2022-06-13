import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Keyboard } from "react-native";
import axios from "axios";

import {
    Button,
    Cell,
    Input,
    Overlay,
    Icon,
    Snackbar
} from "../components";
import { storage, sleep } from "../functions";

export const ChangeNickname = (props) => {
    const { style, reset, onClose } = props;

    const [ authData, setAuthData ] = useState({});
    const [ nickname, setNickname ] = useState();
    const [ snackbar, setSnackbar ] = useState({ open: false });

    const snackbarRef = useRef();

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");
            setAuthData(authorizationData);

            const { data } = await axios.post("/user.signIn", authorizationData);
            setNickname(data.user_data.nickname);
        })();
    }, []);

    const requestToChange = async () => {
        setSnackbar({ 
            text: "Изменение никнейма...",
            before: (
                <ActivityIndicator size={17} color="#fff"/>
            )
        });
        
        snackbarRef?.current?.show();
        sleep(3).then(() => snackbarRef?.current?.hide());

        const { data } = await axios.post("/user.changeNickname", {
            ...authData,
            nickname: nickname
        });

        if(!data.success) {
            return setSnackbar({
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
        }

        reset({
            index: 0,
            routes: [{name: "profile"}]
        });
        setSnackbar({
            text: data.message,
            before: (
                <Icon
                name="checkmark-done"
                type="Ionicons"
                color="#fff"
                size={17}
                />
            )
        });

        Keyboard.dismiss();

        snackbarRef?.current?.show();
        sleep(3).then(() => snackbarRef?.current?.hide());
    };

    return (
        <View>
            <Snackbar
            text={snackbar.text}
            before={snackbar.before}
            ref={snackbarRef}
            />

            <Cell
            title="Смена никнейма"
            subtitle="Пользователи без примиума могут менять никнейм 1 раз в неделю, однако с ним пользователи могут менять никнейм каждый час"
            centered
            containerStyle={{
                marginTop: 0
            }}
            disabled
            />
            <View 
            style={{
                margin: 10
            }}
            >
                <Input
                style={style}
                placeholder="Введите новый никнейм"
                onChangeText={text => setNickname(text)}
                value={nickname}
                />

                <View style={{flexDirection: "row"}}>
                    <Button
                    style={style}
                    title="Закрыть"
                    type="outline"
                    upperTitle={false}
                    containerStyle={{margin: 0, marginRight: 8}}
                    onPress={() => onClose()}
                    />
                    
                    <Button
                    style={style}
                    title="Изменить никнейм"
                    upperTitle={false}
                    containerStyle={{margin: 0}}
                    onPress={() => requestToChange()}
                    />
                </View>
            </View>
        </View>
    )
};