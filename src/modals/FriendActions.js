import React, { useContext } from "react";
import { View } from "react-native";

import {
    Button,
    Cell,
    Divider,
    Icon
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const FriendActions = (props) => {
    const theme = useContext(ThemeContext);

    const { onClose, relation } = props;
    
    return (
        <View>
            {
                relation === "friends" ? (
                    <View>
                        <Cell
                        title="Действия"
                        subtitle="Этот пользователь находится у Вас в друзьях, выберите действие ниже"
                        disabled
                        before={
                            <Icon
                            name="dots-vertical"
                            type="MaterialCommunityIcons"
                            size={20}
                            color={theme.icon_color}
                            />
                        }
                        containerStyle={{
                            paddingBottom: 15
                        }}
                        />

                        <Divider />

                        <Cell
                        title="Удалить из друзей"
                        subtitle="Пользователь будет удален из Вашего списка друзей"
                        before={
                            <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#f06d0220",
                                borderRadius: 15,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            >
                                <Icon
                                type="Ionicons"
                                name="close"
                                size={20}
                                color="#f06d02"
                                />
                            </View>
                        }
                        containerStyle={{
                            paddingTop: 15
                        }}
                        />

                        <Cell
                        title="Добавить в чёрный список"
                        subtitle="Пользователь больше не сможет просмотреть информацию у Вас в профиле"
                        before={
                            <View
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: "#f5210520",
                                borderRadius: 15,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            >
                                <Icon
                                type="MaterialCommunityIcons"
                                name="cancel"
                                size={20}
                                color="#f52105"
                                />
                            </View>
                        }
                        />
                    </View>
                ) : null
            }
        </View>
    )
};