import React, { useContext } from "react";
import { View } from "react-native";
import { Icon, Placeholder } from "../components";

import themeContext from "../config/themeContext";

export const NetworkError = (props) => {
    const theme = useContext(themeContext);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Placeholder
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