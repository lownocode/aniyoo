import React, { useContext, useState } from "react";
import { View, ToastAndroid } from "react-native";
import { useSelector } from "react-redux";
import Clipboard from "@react-native-community/clipboard";

import {
    Cell,
    Divider,
    Icon
} from "../components";

import UserContext from "../config/UserContext";

import {
    DeleteComment,
    EditComment
} from ".";

export const CommentActions = (props) => {
    const { theme } = useSelector(state => state.theme);
    const user = useContext(UserContext);

    const [ mode, setMode ] = useState("default");

    const { 
        onClose, 
        comment, 
        navigate, 
        successEditing
    } = props;
    
    return (
        mode === "edit" ? (
            <EditComment
            comment={comment}
            successEditing={successEditing}
            onClose={onClose}
            />
        ) :   
        mode === "delete" ? (
            <DeleteComment
            comment={comment}
            successEditing={successEditing}
            onClose={onClose}
            />
        ) : (
            <View>
                <Cell
                title="Перейти в профиль комментатора"
                before={
                    <Icon
                    name="user-outline"
                    color={theme.icon_color}
                    size={17}
                    />
                }
                containerStyle={{ paddingVertical: 15 }}
                />

                <Divider/>

                {
                    comment?.text && (
                        <Cell
                        title="Скопировать текст комментария"
                        before={
                            <Icon
                            name="copy-outline"
                            color={theme.icon_color}
                            size={17}
                            />
                        }
                        containerStyle={{ paddingVertical: 15 }}
                        onPress={() => {
                            Clipboard.setString(comment?.text);
                            ToastAndroid.show("Текст комментария скопирован в буфер обмена", ToastAndroid.CENTER);
                            onClose();
                        }}
                        />
                    )
                }

                <Divider/>

                <Cell
                title="Пожаловаться"
                before={
                    <Icon
                    name="octagon-warning-outline"
                    color={theme.icon_color}
                    size={17}
                    />
                }
                containerStyle={{ paddingVertical: 15 }}
                />

                {
                    comment.user.id === user.id && (
                        <>
                            <Divider indents />

                            <Cell
                            title="Редактировать"
                            before={
                                <Icon
                                name="pencil-outline"
                                type="MaterialCommunityIcons"
                                color={theme.icon_color}
                                size={17}
                                />
                            }
                            containerStyle={{ paddingVertical: 15 }}
                            onPress={() => setMode("edit")}
                            />

                            <Divider />

                            <Cell
                            title="Удалить"
                            before={
                                <Icon
                                name="trash-o"
                                type="FontAwesome"
                                color={theme.icon_color}
                                size={17}
                                />
                            }
                            containerStyle={{ paddingVertical: 15 }}
                            onPress={() => setMode("delete")}
                            />
                        </>
                    )
                }
            </View>
        )
    )
};