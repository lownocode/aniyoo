import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";

import {
    Button,
    Cell
} from "../components";
import { storage } from "../functions";
import { closeModal, setAuthorized } from "../redux/reducers";

export const ConfirmExit = () => {
    const dispatch = useDispatch();

    const confirm = () => {
        dispatch(setAuthorized(false));
        dispatch(closeModal());

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
                onPress={() => dispatch(closeModal())}
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