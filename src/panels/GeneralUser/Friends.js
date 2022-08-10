import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, } from "react-native";
import { useSelector } from "react-redux";

import { Header, Placeholder } from "../../components";

export const GeneralUserFriends = (props) => {
    const { theme: { theme } } = useSelector(state => state);
    const route = useRoute();

    const {
        navigation: {
            goBack
        }
    } = props;

    const [ list, setList ] = useState({ friends: route.params?.friendsList });
    const [ loading, setLoading ] = useState(route.params?.friendsList?.length > 0);

    return (
        <View>
            <Header
            title="Друзья"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <View>

            </View>

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
        </View>
    )
};