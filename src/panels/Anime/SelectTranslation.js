import React, { useState, useEffect, } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import { Cell, Icon, Panel } from "../../components";
import { openModal } from "../../redux/reducers";
import { formatViews, storage } from "../../functions";

export const AnimeSelectTranslation = (props) => {
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.theme);

    const [ translations, setTranslations ] = useState([]);
    const [ loading, setLoading ] = useState(null);

    const { 
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const route = useRoute();

    const getTranslations = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getTranslation", {
            animeId: route.params?.animeId
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setTranslations(data);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    useEffect(() => {
        getTranslations();
    }, []);

    const getSources = async (translationId, translation) => {
        setLoading(translationId);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getSources", {
            animeId: route.params?.animeId,
            translationId: translationId,
            // order: {
            //     views: 1
            // }
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            if(data.length === 1) {
                setLoading(null)
                return navigate("anime.select_episode", { 
                    animeId: route.params?.animeId, 
                    translationId: translationId,
                    translation: translation,
                    title: route.params?.title,
                    episodes: data[0].episodes
                });
            }

            dispatch(openModal({ 
                visible: true, 
                id: "SELECT_VIDEO_SOURCE",
                props: {
                    sources: data,
                    navigation,
                    translation,
                    animeData: {
                        animeId: route.params?.animeId,
                        translationId,
                        translation,
                        title: route.params?.title
                    }
                } 
            }));

            setLoading(null);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const renderTranslations = ({ item, index }) => {
        return (
            <>
                <Cell
                key={"translation-" + index}
                title={item.title}
                subtitle={item.episodes + " серий"}
                onPress={() => getSources(item.id, item.title)}
                containerStyle={{
                    paddingVertical: 15
                }}
                before={
                    loading === item.id ? (
                        <ActivityIndicator
                        size={20}
                        color={theme.activity_indicator_color}
                        />
                    ) : (
                        <Icon
                        name="mic"
                        color={theme.icon_color}
                        size={20}
                        />
                    )
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
        <Panel
        headerProps={{
            title: "Выбор озвучки",
            backOnPress: () => goBack()
        }}
        >
            <FlatList
            showsVerticalScrollIndicator={false}
            data={translations}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderTranslations}
            />
        </Panel>
    )
};