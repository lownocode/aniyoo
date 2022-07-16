import React, { useContext, useState } from "react";
import { 
    View, 
    Image, 
    Text, 
    ScrollView, 
    TouchableNativeFeedback, 
    FlatList,
    Vibration
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import ThemeContext from "../config/ThemeContext";
import { declOfNum } from "../functions";

import { Cell, Rating, Icon } from ".";
import { Placeholder } from "./Placeholder";

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

export const DiscussedTodayAnimeList = (props) => {
    const theme = useContext(ThemeContext);

    const { animes = [] } = props;
    
    return (
        <View>
            {
                animes.length < 1 ? (
                    <Placeholder
                    title="Пусто"
                    subtitle="Сегодня ещё ни одно аниме не прокомментировали"
                    />
                ) : 
                animes.map((item, index) => {
                    return (
                        <Cell
                        key={"anime_" + index}
                        title={item?.title}
                        maxTitleLines={2}
                        centeredBefore
                        centered={false}
                        before={
                            <View 
                            style={{
                                backgroundColor: theme.divider_color,
                                borderRadius: 5,
                            }}>
                                <Image
                                resizeMethod="resize"
                                source={{
                                    uri: item?.poster
                                }}
                                style={{
                                    width: 60,
                                    height: 90,
                                    resizeMode: "cover",
                                    borderRadius: 5,
                                    borderColor: theme.divider_color,
                                    borderWidth: 0.5
                                }}
                                />
                                <LinearGradient
                                colors={['transparent', 'rgba(16, 112, 222, .5)', 'rgba(16, 112, 222, .7)', 'rgba(16, 112, 222, 1)' ]}
                                style={{
                                    width: "100%",
                                    flex: 1,
                                    borderBottomLeftRadius: 5,
                                    borderBottomRightRadius: 5,
                                    position: "absolute",
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                >
                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        color: "#fff",
                                        fontSize: 8.8,
                                        marginTop: 3,
                                        fontWeight: "500",
                                        marginHorizontal: 2
                                    }}
                                    >
                                        Просмотрено
                                    </Text>
                                </LinearGradient>
                            </View>
                        }
                        subtitle={
                            <View>
                                {
                                    Number(item.grade) > 0 && (
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                        >
                                            <Rating
                                            length={5}
                                            select={String(item.grade).split(".")[0]}
                                            iconSelect={<Icon type="AntDesign" name="star" color="gold"/>}
                                            iconUnselect={<Icon type="AntDesign" name="staro" color="gray"/>}
                                            />

                                            <Text
                                            style={{
                                                color: theme.text_secondary_color,
                                                fontSize: 10,
                                                marginLeft: 3
                                            }}
                                            >
                                                {item.grade}
                                            </Text>
                                        </View>
                                    )
                                }

                                <View style={{
                                    marginTop: 5,
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontSize: 10,
                                        borderColor: theme.divider_color,
                                        borderWidth: 1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                    }}
                                    >
                                        Комментариев за сегодня: <Text style={{fontWeight: "700"}}>{item.comments_per_day}</Text>
                                    </Text>
                                </View>
                                
                                <View style={{
                                    marginTop: 5,
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                    <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                    >
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontSize: 10,
                                        borderColor: theme.divider_color,
                                        borderWidth: 1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                    }}
                                    >
                                        {
                                            item.episodes.total === item.episodes.count ? (
                                                <Text>
                                                    <Text style={{fontWeight: "700"}}>{item?.episodes?.total || "?"}</Text> серий
                                                </Text> 
                                            ) : (
                                                <Text>
                                                    <Text style={{fontWeight: "700"}}>{item?.episodes?.count || "?"}</Text> из <Text style={{fontWeight: "700"}}>{item?.episodes?.total || "?"}</Text> серий
                                                </Text>
                                            )
                                        }
                                    </Text>

                                    <View
                                    style={{
                                        borderColor: theme.divider_color,
                                        borderWidth: 1,
                                        paddingHorizontal: 6,
                                        paddingVertical: 1,
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: 5
                                    }}
                                    >
                                        <Icon
                                        name="bookmark"
                                        type="FontAwesome"
                                        color="gold"
                                        size={10}
                                        />
                                    </View>
                                    </View>
                                </View>
                            </View>
                        }
                        />
                    )
                })
            }
        </View>
    )
};

export const HorizontalAnimeList = (props) => {
    const theme = useContext(ThemeContext);
    
    const { style, animes = [] } = props;

    return (
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            justifyContent: "center",
            flex: animes.length < 1 ? 1 : 0
        }}
        >
            {
                animes.length < 1 ? (
                    <Placeholder
                    style={style}
                    title="Пусто"
                    subtitle="Сегодня ещё ни одно аниме не прокомментировали"
                    />
                ) :
                animes.map((item, index) => {
                    return (
                        <View 
                        key={"anime_" + index}
                        >
                            <View
                            style={{
                                borderRadius: 8,
                                overflow: "hidden",
                                marginLeft: index === 0 ? 10 : 0,
                                marginRight: index === animes.length - 1 ? 10 : 0
                            }}
                            >
                            <TouchableNativeFeedback
                            onPress={() => console.log("on press release")}
                            background={null}
                            >
                                <View>  
                                    <View
                                    style={{
                                        marginVertical: 5,
                                        marginHorizontal: 7,
                                        backgroundColor: theme.divider_color,
                                        borderRadius: 5,
                                    }}
                                    >
                                        <Image
                                        resizeMethod="resize"
                                        source={{
                                            uri: item?.poster
                                        }}
                                        style={{
                                            width: 100,
                                            height: 150,
                                            resizeMode: "cover",
                                            borderRadius: 5,
                                            borderColor: theme.divider_color,
                                            borderWidth: 0.5
                                        }}
                                        />

                                        <LinearGradient
                                        colors={['transparent', 'rgba(16, 112, 222, .5)', 'rgba(16, 112, 222, .7)', 'rgba(16, 112, 222, 1)' ]}
                                        style={{
                                            width: "100%",
                                            flex: 1,
                                            borderBottomLeftRadius: 5,
                                            borderBottomRightRadius: 5,
                                            position: "absolute",
                                            bottom: 0,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        >
                                            <Text
                                            numberOfLines={1}
                                            style={{
                                                color: "#fff",
                                                fontSize: 12,
                                                marginTop: 3,
                                                fontWeight: "500"
                                            }}
                                            >
                                                Просмотрено
                                            </Text>
                                        </LinearGradient>
                                    </View>

                                    <View 
                                    style={{ 
                                        marginHorizontal: 5,
                                        width: 100
                                    }}>
                                        <Text
                                        numberOfLines={2}
                                        style={{
                                            fontSize: 13,
                                            color: theme.text_color,
                                            fontWeight: "500"
                                        }}
                                        >
                                            {item?.title}
                                        </Text>

                                        <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            marginTop: 5
                                        }}
                                        >
                                            <View
                                            style={{
                                                borderColor: theme.divider_color,
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                paddingHorizontal: 5,
                                                paddingVertical: 1
                                            }}
                                            >
                                                <Text
                                                style={{
                                                    color: theme.text_color,
                                                    fontSize: 10
                                                }}
                                                >
                                                    <Text style={{fontWeight: "700"}}>12 </Text>
                                                    серия
                                                </Text>
                                            </View>

                                            <View
                                            style={{
                                                borderColor: theme.divider_color,
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                paddingVertical: 4,
                                                paddingHorizontal: 6,
                                                marginLeft: 4
                                            }}
                                            >
                                                <Icon
                                                name="bookmark"
                                                type="FontAwesome"
                                                color="gold"
                                                size={10}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
    )
};

export const FoundedAnimeList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        animes,
        loadMoreAnimes,
        navigation
    } = props;

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
                        fontSize: 16,
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
                        width: 100,
                        height: 145,
                        resizeMode: "cover",
                        borderRadius: 7,
                        borderColor: theme.divider_color,
                        borderWidth: 0.5
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
                        fontStyle: item.description ? "normal" : "italic"
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
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreAnimes}
        scrollEnabled
        keyboardShouldPersistTaps="always"
        ListFooterComponent={renderFooter}
        />
    );
};

export const MyAnimeList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        animes,
        loadMoreAnimes,
        navigation
    } = props;

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
                        fontSize: 16,
                    }}
                    >
                        {
                            item.isFavorite && (
                                <Icon
                                name="bookmark"
                                color="#e2b227"
                                size={17}
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
                    <Image
                    resizeMethod="resize"
                    source={{
                        uri: item?.poster
                    }}
                    style={{
                        width: 100,
                        height: 145,
                        resizeMode: "cover",
                        borderRadius: 7,
                        borderColor: theme.divider_color,
                        borderWidth: 0.5,
                        backgroundColor: theme.divider_color,
                    }}
                    />
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

                        {
                            item?.other?.kind && (
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
                            )
                        }

                        {
                            item?.other?.year && (
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
                        fontStyle: item.description ? "normal" : "italic"
                    }}
                    >
                        {
                            item.description ? item.description : "Описание не указано"
                        }
                    </Text>
                </View>
            }
            onPress={() => navigation.navigate("anime", { animeData: { ...item, id: item.animeId } })}
            onLongPress={() => Vibration.vibrate(100)}
            />
        )
    };

    return (
        <FlatList
        data={animes}
        renderItem={renderList}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreAnimes}
        scrollEnabled
        keyboardShouldPersistTaps="always"
        />
    );
};