import React, { useContext } from "react";
import { 
    View, 
    Image, 
    Text, 
    FlatList,
} from "react-native";

import { Cell, Icon } from "../";

import ThemeContext from "../../config/ThemeContext";
import { normalizeSize, declOfNum } from "../../functions";

export const SearchAnimeList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        animes,
        loadMoreAnimes,
        navigation
    } = props;

    const checkEpisodesStatus = (total, aired, status) => {
        if(typeof total !== "number" || Number.isNaN(total) || typeof aired !== "number" || Number.isNaN(aired)) {
            return "? серий"
        }
        else if(total === aired) {
            return `${total} ${declOfNum(total, [`серия`, `серии`, `серий`])}`
        }
        else if(total && !aired) {
            return `${total} ${declOfNum(total, [`серия`, `серии`, `серий`])}`
        }
        else if(!total && aired && status === "ongoing") {
            return `${aired} из ? серий`;
        }
    
        return `${aired} из ${total} серий`;
    };
    

    const renderList = ({ item, index }) => {
        return (
            <Cell
            key={"anime_" + index}
            title={
                <View>
                    <Text
                    numberOfLines={2}
                    style={{
                        color: theme.cell.title_color,
                        fontWeight: "500",
                        fontSize: normalizeSize(13),
                    }}
                    >
                        {
                            item.isFavorite && (
                                <Icon
                                type="Ionicons"
                                name="bookmark"
                                color="#c78b16"
                                />
                            )
                        }{item.isFavorite && " "}{
                            item?.title
                        }
                    </Text>
                </View>
            }
            centered={false}
            maxTitleLines={2}
            before={
                <View
                style={{
                    backgroundColor: theme.divider_color,
                    borderRadius: 7,
                    position: "relative",
                    overflow: "hidden",
                }}
                >
                    <Image
                    resizeMethod="resize"
                    source={{
                        uri: item?.poster
                    }}
                    style={{
                        width: normalizeSize(70),
                        height: normalizeSize(105),
                        resizeMode: "cover",
                        borderRadius: 7,
                    }}
                    />

                    {
                        item.inList !== "none" && (
                            <View>
                                <Text
                                numberOfLines={1}
                                style={{
                                    backgroundColor: theme.anime[item.inList],
                                    opacity: 0.85,
                                    position: "absolute",
                                    bottom: 0,
                                    width: "100%",
                                    textAlign: "center",
                                    color: "#fff",
                                    fontSize: normalizeSize(10),
                                    paddingVertical: 1,
                                    paddingHorizontal: 3,
                                    fontWeight: "500"
                                }}
                                >
                                    {
                                        item.inList === "watching" ? "Смотрю" :
                                        item.inList === "completed" ? "Просмотрено" :
                                        item.inList === "planned" ? "В планах" :
                                        item.inList === "postponed" ? "Отложено" :
                                        item.inList === "dropped" ? "Брошено" : "Неизвестно"
                                    }
                                </Text>
                            </View>
                        )
                    }
                </View>
            }
            subtitle={
                <View>
                    <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                    >
                        {
                            item.type === "anime-serial" && item.season ? (
                                <View>
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontSize: normalizeSize(10),
                                        borderColor: theme.divider_color,
                                        backgroundColor: theme.divider_color + "98",
                                        borderWidth: 1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                        marginTop: 5,
                                        marginRight: 10
                                    }}
                                    >
                                        {
                                            `${item.season || "?"} сезон`
                                        }
                                    </Text>
                                </View>
                            )  : null
                        }

                        {
                            item.type === "anime-serial" && (
                                <View>
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontSize: normalizeSize(10),
                                        borderColor: theme.divider_color,
                                        backgroundColor: theme.divider_color + "98",
                                        borderWidth: 1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                        marginRight: 10,
                                        marginTop: 5,
                                    }}
                                    >
                                        {
                                            checkEpisodesStatus(item.episodesTotal, item.episodesAired, item.status)
                                        }
                                    </Text>
                                </View>
                            )
                        }

                        <View>
                            <Text
                            style={{
                                color: theme.text_color,
                                fontSize: normalizeSize(10),
                                borderColor: theme.divider_color,
                                backgroundColor: theme.divider_color + "98",
                                borderWidth: 1,
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: 5,
                                marginRight: 10,
                                marginTop: 5,
                            }}
                            >
                                {
                                    item.other.kind === "tv" ? "Сериал" :
                                    item.other.kind === "ona" ? "ONA" :
                                    item.other.kind === "ova" ? "OVA" :
                                    item.other.kind === "special" ? "Спешл" :
                                    item.other.kind === "movie" ? "Фильм" : "Неизвестно"
                                }, { 
                                    item.status === "released" ? "вышел" :
                                    item.status === "ongoing" ? "выходит" : 
                                    item.status === "anons" ? "анонсирован" : "неизвестно"
                                }
                            </Text>
                        </View>

                        {
                            item.other.year && (
                                <View>
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontSize: normalizeSize(10),
                                        borderColor: theme.divider_color,
                                        backgroundColor: theme.divider_color + "98",
                                        borderWidth: 1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                        marginRight: 10,
                                        marginTop: 5,
                                    }}
                                    >
                                        {item.other.year} год
                                    </Text>
                                </View>
                            )
                        }
                    </View>

                    <Text
                    numberOfLines={3}
                    style={{
                        color: theme.cell.subtitle_color,
                        fontStyle: item.description ? "normal" : "italic",
                        fontSize: normalizeSize(10)
                    }}
                    >
                        {
                            item.description ? item.description : "Описание не указано"
                        }
                    </Text>
                </View>
            }
            onPress={() => navigation.navigate("anime", { animeData: item })}
            />
        )
    };

    const renderFooter = () => {
        return (
            <Text
            style={{
                color: theme.text_secondary_color,
                textAlign: "center",
                marginHorizontal: 10,
                marginBottom: 15
            }}
            >
                Всего найдено {animes.length} аниме
            </Text>
        )
    };

    return (
        <FlatList
        data={animes}
        renderItem={renderList}
        keyExtractor={(item) => "anime-" + item.id}
        onEndReached={loadMoreAnimes}
        scrollEnabled
        keyboardShouldPersistTaps="always"
        ListFooterComponent={renderFooter}
        />
    );
};