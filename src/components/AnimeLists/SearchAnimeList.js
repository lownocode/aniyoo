import React, { useContext } from "react";
import { 
    View, 
    Image, 
    Text, 
    FlatList,
} from "react-native";

import { Cell, Icon, ContentHeader } from "../";

import ThemeContext from "../../config/ThemeContext";
import { normalizeSize, declOfNum } from "../../functions";

export const SearchAnimeList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        list,
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
                        fontSize: 15,
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
                    {
                        item.origTitle && (
                            <Text
                            numberOfLines={2}
                            style={{
                                fontSize: 12,
                                color: theme.text_secondary_color
                            }}
                            >
                                {
                                    item.origTitle
                                }
                            </Text>
                        )
                    }
                </View>
            }
            centered={false}
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
                        width: 95,
                        height: 135,
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
                                    fontSize: 12,
                                    paddingVertical: 1,
                                    paddingHorizontal: 3,
                                    fontWeight: "500"
                                }}
                                >
                                    {
                                        {
                                            "watching": "Смотрю",
                                            "completed": "Просмотрено",
                                            "planned": "В планах",
                                            "postponed": "Отложено",
                                            "dropped": "Брошено"
                                        }[item.inList]
                                    }
                                </Text>
                            </View>
                        )
                    }
                </View>
            }
            subtitle={
                <View style={{ marginTop: 5 }}>
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
                                        fontSize: 12,
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
                                        fontSize: 12,
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
                                fontSize: 12,
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
                                    {
                                        "tv": "Сериал",
                                        "ona": "ONA",
                                        "ova": "OVA",
                                        "special": "Спешл",
                                        "movie": "Фильм"
                                    }[item.other.kind]
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
                                        fontSize: 12,
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
                        fontSize: 12
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

    return (
        <FlatList
        data={list.animes}
        renderItem={renderList}
        keyExtractor={(item) => "anime-" + item.id}
        onEndReached={loadMoreAnimes}
        scrollEnabled
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        ListHeaderComponent={
            <View
            style={{
                marginTop: 15,
                marginBottom: 5
            }}
            >
                <ContentHeader
                icon={
                    <Icon
                    name="description"
                    color={theme.text_secondary_color}
                    />
                }
                text={`Найдено ${list.count} аниме`}
                after={
                    <View
                    style={{
                        marginRight: 10
                    }}
                    >
                        <Icon
                        name="chevron-down"
                        color={theme.text_color}
                        />
                    </View>
                }
                />
            </View>
        }
        />
    );
};