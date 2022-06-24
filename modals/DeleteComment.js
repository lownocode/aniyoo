import React, { useState } from "react";
import { View, ToastAndroid } from "react-native";
import axios from "axios";

import {
    Button,
    Cell
} from "../components";

import { storage } from "../functions";

export const DeleteComment = (props) => {
    const { onClose, successEditing, comment } = props;

    const [ loading, setLoading ] = useState(false);

    const deleteComment = async() => {
        setLoading(true)
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comment.delete", {
            commentId: comment?.id,
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
            title="Подтверждение действия"
            subtitle="Вы действительно хотите удалить этот комментарий? Это действие необратимо"
            disabled
            />

            <View style={{flexDirection: "row"}}>
                <Button
                title="Отмена"
                type="outline"
                onPress={() => onClose()}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />

                <Button
                title="Удалить"
                containerStyle={{
                    maxWidth: "50%"
                }}
                loading={loading}
                onPress={deleteComment}
                />
            </View>
        </View>
    )
};