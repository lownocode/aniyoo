import React, { useContext, useState } from "react";
import { View, Switch, ToastAndroid } from "react-native";
import axios from "axios";

import {
    Button,
    Cell,
    Icon,
    Input
} from "../components";
import { storage } from "../functions";

import ThemeContext from "../config/ThemeContext";

export const EditComment = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onClose, 
        comment,
        successEditing
    } = props;

    const [ text, setText ] = useState(comment?.text);
    const [ spoiler, setSpoiler ] = useState(comment?.isSpoiler);
    const [ loading, setLoading ] = useState(false);

    const editComment = async() => {
        setLoading(true)
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.edit", {
            commentId: comment?.id,
            text: text,
            isSpoiler: spoiler
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            successEditing();
            setLoading(false);
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
            onClose();
        })
        .catch(({ response: { data } }) => {
            setLoading(false);
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
    };
    
    return (
        <View>
            <Cell
            title="Редактирование комментария"
            subtitle="Введите новый текст комментария и укажите содержит ли он спойлер"
            disabled
            before={
                <Icon
                name="pencil-outline"
                type="MaterialCommunityIcons"
                color={theme.icon_color}
                size={22}
                />
            }
            />

            <View
            style={{
                marginHorizontal: 10,
                marginTop: 15,
                marginBottom: 5
            }}
            >
                <Input
                placeholder="Введите новый текст комментария"
                multiline
                height={100}
                textAlignVertical="top"
                value={text}
                onChangeText={(text) => setText(text)}
                maxLength={750}
                />
            </View>

            <Cell
            title="Содержит спойлер"
            subtitle="Спойлер — преждевременно раскрытая важная сюжетная информация, которая разрушает задуманную авторами интригу."
            after={
                <Switch
                value={spoiler}
                onValueChange={(value) => setSpoiler(value)}
                trackColor={{ false: theme.switch.track_off, true: theme.switch.track_on }}
                thumbColor={spoiler ? theme.switch.thumb : theme.switch.thumb_light}
                />
            }
            onPress={() => setSpoiler(!spoiler)}
            />

            <Button
            title="Сохранить изменения"
            upperTitle={false}
            onPress={editComment}
            loading={loading}
            />
        </View>
    )
};