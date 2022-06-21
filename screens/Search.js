import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { 
    ScrollView, 
    View,
    StatusBar,
    Text,
    Keyboard,
    ActivityIndicator,
    BackHandler
} from "react-native";

import { EventRegister } from "react-native-event-listeners";

import {
    Input,
    Icon,
    PressIcon,
    FoundedAnimeList,
    Placeholder
} from "../components";

import {
    storage,
} from "../functions";

import ThemeContext from "../config/ThemeContext";

export const Search = (props) => {
    const theme = useContext(ThemeContext);

    const { navigation } = props;

    const [ searchTitle, setSearchTitle ] = useState("");
    const [ searchMode, setSearchMode ] = useState(false);
    const [ sign, setSign ] = useState("");
    const [ foundedAnimes, setFoundedAnimes ] = useState([]);
    const [ loadingSearchAnimes, setLoadingSearchAnimes ] = useState(false);

    const keyboardListeners = () => {
        Keyboard.addListener("keyboardDidShow", () => {
            EventRegister.emit("changeTabbar", { type: "hide" });
            setSearchMode(true);
        });
    };

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            if(searchMode) {
                return EventRegister.emit("changeTabbar", { type: "hide" });
            }
        });

        keyboardListeners();

        return willFocusSubscription;
    }, []);

    useEffect(() => {
        (async () => {
            const sign = await storage.getItem("AUTHORIZATION_SIGN");

            setSign(sign);
        })();
    }, []);

    const searchAnime = (title) => {
        if(title.length === 0) {
            setFoundedAnimes([]);
            return setSearchTitle("");
        }

        setLoadingSearchAnimes(true);
        setSearchTitle(title);

        axios.post("/anime.search", {
            title: title,
            order: {
                season: 0
            }
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setFoundedAnimes(data);
        })
        .catch(({ response }) => {
            console.log(JSON.stringify(response, null, "\t"))
        })
        .finally(() => setLoadingSearchAnimes(false));
    };

    const loadMoreAnimes = () => {
        axios.post("/anime.search", {
            title: searchTitle,
            order: {
                season: 0
            },
            offset: foundedAnimes.length,
            limit: 15
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setFoundedAnimes(foundedAnimes.concat(data));
        });
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <View
            style={{
                backgroundColor: theme.header_background,
                paddingTop: StatusBar.currentHeight + 20,
                paddingHorizontal: 15,
                paddingBottom: 8,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}
            >
                {
                    searchMode && (
                        <PressIcon 
                        icon={
                            <Icon
                            type="AntDesign"
                            name="arrowleft"
                            color="gray"
                            size={22}
                            />
                        }
                        onPress={() => {
                            Keyboard.dismiss();
                            setFoundedAnimes([]);
                            setSearchMode(false);
                            EventRegister.emit("changeTabbar", { type: "show" });
                        }}
                        containerStyle={{
                            marginRight: 15,
                        }}
                        />
                    )
                }
                <View
                style={{flex: 1}}
                >
                    <Input
                    placeholder="Что ищем, семпай?"
                    before={
                        <Icon
                        type="Ionicons"
                        name="search"
                        color={theme.icon_color}
                        size={17}
                        />
                    }
                    after={
                        searchTitle.trim().length >= 1 &&
                        <PressIcon
                        onPress={() => searchAnime("")}
                        icon={
                            <Icon
                            type="Ionicons"
                            name="backspace-outline"
                            color={theme.icon_color}
                            size={20}
                            />
                        }
                        />
                    }
                    value={searchTitle}
                    onChangeText={(value) => searchAnime(value)}
                    onSubmitEditing={() => searchAnime(searchTitle)}
                    />
                </View>
            </View>

            {
                searchMode && (
                    foundedAnimes.length === 0 ? (
                        foundedAnimes.length === 0 && searchTitle.length === 0 ? (
                            <Placeholder
                            icon={
                                <Icon
                                name="search"
                                type="Ionicons"
                                color={theme.icon_color}
                                size={45}
                                />
                            }
                            title="Начните вводить название"
                            subtitle="Здесь будут отображены подходящие по названию аниме-сериалы и фильмы"
                            />
                        ) : (
                            loadingSearchAnimes ? (
                                <Placeholder
                                icon={
                                    <ActivityIndicator
                                    color={theme.activity_indicator_color}
                                    size={40}
                                    />
                                }
                                title="Выполняется поиск"
                                subtitle="Подождите немного"
                                />
                            ) : (
                                <Placeholder
                                icon={
                                    <Icon
                                    name="ios-sad-outline"
                                    type="Ionicons"
                                    color={theme.icon_color}
                                    size={45}
                                    />
                                }
                                title="Аниме не найдено"
                                subtitle="К сожалению, аниме с таким названием не найдено. Попробуйте использовать оригинальное название или настроить фильтры"
                                />
                            )
                        ) 
                    ) : (
                        <FoundedAnimeList
                        animes={foundedAnimes}
                        loadMoreAnimes={loadMoreAnimes}
                        navigation={navigation}
                        />
                    )
                )
            }
        </View>
    )
};