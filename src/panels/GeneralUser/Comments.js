import React, { useContext, useEffect, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

import { CommentsList, Header } from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { storage } from "../../functions";

export const GeneralUserComments = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const {
        navigation: {
            goBack
        }
    } = props;

    const [ comments, setComments ] = useState({});

    const getComments = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/comments.getList", {
            [route.params?.userId && "userId"]: route.params?.userId
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setComments(data);
            console.log(data)
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        });
    };

    useEffect(() => { 
        getComments();
    }, []);

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Комментарии"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <CommentsList
            list={comments}
            />
        </View>
    )
};