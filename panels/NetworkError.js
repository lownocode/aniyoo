import React from "react";
import { View } from "react-native";
import { Icon, Placeholder } from "../components";

export const NetworkError = (props) => {
    const { style, } = props;

    return (
        <View style={style.view}>
            <Placeholder
            style={style}
            title="Ой, видимо, произошла ошибка"
            subtitle="Извините, похоже, что Вы не можете подключиться к нашему серверу. Возможно, это связано с отсутствием интернета, или же наш сервер сейчас недоступен."
            icon={
                <Icon
                type="MaterialIcons"
                name="error-outline"
                color="#eb3a34"
                size={50}
                />
            }
            />
        </View>
    )
};