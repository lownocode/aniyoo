import React, { useContext, useState, useEffect, useRef } from "react";
import { View, FlatList, Text, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import changeNavigationBarColor from "react-native-navigation-bar-color";

import { Cell, Icon, Header } from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { formatViews, storage } from "../../functions";
import { SelectVideoSource } from "../../modals";

export const AnimeSelectTranslation = (props) => {
    const theme = useContext(ThemeContext);

    const [ translations, setTranslations ] = useState([]);
    const [ loading, setLoading ] = useState(null);
    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

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
        changeNavigationBarColor(theme.background_content, false, true);
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

            setModalContent(
                <SelectVideoSource
                sources={data}
                translation={translation}
                navigation={navigation}
                animeData={{
                    animeId: route.params?.animeId, 
                    translationId: translationId,
                    translation: translation,
                    title: route.params?.title,
                }}
                onClose={() => modalRef.current?.close()}
                />
            );

            modalRef.current?.open();
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

    const styles = StyleSheet.create({
        modalContainer: {
            left: 10,
            width: Dimensions.get("window").width - 20,
            bottom: 10,
            borderRadius: 15,
            backgroundColor: theme.bottom_modal.background,
            borderColor: theme.bottom_modal.border,
            borderWidth: 0.5,
            overflow: "hidden",
            borderRadius: 15,
        },
    });

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Выбор озвучки"
            backButton
            backButtonOnPress={() => goBack()}
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>

            <FlatList
            showsVerticalScrollIndicator={false}
            data={translations}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderTranslations}
            />
        </GestureHandlerRootView>
    )
};