import React from "react";
import { View } from "react-native";

import {
    Button,
    Cell
} from "../components";
import { storage } from "../functions";

export const ConfirmExit = (props) => {
    const { onClose, navigate } = props;
    
    return (
        <View>
            <Cell
            title="Подтверждение выхода"
            subtitle="Вы действительно хотите выйти? После выхода все Ваши данные будут сохранены. Вы сможете войти по почте и паролю."
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
                onPress={() => {
                    storage.setItem("AUTHORIZATION_SIGN", null);
                    navigate("authorization");
                    onClose();
                }}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />
            </View>
        </View>
    )
};