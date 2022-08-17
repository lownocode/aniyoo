import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, } from "react-native";
import { useSelector } from "react-redux";

import { Panel, Placeholder } from "../../components";

export const GeneralUserFriends = (props) => {
    const { theme } = useSelector(state => state.theme);
    const route = useRoute();

    const {
        navigation: {
            goBack
        }
    } = props;

    const [ list, setList ] = useState({ friends: route.params?.friendsList });
    const [ loading, setLoading ] = useState(route.params?.friendsList?.length > 0);

    return (
        <Panel
        headerProps={{
            title: "Друзья",
            backOnPress: () => goBack()
        }}
        >
            {
                loading ? (
                    <Placeholder
                    icon={
                        <ActivityIndicator
                        size={40}
                        color={theme.activity_indicator_color}
                        />
                    }
                    title="Загрузка..."
                    subtitle="Нужно немного подождать"
                    />
                ) : (
                    <FlatList
                    data={list}
                    />
                )
            }
        </Panel>
    )
};