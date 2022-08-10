import React, { useState } from "react";
import { View, TouchableWithoutFeedback, ToastAndroid, Text } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";

import {
    Icon,
} from "../components";
import { storage } from "../functions";

export const AnimeSetList = (props) => {
    const { theme: { theme } } = useSelector(state => state);

    const { 
        animeId, 
        inList, 
        getAnimeData,
        onClose,
        addAnimeToList
    } = props;

    const [ list, setList ] = useState(inList); 

    const setAnimeList = async (list) => {
        addAnimeToList(list);
        setList(list);
        onClose();
        
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/lists.add", {
            status: list,
            animeId: animeId
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setList(list);

            getAnimeData(animeId, false);
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data } }) => {
            getAnimeData(animeId, false);
            console.log(data)
        })
    };

    const lists = [
        {
            list: "watching",
            name: "Смотрю",
            icon: (
                <Icon
                name="eye"
                color={theme.text_secondary_color}
                size={22}
                />
            ),
        },
        {
            list: "completed",
            name: "Просмотрено",
            icon: (
                <Icon
                name="done-double"
                color={theme.text_secondary_color}
                size={22}
                />
            )
        },
        {
            list: "planned",
            name: "В планах",
            icon: (
                <Icon
                name="calendar"
                color={theme.text_secondary_color}
                size={22}
                />
            )
        },
        {
            list: "postponed",
            name: "Отложено",
            icon: (
                <Icon
                name="pause-rounded"
                color={theme.text_secondary_color}
                size={22}
                />
            )
        },
        {
            list: "dropped",
            name: "Брошено",
            icon: (
                <Icon
                name="cancel-rounded"
                color={theme.text_secondary_color}
                size={22}
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
                size={17}
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
            onPress={() => list === item.list ? null : setAnimeList(item.list)}
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
                            item.icon
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