import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, View, } from "react-native";
import { useSelector } from "react-redux";

import {
    Avatar,
    Cell,
    Panel,
    Placeholder,
    Icon
} from "../../components";

export const UserFriends = (props) => {
    const { theme } = useSelector(state => state.theme);
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
        <Panel
        headerProps={{
            title: "Друзья",
            backOnPress: () => goBack()
        }}
        >
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
        </Panel>
    )
};