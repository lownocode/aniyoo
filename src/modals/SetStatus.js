import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import axios from "axios";

import {
    Button,
    Cell,
    Input,
    Icon,
} from "../components";
import { storage, EventEmit } from "../functions";
import ThemeContext from "../config/ThemeContext";

export const SetStatus = (props) => {
    const theme = useContext(ThemeContext);

    const { onClose } = props;
    
    const [ text, setText ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const getStatus = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/users.signIn", null, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setText(data?.status || "");
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        getStatus();
    }, []);

    const setStatus = async () => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/settings.setStatus", {
            status: text
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            EventEmit(["edit_profile.profile", "profile"], {
                type: "show_snackbar",
                data: {
                    text: data.message,
                    before: (
                        <Icon
                        name="checkmark-done"
                        type="Ionicons"
                        color="#fff"
                        size={17}
                        />
                    )
                }
            });
        })
        .catch(({ response: { data } }) => {
            EventEmit(["edit_profile.profile", "profile"], {
                type: "show_snackbar",
                data: {
                    text: data.message,
                    before: (
                        <Icon
                        name="error-outline"
                        type="MaterialIcons"
                        color="#fff"
                        size={17}
                        />
                    )
                }
            });
        });
        
        setLoading(false);
    };

    return (
        <View>
            <Cell
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
                    fontSize: 10,
                    color: theme.text_color
                }}
                >
                    {text.length} из 100
                </Text>
            </View>

            <View style={{flexDirection: "row"}}>
                <Button
                title="Отмена"
                type="outline"
                onPress={() => onClose()}
                upperTitle={false}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />

                <Button
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