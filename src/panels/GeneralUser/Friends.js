import { useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, FlatList, ActivityIndicator, } from "react-native";

import { Header, Placeholder } from "../../components";

import ThemeContext from "../../config/ThemeContext";

export const GeneralUserFriends = (props) => {
    const theme = useContext(ThemeContext);
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