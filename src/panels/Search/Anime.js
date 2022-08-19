import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { 
    View,
    StatusBar,
    ActivityIndicator,
    TextInput,
    TouchableNativeFeedback,
    Text
} from "react-native";
import axios from "axios";
import Clipboard from "@react-native-community/clipboard";

import {
    Icon,
    PressIcon,
    SearchAnimeList,
    Placeholder,
    Panel
} from "../../components";

import {
    removeArrayDuplicates,
    storage,
} from "../../functions";

const SearchInput = (props) => {
    const { theme } = useSelector(state => state.theme);
    const inputRef = useRef();

    const {
        value,
        onChangeText
    } = props;

    return (
        <View
        style={{
            backgroundColor: theme.divider_color,
            marginHorizontal: 15,
            borderRadius: 100,
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
            placeholder="Поиск аниме"
            style={{
                height: 40,
                flex: 1,
                color: theme.text_color,
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
                        name="backspace-outline"
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginLeft: 10,
                        marginRight: 5
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
    const { user } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);

    const { 
        navigation: {
            goBack
        },
        navigation
    } = props;

    const [ text, setText ] = useState("");
    const [ findedAnimes, setFindedAnimes ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ clipboardText, setClipboardText ] = useState("");

    const getClipboardText = async () => {
        const text = await Clipboard.getString();
        setClipboardText(text);
    };

    useEffect(() => {
        getClipboardText();
    }, []);

    const searchRequest = (text) => {
        if(text.split(" ").join("").length < 1) return;
        setLoading(true);

        axios.post("/animes.search", {
            title: text,
        }, {
            headers: {
                "Authorization": user.sign,
            }
        })
        .then(({ data }) => {
            setFindedAnimes(data);
        })
        .catch(({ response }) => {
            console.log(JSON.stringify(response, null, "\t"))
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => searchRequest(text), 200);
    
        return () => clearTimeout(delayDebounceFn);
    }, [text]);

    const loadMoreAnimes = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.search", {
            title: text,
            offset: findedAnimes?.animes?.length,
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(({ data }) => {
            console.log(data.animes.length)
            let all = findedAnimes.animes;
            all = all.concat(data.animes);

            console.log(`с дубликатами: `, all.length)
            console.log(`без дубликатов: `, removeArrayDuplicates(findedAnimes.animes.concat(data.animes)).map(a => {return a.id}).length)
            
            setFindedAnimes({
                count: data.count,
                animes: removeArrayDuplicates(findedAnimes.animes.concat(data.animes))
            });
        });
    };

    return (
        <Panel
        headerShown={false}
        >
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
                    size={20}
                    />
                }
                containerStyle={{
                    marginLeft: 15
                }}
                onPress={() => goBack()}
                />

                <SearchInput 
                onChangeText={(text) => setText(text)} 
                value={text} 
                />

                <PressIcon
                icon={
                    <Icon
                    name="mic-outline"
                    color={theme.text_secondary_color}
                    size={17}
                    />
                }
                containerStyle={{
                    marginRight: 10,
                    backgroundColor: theme.divider_color,
                }}
                onPress={() => goBack()}
                />

                <PressIcon
                icon={
                    <Icon
                    name="options"
                    color={theme.text_secondary_color}
                    size={17}
                    />
                }
                containerStyle={{
                    marginRight: 15,
                    backgroundColor: theme.divider_color,
                }}
                onPress={() => goBack()}
                />
            </View>

            {
                clipboardText.length > 1 && (findedAnimes?.animes?.length === 0 && text.length === 0) ? (
                    <View
                    style={{
                        margin: 10,
                        borderRadius: 10,
                        backgroundColor: theme.divider_color + "50",
                        overflow: "hidden",
                    }}
                    >
                        <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                        onPress={() => setText(text)}
                        >
                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 10
                            }}
                            >
                                <Icon
                                name="copy-outline"
                                size={17}
                                color={theme.icon_color}
                                />

                                <View
                                style={{
                                    marginHorizontal: 10,
                                    flex: 1
                                }}
                                >
                                    <Text
                                    numberOfLines={2}
                                    style={{
                                        fontWeight: "500",
                                        color: theme.text_color,
                                        fontSize: 15
                                    }}
                                    >
                                        {clipboardText}
                                    </Text>
                                    <Text
                                    style={{
                                        color: theme.text_secondary_color,
                                        fontSize: 13
                                    }}
                                    >
                                        Возможно, вы скопировали название аниме
                                    </Text>
                                </View>

                                <Icon
                                name="chevron-right"
                                color={theme.icon_color}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                ) : null
            }

            {
                text.split(" ").join("").length < 1 ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="pencil-write"
                        color={theme.icon_color}
                        size={40}
                        />
                    }
                    title="Начните вводить название"
                    subtitle="Здесь будут отображены подходящие по названию аниме-сериалы и фильмы"
                    />
                ) : (loading && findedAnimes?.animes?.length  === 0 && text.length) ? (
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
                ) : (text.length > 0 && findedAnimes?.animes?.length === 0 || text.length === 0 && findedAnimes?.animes?.length > 0) ? (
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
                    <SearchAnimeList
                    list={findedAnimes}
                    loadMoreAnimes={loadMoreAnimes}
                    navigation={navigation}
                    loading={loading}
                    />
                )
            }
        </Panel>
    )
};