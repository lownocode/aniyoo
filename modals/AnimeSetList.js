import React, { useContext, useState } from "react";
import { View, Text, TouchableWithoutFeedback, ToastAndroid, ActivityIndicator } from "react-native";
import axios from "axios";

import {
    Cell,
    Icon,
} from "../components";
import { storage } from "../functions";
import ThemeContext from "../config/ThemeContext";

export const AnimeSetList = (props) => {
    const theme = useContext(ThemeContext);

    const { animeId, inList, getAnimeData } = props;

    const [ list, setList ] = useState(inList); 
    const [ loading, setLoading ] = useState(false);

    const setAnimeList = async (list) => {
        setLoading(true);
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

            getAnimeData(animeId);
            setLoading(false);
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        })
    };

    const lists = [
        {
            name: "Смотрю",
            list: "watching",
            icon: (
                <Icon
                name="eye"
                type="MaterialCommunityIcons"
                color={list === "watching" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        },
        {
            name: "Просмотрено",
            list: "completed",
            icon: (
                <Icon
                name="check"
                type="FontAwesome"
                color={list === "completed" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        },
        {
            name: "В планах",
            list: "planned",
            icon: (
                <Icon
                name="calendar"
                type="MaterialCommunityIcons"
                color={list === "planned" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        },
        {
            name: "Отложено",
            list: "postponed",
            icon: (
                <Icon
                name="pause-circle-outline"
                type="MaterialIcons"
                color={list === "postponed" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        },
        {
            name: "Брошено",
            list: "dropped",
            icon: (
                <Icon
                name="cancel"
                type="MaterialIcons"
                color={list === "dropped" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        },
        {
            name: "Не в списке",
            list: "none",
            icon: (
                <Icon
                name="close"
                type="Ionicons"
                color={list === "none" ? "#ffffff" : theme.text_secondary_color}
                size={20}
                />
            )
        }
    ];

    Array.prototype.chunk = function (n) {
        if (!this.length) {
            return [];
        }
        return [this.slice(0, n)].concat(this.slice(n).chunk(n));
    };

    const renderLists = (item) => (
        <View
        key={"list-" + item.list}
        style={{
            marginBottom: 35,
            flexGrow: 1
        }}
        >
            <TouchableWithoutFeedback
            onPress={() => loading ? null : list === item.list ? null : setAnimeList(item.list)}
            >
                <View
                style={{
                    alignItems: "center",
                }}
                >
                    <View
                    style={{
                        width: 65,
                        height: 50,
                        backgroundColor: list === item.list ? theme.anime[item.list] : "transparent",
                        borderRadius: 14,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: list === item.list ? 0 : 1,
                        borderColor: theme.divider_color,
                        overflow: "hidden",
                    }}
                    >
                        {
                            loading ? (
                                <ActivityIndicator color={theme.text_secondary_color}/>
                            ) : item.icon
                        }
                    </View>

                    <Text
                    style={{
                        marginTop: 5,
                        color: list === "none" ? theme.text_color : list === item.list ? theme.anime[item.list] : theme.text_secondary_color,
                        fontWeight: list === item.list ? "500" : "300",
                        fontSize: list === item.list ? 14 : 13
                    }}
                    >
                        {item.name}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
    
    return (
        <View
        style={{
            paddingTop: 35,
            // flex: 1
        }}
        >
            {
                lists.chunk(3).map((chunk, chunkIndex) => (
                        <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-evenly",
                            flex: 1
                        }}
                        key={chunkIndex}    
                        >
                            {chunk.map(renderLists)}
                        </View>
                    )
                )
            }
        </View>
    )
};