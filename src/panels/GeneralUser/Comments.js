import React, { useEffect, useState } from "react";
import { ToastAndroid, } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

import { CommentsList, Panel } from "../../components";

import { storage } from "../../functions";

export const GeneralUserComments = (props) => {
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
        <Panel
        headerProps={{
            title: "Комментарии",
            backOnPress: () => goBack()
        }}
        >
            <CommentsList
            list={comments}
            />
        </Panel>
    )
};