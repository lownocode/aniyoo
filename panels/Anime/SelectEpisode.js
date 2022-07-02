import React, { useContext, useEffect } from "react";
import { View, FlatList, StatusBar, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import Orientation from "react-native-orientation";

import { Cell, Header, Icon } from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { formatViews, storage } from "../../functions";
import { showNavigationBar } from "react-native-navigation-bar-color";

export const Anime_SelectEpisode = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const route = useRoute();

    const getVideoLink = async (episode) => {
        console.log(route.params)
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/anime.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: episode,
            source: route.params?.source
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            navigate("anime.videoplayer", {
                videos: data.links,
                data: {
                    translation: route.params?.translation,
                    episodesCount: route.params?.episodes?.length,
                    playedEpisode: episode,
                    title: route.params?.title,
                },
                translationId: route.params?.translationId,
                animeId: route.params?.animeId,
            });
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
            showNavigationBar();
        });
    
        return willFocusSubscription;
    });

    const renderEpisodes = ({ item }) => {
        return (
            <>
                <Cell
                title={item.serie + " серия"}
                onPress={() => getVideoLink(item)}
                containerStyle={{
                    paddingVertical: 15
                }}
                before={
                    <Icon
                    name="play-circle-outline"
                    type="Ionicons"
                    size={18}
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
                            color: theme.text_secondary_color,
                            fontSize: 12
                        }}
                        >
                            {
                                formatViews(item.views, 2)
                            }
                        </Text>

                        <Icon
                        name="eye-outline"
                        type="Ionicons"
                        color={theme.text_secondary_color}
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
            />
        </View>
    )
};