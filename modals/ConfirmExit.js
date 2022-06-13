import React from "react";
import { View } from "react-native";

import {
    Button,
    Cell
} from "../components";
import { storage } from "../functions";

export const ConfirmExit = (props) => {
    const { style, onClose, navigate } = props;
    
    return (
        <View>
            <Cell
            style={style}
            title="Подтверждение выхода"
            subtitle="Вы действительно хотите выйти? После выхода все Ваши данные будут сохранены. Вы сможете войти по почте и паролю."
            disabled
            />

            <View style={{flexDirection: "row"}}>
                <Button
                style={style}
                title="Отмена"
                type="outline"
                onPress={() => onClose()}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />

                <Button
                style={style}
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