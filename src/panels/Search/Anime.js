import React, { useContext, useState, useRef, useEffect } from "react";
import { 
    View,
    StatusBar,
    ActivityIndicator,
    TextInput
} from "react-native";
import axios from "axios";
import changeNavigationBarColor from "react-native-navigation-bar-color";

import {
    Icon,
    PressIcon,
    FoundedAnimeList,
    Placeholder
} from "../../components";

import {
    storage,
} from "../../functions";

import ThemeContext from "../../config/ThemeContext";

const SearchInput = (props) => {
    const theme = useContext(ThemeContext);
    const inputRef = useRef();

    const {
        value,
        onChangeText
    } = props;

    useEffect(() => {
        changeNavigationBarColor("translucent", false, true);
    }, []);

    return (
        <View
        style={{
            backgroundColor: theme.divider_color,
            marginHorizontal: 15,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            flex: 1
        }}
        >
            <View
            style={{
                marginLeft: 15,
                marginRight: 10,
            }}
            >
                <Icon
                name="search"
                color={theme.text_secondary_color}
                size={17}
                />
            </View>

            <TextInput
            value={value}
            placeholder="Поиск аниме-сериалов и фильмов"
            style={{
                height: 40,
                flex: 1,
                color: theme.text_color
            }}
            placeholderTextColor={theme.text_secondary_color}
            onChangeText={onChangeText}
            returnKeyType="search"
            selectionColor={theme.accent}
            ref={inputRef}
            />

            {
                value.length > 0 && (
                    <PressIcon
                    icon={
                        <Icon
                        name="backspace"
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginHorizontal: 10
                    }}
                    onPress={() => {
                        inputRef.current?.focus();
                        onChangeText("");
                    }}
                    />
                )
            }
        </View>
    )
};

export const SearchAnime = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack
        },
        navigation
    } = props;

    const [ text, setText ] = useState("");
    const [ findedAnimes, setFindedAnimes ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const search = async (text) => {
        setText(text);
        setLoading(true);

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.search", {
            title: text,
            order: {
                season: 0
            }
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setFindedAnimes(data.animes);
        })
        .catch(({ response }) => {
            console.log(JSON.stringify(response, null, "\t"))
        })
        .finally(() => setLoading(false));
    };

    const loadMoreAnimes = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.search", {
            title: text,
            order: {
                season: 0
            },
            offset: findedAnimes.length,
            limit: 15
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            setFindedAnimes(findedAnimes.concat(data.animes));
        });
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <View
            style={{
                paddingTop: StatusBar.currentHeight + 20,
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 5
            }}
            >
                <PressIcon
                icon={
                    <Icon
                    name="close"
                    color={theme.text_secondary_color}
                    />
                }
                containerStyle={{
                    marginLeft: 15
                }}
                onPress={() => goBack()}
                />

                <SearchInput 
                onChangeText={search} 
                value={text} 
                />
            </View>

            {
                (findedAnimes.length === 0 && text.length === 0) ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="feather"
                        color={theme.icon_color}
                        size={40}
                        />
                    }
                    title="Начните вводить название"
                    subtitle="Здесь будут отображены подходящие по названию аниме-сериалы и фильмы"
                    />
                ) : loading ? (
                    <Placeholder
                    icon={
                        <ActivityIndicator
                        color={theme.activity_indicator_color}
                        size={40}
                        />
                    }
                    title="Выполняется поиск"
                    subtitle="Нужно немного подождать..."
                    />
                ) : (text.length > 0 && findedAnimes.length === 0 || text.length === 0 && findedAnimes.length > 0) ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="smiley-sad"
                        color={theme.icon_color}
                        size={40}
                        />
                    }
                    title="Аниме не найдено"
                    subtitle="К сожалению, аниме с таким названием не найдено. Попробуйте использовать оригинальное название или настроить фильтры"
                    />
                ) : (
                    <FoundedAnimeList
                    animes={findedAnimes}
                    loadMoreAnimes={loadMoreAnimes}
                    navigation={navigation}
                    />
                )
            }
        </View>
    )
};