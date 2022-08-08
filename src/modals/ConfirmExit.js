import React from "react";
import { View } from "react-native";
import { EventRegister } from "react-native-event-listeners";

import {
    Button,
    Cell
} from "../components";
import { storage } from "../functions";

export const ConfirmExit = (props) => {
    const { onClose, navigate } = props;

    const confirm = () => {
        onClose();
        EventRegister.emit("app", {
            type: "changeAuthorized",
            value: false
        });
        storage.setItem("AUTHORIZATION_SIGN", null);
    };
    
    return (
        <View>
            <Cell
            title="Подтверждение выхода"
            subtitle="Вы действительно хотите выйти? После выхода все Ваши данные будут сохранены. Вы сможете войти через электронный адрес или никнейм и пароль."
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
                title="Выйти"
                onPress={() => confirm()}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />
            </View>
        </View>
    )
};