import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, StatusBar, Text, Vibration, ToastAndroid } from "react-native";
import { useRoute, useTheme } from "@react-navigation/native";
import axios from "axios";
import Orientation from "react-native-orientation";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { Cell, Header, Icon } from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { formatViews, normalizeSize, storage } from "../../functions";
import { showNavigationBar } from "react-native-navigation-bar-color";

export const AnimeSelectEpisode = (props) => {
    const theme = useContext(ThemeContext);

    const [ animeViewData, setAnimeViewData ] = useState([]);

    const { 
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const route = useRoute();

    const getViewData = async () => {
        const animeData = await storage.getItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`);
        if(animeData === null) return;

        setAnimeViewData(animeData);
    };

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            getViewData();
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
            showNavigationBar();
        });
    
        return willFocusSubscription;
    }, []);

    const getVideoLink = async (episode) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: episode.serie,
            source: route.params?.source
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            console.log(data)
            navigate("anime.videoplayer", {
                videos: data.links,
                data: {
                    translation: route.params?.translation,
                    episodesCount: route.params?.episodes?.length,
                    playedEpisode: episode.serie,
                    title: route.params?.title,
                    opening: data.opening,
                    ending: data.ending
                },
                translationId: route.params?.translationId,
                animeId: route.params?.animeId,
                source: route.params?.source
            });
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const renderEpisodes = ({ item }) => {
        let duration;
        let viewed_up_to;

        if(animeViewData.find(x => Number(x.episode) === Number(item.serie) && x.translationId === route.params?.translationId)) {
            duration = animeViewData.find(x => Number(x.episode) === Number(item.serie) && x.translationId === route.params?.translationId).duration;
            viewed_up_to = animeViewData.find(x => Number(x.episode) === Number(item.serie) && x.translationId === route.params?.translationId).viewed_up_to
        }

        return (
            <>
                <Cell
                title={item.serie + " серия"}
                onLongPress={() => {
                    if(!animeViewData.find(x => Number(x.episode === Number(item.serie)))) return;
                    
                    Vibration.vibrate(50);

                    const newAnimeViewData = animeViewData.map((viewItem) => {
                        if(Number(viewItem.episode) == Number(item.serie)) {
                            return;
                        }

                        return viewItem;
                    }).filter((i) => { if(i === null) return; return i; });

                    setAnimeViewData(newAnimeViewData);
                    storage.setItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`, newAnimeViewData);

                    ToastAndroid.show("Серия удалена из локальной истории просмотра", ToastAndroid.CENTER);
                }}
                subtitle={
                    viewed_up_to >= 1 && (
                        <View
                        style={{
                            marginTop: 5
                        }}
                        >
                            <View
                            style={{
                            flexDirection: "row",
                            }}
                            >
                                <Text
                                style={{
                                    backgroundColor: theme.divider_color + "50",
                                    paddingHorizontal: 5,
                                    paddingVertical: 2,
                                    borderRadius: 5,
                                    fontSize: 12,
                                    marginRight: 10,
                                    color: theme.text_secondary_color
                                }}
                                >
                                    {
                                        Number((viewed_up_to * 100 / duration) || 0).toFixed(2)
                                    }%
                                </Text>

                                <Text
                                style={{
                                    backgroundColor: theme.divider_color + "50",
                                    paddingHorizontal: 5,
                                    paddingVertical: 2,
                                    borderRadius: 5,
                                    fontSize: 12,
                                    color: theme.text_secondary_color
                                }}
                                >
                                    Просмотрено до {
                                        viewed_up_to > 3600 ?
                                        dayjs.duration(viewed_up_to * 1000).format('HH:mm:ss') :
                                        dayjs.duration(viewed_up_to * 1000).format('mm:ss')
                                    } из {
                                        duration > 3600 ?
                                        dayjs.duration(duration * 1000).format('HH:mm:ss') :
                                        dayjs.duration(duration * 1000).format('mm:ss')
                                    }
                                </Text>
                            </View>
                        </View>
                    )
                }
                onPress={() => getVideoLink(item)}
                containerStyle={{
                    paddingVertical: 15
                }}
                before={
                    <Icon
                    name="play"
                    size={13}
                    color={theme.icon_color}
                    />
                }
                after={
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <Text
                        style={{
                            marginRight: 10,
                            fontWeight: "300",
                            color: viewed_up_to >= 1 ? theme.accent : theme.text_secondary_color,
                            fontSize: 12
                        }}
                        >
                            {
                                formatViews(item.views, 2)
                            }
                        </Text>

                        <Icon
                        name="eye-outline"
                        color={viewed_up_to >= 1 ? theme.accent : theme.text_secondary_color}
                        size={15}
                        />
                    </View>
                }
                />
                <View style={{
                    backgroundColor: theme.divider_color + "50",
                    height: 0.5,
                    width: "100%", 
                    marginTop: 1
                }}/>
            </>
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Выбор серии"
            subtitle={route.params?.translation}
            backButton
            backButtonOnPress={() => goBack()}
            />

            <FlatList
            data={route.params?.episodes}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderEpisodes}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            />
        </View>
    )
};