import React, { useContext, useState } from "react";
import { View } from "react-native";
import axios from "axios";

import {
    Cell,
    Icon,
} from "../components";
import { storage } from "../functions";
import ThemeContext from "../config/ThemeContext";

export const AnimeSetList = (props) => {
    const theme = useContext(ThemeContext);

    const { animeId, inList } = props;

    const [ list, setList ] = useState(inList); 

    const setAnimeList = async (list) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/anime.setStatus", {
            status: list,
            animeId: animeId
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setList(list);
            console.log(data)
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        })
    };
    
    return (
        <View>
            <Cell
            title="Смотрю"
            before={
                list === "watching" ? (
                    <Icon
                    name="ios-radio-button-on-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                ) : (
                    <Icon
                    name="ios-radio-button-off-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                )
            }
            after={
                <Icon
                name="eye"
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={15}
                />
            }
            disabled={list === "watching"}
            onPress={() => setAnimeList("watching")}
            subtitle={list === "watching" && "Выбранный список"}
            />

            <View style={{ marginTop: 5 }}/>

            <Cell
            title="Просмотрено"
            before={
                list === "completed" ? (
                    <Icon
                    name="ios-radio-button-on-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                ) : (
                    <Icon
                    name="ios-radio-button-off-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                )
            }
            after={
                <Icon
                name="check"
                type="FontAwesome"
                color={theme.text_secondary_color}
                size={15}
                />
            }
            disabled={list === "completed"}
            onPress={() => setAnimeList("completed")}
            subtitle={list === "completed" && "Выбранный список"}
            />

            <View style={{ marginTop: 5 }}/>

            <Cell
            title="В планах"
            before={
                list === "planned" ? (
                    <Icon
                    name="ios-radio-button-on-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                ) : (
                    <Icon
                    name="ios-radio-button-off-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                )
            }
            after={
                <Icon
                name="calendar"
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={15}
                />
            }
            disabled={list === "planned"}
            onPress={() => setAnimeList("planned")}
            subtitle={list === "planned" && "Выбранный список"}
            />

            <View style={{ marginTop: 5 }}/>

            <Cell
            title="Отложено"
            before={
                list === "postponed" ? (
                    <Icon
                    name="ios-radio-button-on-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                ) : (
                    <Icon
                    name="ios-radio-button-off-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                )
            }
            after={
                <Icon
                name="pause-circle-outline"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={15}
                />
            }
            disabled={list === "postponed"}
            onPress={() => setAnimeList("postponed")}
            subtitle={list === "postponed" && "Выбранный список"}
            />

            <View style={{ marginTop: 5 }}/>

            <Cell
            title="Брошено"
            before={
                list === "dropped" ? (
                    <Icon
                    name="ios-radio-button-on-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                ) : (
                    <Icon
                    name="ios-radio-button-off-outline"
                    type="Ionicons"
                    color={theme.text_color}
                    size={18}
                    />
                )
            }
            after={
                <Icon
                name="cancel"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={15}
                />
            }
            disabled={list === "dropped"}
            onPress={() => setAnimeList("dropped")}
            subtitle={list === "dropped" && "Выбранный список"}
            />
        </View>
    )
};