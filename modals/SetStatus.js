import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";

import {
    Button,
    Cell,
    Input
} from "../components";
import { storage } from "../functions";

export const SetStatus = (props) => {
    const { style, onClose, navigation } = props;
    
    const [ text, setText ] = useState("");
    const [ authData, setAuthData ] = useState({});
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");
            
            const { data } = await axios.post("/user.signIn", authorizationData);

            setAuthData(authorizationData);
            setText(data.user_data.status);
        })();
    }, []);

    const setStatus = async () => {
        setLoading(true);
        await axios.post("/user.setStatus", {
            ...authData,
            status: text
        });

        onClose();
        navigation.reset({
            index: 0,
            routes: [{name: "profile"}]
        });
        setLoading(false);
    };

    return (
        <View>
            <Cell
            style={style}
            title="Редактирование статуса"
            subtitle="Максимальное количество символов в статусе - 100, но при этом максимальное число строк - 3"
            disabled
            containerStyle={{marginTop: 0}}
            />

            <View
            style={{
                marginHorizontal: 10
            }}
            >
                <Input
                style={style}
                placeholder="Введите свой статус"
                multiline
                height={100}
                textAlignVertical="top"
                value={text}
                onChangeText={(text) => setText(text)}
                maxLength={100}
                />

                <Text
                style={{
                    marginTop: -5,
                    textAlign: "right",
                    marginRight: 5,
                    fontSize: 10 + text.length / 20,
                    color: style.text_color
                }}
                >
                    {text.length} / 100
                </Text>
            </View>

            <View style={{flexDirection: "row"}}>
                <Button
                style={style}
                title="Отмена"
                type="outline"
                onPress={() => onClose()}
                upperTitle={false}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />

                <Button
                style={style}
                title="Редактировать статус"
                upperTitle={false}
                containerStyle={{
                    maxWidth: "50%"
                }}
                onPress={() => setStatus()}
                loading={loading}
                />
            </View>
        </View>
    )
};