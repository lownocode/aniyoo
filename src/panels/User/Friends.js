import { useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { FlatList, View, } from "react-native";

import {
    Avatar,
    Cell,
    Header,
    Placeholder,
    Icon
} from "../../components";

import ThemeContext from "../../config/ThemeContext";

export const UserFriends = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const {
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const [ friends, setFriends ] = useState(route.params?.friends);

    const renderFriends = ({ item }) => {
        console.log(item)

        return (
            <Cell
            title={item.nickname}
            onPress={() => navigate("user_profile", { userId: item.id })}
            before={
                <Avatar
                url={item.photo}
                online={(+new Date() - +new Date(item?.online?.time)) < 1 * 60 * 1000}
                />
            }
            />
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Друзья"
            backButton
            backButtonOnPress={() => goBack()}
            />

            {
                friends.length < 1 ? (
                    <Placeholder
                    title="Кажется, у Вас ещё нет друзей"
                    subtitle="Тут типо какойто текст я хз че придумать просто простите"
                    icon={
                        <Icon
                        color={theme.icon_color}
                        name="users-friends"
                        size={55}
                        />
                    }
                    />
                ) : (
                    <FlatList
                    data={friends}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderFriends}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    />
                )
            }
        </View>
    )
};