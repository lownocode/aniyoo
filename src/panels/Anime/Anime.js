import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { 
    View, 
    ScrollView, 
    StatusBar, 
    Image, 
    TouchableNativeFeedback,
    Dimensions,
    Text,
    StyleSheet,
    ToastAndroid,
    RefreshControl,
    Linking,
    ActivityIndicator,
    TouchableWithoutFeedback
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import LinearGradient from "react-native-linear-gradient";
import ImageColors from "react-native-image-colors";
import { Menu as Popup } from "react-native-material-menu";
import Clipboard from "@react-native-community/clipboard";
import { showNavigationBar } from "react-native-navigation-bar-color";
import Orientation from "react-native-orientation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";
import { 
    declOfNum, 
    storage, 
    getAnimeAccentColor,
    invertColor,
    normalizeSize
} from "../../functions";

import { 
    Icon,
    Button,
    Divider,
    Cell,
    ContentHeader,
    Avatar,
    Placeholder,
    Progress,
    DonutChart,
    Rating,
    FormattedText,
} from "../../components";
import { AnimeSetList, CommentActions } from "../../modals";
import { FLAGS, DOMAIN } from "../../../variables";

export const Anime = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const route = useRoute();
    const scrollViewRef = useRef();
    const modalRef = useRef();

    const [ refreshing, setRefreshing ] = useState(true);
    const [ animeData, setAnimeData ] = useState(route.params?.animeData);
    const [ hideDescription, setHideDescription ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);
    const [ linkedAnimes, setLinkedAnimes ] = useState({});
    const [ descriptionLinesCount, setDescriptionLinesCount ] = useState(0);
    const [ posterColors, setPosterColors ] = useState({});
    const [ animeStatus, setAnimeStatus ] = useState({ status: "NO_WATCHED" });
    const [ popupVisible, setPopupVisible ] = useState(false);
    const [ comments, setComments ] = useState({});
    const [ stats, setStats ] = useState({});
    const [ marks, setMarks ] = useState({});
    const [ markLoading, setMarkLoading ] = useState(0);
    const [ loadingBackToWatch, setLoadingBackToWatch ] = useState(false);
    const [ playlists, setPlaylists ] = useState([]);
    const [ addToPlanneLoading, setAddToPlannedLoading ] = useState(false);

    const accent = getAnimeAccentColor(posterColors?.dominant || theme.text_color, theme.name);

    const ratingMPAADecode = {
        "G": "0+",
        "PG": "6+",
        "PG-13": "16+",
        "R": "18+",
        "NC-17": "18+",
    };

    const playlistKindDecode = {
        "pv": ["трейлер", "трейлера", "трейлеров"],
        "op": ["опенинг", "опенинга", "опенингов"],
        "ed": ["эндинг", "эндинга", "эндингов"],
        "op_ed_clip": ["музыкальный клип", "музыкальных клипа", "музыкальных клипов"],
        "episode_preview": ["превью", "превью", "превью"],
        "other": ["другое", "других", "других"]
    };

    const getAnimeData = async (id) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.get", {
            animeId: id || route.params?.animeData?.id
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setAnimeData(data);
            getAnimeStatusInLocalStorage();
            getExtendeds(data.id);

            setRefreshing(false);
        })
        .catch(({ response: { data } }) => {
            console.log("err\n", data);
        });
    };

    const getExtendeds = async (id) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.get", {
            animeId: id || route.params?.animeData?.id,
            extended: true
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setStats(data.stats);
            setPlaylists(data.playlists);
            setLinkedAnimes({
                count: data.linkedCount,
                items: data.linked
            });
            setMarks({
                userMark: data.userMark,
                items: data.marks
            });
            setComments({
                count: data.commentsCount,
                items: data.comments
            });
        })
        .catch(({ response: { data } }) => {
            console.log("err\n", data);
        });
    };

    const backToWatch = async () => {
        setLoadingBackToWatch(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getVideoLink", {
            animeId: animeStatus?.data?.id,
            translationId: animeStatus?.data?.translationId,
            episode: animeStatus?.data?.episode,
            source: animeStatus?.data?.source
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            navigate("anime.videoplayer", {
                videos: data.links,
                data: {
                    translation: animeStatus?.data?.translation,
                    episodesCount: animeData?.episodesAired,
                    playedEpisode: animeStatus?.data?.episode,
                    title: animeData?.title,
                    opening: data.opening,
                    ending: data.ending
                },
                translationId: animeStatus?.data?.translationId,
                animeId: animeData?.id,
                source: animeStatus?.data?.source
            });
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        })
        .finally(() => setLoadingBackToWatch(false));
    };

    const setPlannedAnime = async () => {
        setAddToPlannedLoading(true);

        setAnimeData({
            ...animeData,
            inList: animeData?.inList === "planned" ? "none" : "planned"
        });
        setStats({
            ...stats,
            planned: animeData?.inList === "planned" ? stats?.planned - 1 : stats?.planned + 1
        });

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/lists.add", {
            animeId: animeData?.id,
            status: animeData?.inList === "planned" ? "none" : "planned"
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(() => {
            getAnimeData(animeData?.id);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
            getAnimeData(animeData?.id);
        })
        .finally(() => setAddToPlannedLoading(false));
    };

    const setIsFavorite = async () => {
        const newAnimeStatsData = Object.defineProperty(stats, "favorite", { value: animeData?.isFavorite ? stats?.favorite - 1 : stats?.favorite + 1 });
        setAnimeData({
            ...animeData,
            stats: newAnimeStatsData,
            isFavorite: !animeData?.isFavorite
        });

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/lists.add", {
            animeId: animeData?.id,
            status: "favorite"
        }, {
            headers: {
                "Authorization": sign,
            }
        })
        .then(() => {
            getAnimeData(animeData?.id, false);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
            getAnimeData(animeData?.id, false);
        });
    };

    const getAnimeStatusInLocalStorage = async () => {
        const view = await storage.getItem(`ANIME_VIEW__ID=${animeData?.id || 0}`);

        if(view === null) return;

        setAnimeStatus({
            status: "WATCHED_BEFORE",
            data: view[view.length - 1]
        })
    };

    const getPosterColors = async () => {
        const colors = await ImageColors.getColors(animeData?.poster, {
            fallback: theme.text_color,
            cache: false,
            quality: "high"
        });
        
        setPosterColors(colors);
    };

    const addAnimeToList = (list) => {
        setAnimeData({
            ...animeData,
            inList: list
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAnimeData(route.params?.animeData?.id, true);
    }, []);
    
    useEffect(() => {
        getPosterColors();
    }, [animeData]);

    useEffect(() => {
        const willFocusSubscription = navigation.addListener("focus", () => {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
            showNavigationBar();
            getAnimeData();
        });
    
        return willFocusSubscription;
    }, []);

    const openUrl = (link) => {
        const validLink = Linking.canOpenURL(link);
        if(!validLink) {
            return ToastAndroid.show("Невозможно открыть эту ссылку", ToastAndroid.LONG);
        }

        return Linking.openURL(link);
    };

    const seriesCount = (total, aired, status) => {
        if(typeof total !== "number" || Number.isNaN(total) || typeof aired !== "number" || Number.isNaN(aired)) {
            return "?"
        }
        else if(total === aired) {
            return total;
        }
        else if(total && !aired) {
            return total;
        }
        else if(!total && aired && status === "ongoing") {
            return `${aired} из ?`
        }
    
        return `${aired} из ${total}`;
    };

    const renderGenres = (genre, index) => {
        return (
            <View
            style={{
                borderWidth: 0.5,
                borderColor: accent,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 100,
                marginLeft: 7,
                marginBottom: 7
            }}
            key={"genre-" + index}
            >
                <Text
                style={{
                    color: accent
                }}
                >
                    {genre}
                </Text>
            </View>
        )
    };
;
    const durationFormatter = (minutes) => {
        minutes = Number(minutes);
        if(minutes === null || minutes === NaN) return null;

        if(minutes <= 60) {
            return minutes + " " + declOfNum(minutes, ["минута", "минуты", "минут"]);
        }
        
        const hours = Math.trunc(minutes / 60);
        const mins = minutes % 60;

        if(mins === 0) {
            return `${hours} ${declOfNum(hours, ["час", "часа", "часов"])}`;
        }

        return `${hours} ${declOfNum(hours, ["час", "часа", "часов"])} ${mins} ${declOfNum(mins, ["минута", "минуты", "минут"])}`;
    };

    const WrapperAnimeInfo = (props) => {
        const {
            title,
            subtitle,
            icon,
        } = props;

        return (
            <View
            style={{
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: theme.divider_color,
                paddingVertical: 5,
                paddingHorizontal: 15,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 10,
                flexGrow: 1,
                justifyContent: "center"
            }}
            >
                <View
                style={{
                    marginRight: 10
                }}
                >
                    {icon}
                </View>

                <View>
                    <Text
                    style={{
                        color: theme.cell.title_color,
                        textAlign: "center"
                    }}
                    >
                        {title}
                    </Text>

                    <Text
                    style={{
                        color: theme.cell.subtitle_color
                    }}
                    >
                        {subtitle}
                    </Text>
                </View>
            </View>
        )
    };

    const renderFrames = (image, index) => {
        if(typeof image !== "string") return;

        return (
            <View
            key={"image_frame-" + index}
            style={{
                marginRight: index + 1 === animeData?.screenshots?.length ? 15 : 10,
                marginLeft: index === 0 ? 15 : 0,
                borderRadius: 8,
                backgroundColor: theme.divider_color
            }}
            >
                <Image
                style={{
                    width: normalizeSize(200),
                    height: normalizeSize(110),
                    borderRadius: 8
                }}
                resizeMethod="resize"
                source={{
                    uri: image
                }}
                />
            </View>
        )
    };

    const renderPlaylists = (item, index) => {
        return (
            <View
            key={"playlist-" + index}
            style={{
                marginRight: index + 1 === playlists?.length ? 15 : 10,
                marginLeft: index === 0 ? 15 : 0,
                borderRadius: 8,
                backgroundColor: accent + "90",
                overflow: "hidden",
            }}
            >
                <Image
                style={{
                    width: normalizeSize(200),
                    height: normalizeSize(110),
                    borderRadius: 8,
                }}
                resizeMethod="resize"
                source={{
                    uri: item.image
                }}
                />

                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple("#ffffff20", false)}
                onPress={() => 
                    navigate("anime.playlists", { 
                        animeId: animeData?.id, 
                        animeTitle: animeData?.title,
                        animePoster: animeData?.poster,
                        selectKind: item?.kind
                    })
                }
                >
                    <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, .5)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                        <View
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 0,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                            {
                                item.hostings.map((hosting, index) => {
                                    return (
                                        <View key={"hosting-" + index}>
                                            {
                                                {
                                                    "vk": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="vk-video-logo"
                                                            size={20}
                                                            />
                                                        </View>
                                                    ),
                                                    "youtube": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="youtube-logo"
                                                            size={25}
                                                            />
                                                        </View>
                                                    ),
                                                    "sibnet": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="sibnet-logo"
                                                            size={25}
                                                            />
                                                        </View>
                                                    )
                                                }[hosting]
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>

                        <Text
                        style={{
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: normalizeSize(20),
                            textTransform: "uppercase",
                            marginHorizontal: 20,
                            textAlign: "center"
                        }}
                        >
                            {
                                item.count
                            }
                        </Text>

                        <Text
                        style={{
                            color: "#dedede",
                            fontWeight: "500",
                            fontSize: normalizeSize(14),
                            textTransform: "uppercase",
                            marginHorizontal: 20,
                            textAlign: "center",
                        }}
                        >
                            {
                                declOfNum(item?.count || 0, playlistKindDecode[item?.kind] || ["", "", ""])
                            }
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    };

    const renderLinked = (item, index) => {
        return (
            <View
            key={"linked-anime-" + index}
            >
                <Cell
                title={item.title}
                centered={false}
                maxTitleLines={2}
                onPress={() => navigation.push("anime", { animeData: { id: item.id } })}
                before={
                    <View 
                    style={{
                        borderRadius: 6, 
                        backgroundColor: theme.divider_color,
                        position: "relative",
                        overflow: "hidden",
                    }}
                    >
                        <Image
                        resizeMethod="resize"
                        style={{
                            width: normalizeSize(60),
                            height: normalizeSize(85),
                        }}
                        source={{
                            uri: item?.poster
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
                containerStyle={{
                    opacity: item.id ? 1 : .3,
                    backgroundColor: item.id === animeData?.id ? accent + "10" : "transparent"
                }}
                disabled={!item.id || item.id === animeData?.id}
                subtitle={
                    <View>
                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}
                        >
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
                                    {item?.year || "Неизвестный"} год
                                </Text>
                            </View>

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
                                        {
                                            "tv": "Сериал",
                                            "ona": "ONA",
                                            "ova": "OVA",
                                            "special": "Спешл",
                                            "movie": "Фильм"
                                        }[item.kind]
                                    }
                                </Text>
                            </View>
                        </View>

                        <Text
                        numberOfLines={3}
                        style={{
                            color: theme.text_secondary_color,
                            fontSize: normalizeSize(11)
                        }}
                        >
                            {   
                                item.description || "Описание не указано"
                            }
                        </Text>
                    </View>
                }
                />
            </View>
        )
    };

    const totalWatchingTime = (type, episodesTotal, episodesAired, duration) => {
        if(type !== "anime-serial" || episodesTotal === 0 && episodesAired === 0) return null;

        if(episodesTotal === episodesAired) {
            return durationFormatter(duration * episodesTotal);
        }
        else if(episodesTotal && !episodesAired) {
            return durationFormatter(duration * episodesTotal);
        }
        else if(!episodesTotal && episodesAired) {
            return durationFormatter(duration * episodesAired); 
        }

        return durationFormatter(duration * episodesTotal);
    };

    const renderComments = (comment) => {
        const markComment = async (commentId, mark) => {
            const sign = await storage.getItem("AUTHORIZATION_SIGN");
    
            axios.post("/comments.mark", {
                commentId: commentId,
                mark: mark
            }, {
                headers: {
                    "Authorization": sign
                }
            })
            .then(({ data }) => {
                const newCommentsData = comments?.items?.map(comment => {
                    if(comment.id === commentId) {
                        return { 
                            ...comment, 
                            mark: data.mark,
                            rating: data.rating
                        }
                    }

                    return comment;
                });

                setAnimeData({
                    ...animeData,
                    comments: newCommentsData
                });
                
            })
            .catch(({ response: { data } }) => {
                ToastAndroid.show(data.message, ToastAndroid.CENTER);
            });
        };

        return (
            <Cell
            key={"comment-" + comment.id}
            title={comment.user.nickname}
            centered={false}
            centeredAfter={false}
            onPress={() => {
                setModalContent(
                    <CommentActions 
                    onClose={() => modalRef.current?.close()} 
                    comment={comment} 
                    successEditing={() => {
                        getAnimeData();
                    }}
                    />
                );
                modalRef.current?.open();
            }}
            subtitle={
                <View>
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Text
                        style={{
                            color: theme.cell.subtitle_color,
                            marginRight: 5
                        }}
                        >
                            {dayjs().to(comment.createdAt)}
                        </Text>

                        {
                            comment.editedAt && (
                                <Icon
                                name="pencil-write"
                                size={10}
                                color={theme.cell.subtitle_color}
                                />
                            )
                        }
                    </View>

                    {
                            comment.text ? (
                                <Text
                                selectable
                                selectionColor={accent}
                                style={{
                                    marginTop: 3,
                                    color: theme.text_color,
                                }}
                                >
                                    {
                                        comment.text
                                    }
                                </Text>
                            ) : (
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                                >
                                    <Icon
                                    name="trash-outline"
                                    color={theme.text_secondary_color}
                                    />

                                    <Text
                                    style={{
                                        marginTop: 3,
                                        color: theme.text_secondary_color,
                                        marginLeft: 5,
                                        fontStyle: "italic"
                                    }}
                                    >
                                        Комментарий удалён.
                                    </Text>
                                </View>
                            )
                    }
                </View>
            }
            additionalContentBottom={
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginRight: 15,
                }}
                >
                    <View
                    style={{
                        marginTop: -10
                    }}
                    >
                        <View style={{ alignItems: "flex-start" }}>
                            <Button
                            title="Ответить"
                            upperTitle={false}
                            type="overlay"
                            containerStyle={{
                                marginTop: 0,
                                marginBottom: 3
                            }}
                            onPress={() => navigate("anime.reply_comments", {
                                commentId: comment.id,
                                animeId: animeData?.id,
                                reply: {
                                    id: comment.id,
                                    user: comment.user
                                }
                            })}
                            size="s"
                            textColor={theme.text_secondary_color}
                            />
                        </View>
                        
                        <View>
                            {
                                comment.replies >= 1 && (
                                    <Button
                                    title={`Смотреть ${comment.replies} ${declOfNum(comment.replies, ["ответ", "ответа", "ответов"])}`}
                                    upperTitle={false}
                                    type="overlay"
                                    textColor={theme.text_secondary_color}
                                    containerStyle={{
                                        marginTop: 0
                                    }}
                                    onPress={() => navigate("anime.reply_comments", {
                                        commentId: comment.id,
                                        animeId: animeData?.id
                                    })}
                                    size={30}
                                    textStyle={{
                                        fontSize: normalizeSize(11.5)
                                    }}
                                    before={
                                        <Icon
                                        name="reply"
                                        color={theme.text_secondary_color}
                                        size={13}
                                        />
                                    }
                                    />
                                )
                            }
                        </View>
                    </View>
                    
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: -10
                    }}
                    >
                        <View
                        style={{
                            borderRadius: 100,
                            overflow: "hidden",
                            borderColor: theme.divider_color,
                            borderWidth: comment.mark === "down" ? 0 : 1,
                            backgroundColor: comment.mark === "down" ? "#f54242" : "transparent"
                        }}
                        >
                            <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                            onPress={() => markComment(comment.id, "down")}
                            >
                                <View
                                style={{
                                    paddingVertical: 2,
                                    paddingHorizontal: 15,
                                }}
                                >
                                    <Icon
                                    name="chevron-down"
                                    color={comment.mark === "down" ? "#fff" : theme.icon_color}
                                    size={15}
                                    />
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        <Text
                        style={{
                            marginHorizontal: 10,
                            fontWeight: "500",
                            color: comment.mark === "up" ? theme.accent : comment.mark === "down" ? "#f54242" : theme.text_secondary_color
                        }}
                        >
                            {comment.rating}
                        </Text>

                        <View
                        style={{
                            borderRadius: 100,
                            overflow: "hidden",
                            borderColor: theme.divider_color,
                            borderWidth: comment.mark === "up" ? 0 : 1,
                            backgroundColor: comment.mark === "up" ? theme.accent : "transparent"
                        }}
                        >
                            <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                            onPress={() => markComment(comment.id, "up")}
                            >
                                <View
                                style={{
                                    paddingVertical: 2,
                                    paddingHorizontal: 15,
                                }}
                                >
                                    <Icon
                                    name="chevron-up"
                                    color={comment.mark === "up" ? "#fff" : theme.icon_color}
                                    size={15}
                                    />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            }
            before={
                <Avatar 
                url={comment.user.photo}
                online={(+new Date() - +new Date(comment?.user?.online?.time)) < 1 * 60 * 1000}
                size={35}
                />
            }
            />
        )
    }; 

    const lists = [
        {
            name: "Смотрю",
            icon: (
                <Icon
                name="eye"
                color={theme.text_secondary_color}
                size={12}
                />
            ),
        },
        {
            name: "Просмотрено",
            icon: (
                <Icon
                name="done-double"
                color={theme.text_secondary_color}
                size={12}
                />
            )
        },
        {
            name: "В планах",
            icon: (
                <Icon
                name="calendar"
                color={theme.text_secondary_color}
                size={10}
                />
            )
        },
        {
            name: "Отложено",
            icon: (
                <Icon
                name="pause-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        },
        {
            name: "Брошено",
            icon: (
                <Icon
                name="cancel-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        }
    ];

    const statisticsChartValues = [
        stats?.watching || 0,
        stats?.completed || 0,
        stats?.planned || 0,
        stats?.postponed || 0,
        stats?.dropped || 0,
    ];
    const statisticsChartColors = [theme.anime.watching, theme.anime.completed, theme.anime.planned, theme.anime.postponed, theme.anime.dropped];
    
    const statisticsChartData = statisticsChartValues.map((value, index) => ({
        value,
        svg: {
            fill: statisticsChartColors[index],
        },
        key: `pie-${index}`,
    }));

    const renderStatistics = (item, index) => {
        return (
            <View
            key={"list-" + index}
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: index !== 0 ? 5 : 0
            }}
            >
                <View
                style={{
                    paddingVertical: 3,
                    paddingLeft: 4,
                    paddingRight: 6,
                    borderRadius: 100,
                    borderWidth: 0.5,
                    borderColor: statisticsChartColors[index] + "90",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: normalizeSize(15),
                    width: normalizeSize(30)
                }}
                >
                    <View
                    style={{
                        width: normalizeSize(8),
                        height: normalizeSize(8),
                        borderRadius: 100,
                        backgroundColor: statisticsChartColors[index],
                        marginRight: 5
                    }}
                    />

                    {
                        item.icon
                    }
                </View>

                <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                >
                    <Text
                    style={{
                        marginLeft: 10,
                        fontSize: normalizeSize(12),
                        fontWeight: "500",
                        color: theme.text_secondary_color + "90"
                    }}
                    >
                        {
                            item.name
                        }
                    </Text>

                    <Text
                    style={{
                        marginLeft: 6,
                        fontWeight: "700",
                        color: theme.text_secondary_color,
                        fontSize: normalizeSize(12.5)
                    }}
                    > 
                        {
                            statisticsChartValues[index]
                        }
                    </Text>
                </View>
            </View>
        )
    };

    const markAnime = async (v) => {
        setMarkLoading(v);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.mark", {
            animeId: animeData?.id,
            mark: v
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setMarks({
                items: data.marks,
                userMark: v === marks?.userMark ? null : v
            });
            setMarkLoading(0);
        })
        .catch(({ reponse: { data } }) => {
            console.log(data);
        });
    };

    const animeCopyLink = () => {
        const copyString = DOMAIN + `anime?id=${animeData?.id}`;
        Clipboard.setString(copyString);
        ToastAndroid.show("Ссылка скопирована в буфер обмена", ToastAndroid.CENTER);
        setPopupVisible(false);
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
            <View
            style={{
                position: "absolute",
                top: StatusBar.currentHeight + 20,
                left: 20,
                backgroundColor: theme.background_content,
                borderRadius: 100,
                width: normalizeSize(33),
                height: normalizeSize(33),
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
                borderWidth: 0.5,
                borderColor: theme.divider_color
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, true)}
                onPress={() => goBack()}
                >
                    <View
                    style={{
                        
                        padding: 9
                    }}
                    >
                        <Icon
                        name="arrow-back"
                        color={theme.text_color}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>

            <View
            style={{
                position: "absolute",
                top: StatusBar.currentHeight + 20,
                right: 20,
                backgroundColor: theme.background_content,
                borderRadius: 100,
                width: normalizeSize(33),
                height: normalizeSize(33),
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                borderWidth: 0.5,
                borderColor: theme.divider_color,
            }}
            >
                <Popup
                visible={popupVisible}
                onRequestClose={() => setPopupVisible(false)}
                animationDuration={100}
                style={{
                    backgroundColor: theme.popup_background,
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                anchor={
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, true)}
                    onPressIn={() => setPopupVisible(true)}
                    >
                        <View
                        style={{
                            padding: 9
                        }}
                        >
                            <Icon
                            name="four-dots"
                            color={theme.text_color}
                            />
                        </View>
                    </TouchableNativeFeedback>
                }
                >
                    <Cell
                    title="Подробная информация"
                    before={
                        <Icon
                        name="textbox-more"
                        color={theme.icon_color}
                        />
                    }
                    containerStyle={{
                        paddingVertical: 15
                    }}
                    contentStyle={{
                        flex: 0
                    }}
                    />

                    <Divider />

                    <Cell
                    title="Скопировать ссылку"
                    onPress={() => animeCopyLink()}
                    before={
                        <Icon
                        name="external-link"
                        color={theme.icon_color}
                        />
                    }
                    containerStyle={{
                        paddingVertical: 15
                    }}
                    contentStyle={{
                        flex: 0
                    }}
                    />

                    <Divider />

                    <Cell
                    title="Поделиться"
                    flexedContent={false}
                    before={
                        <Icon
                        color={theme.icon_color}
                        name="share"
                        />
                    }
                    containerStyle={{
                        paddingVertical: 15
                    }}
                    contentStyle={{
                        flex: 0
                    }}
                    />
                </Popup>
            </View>

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>

            <View>
                <ScrollView 
                showsVerticalScrollIndicator={false} 
                ref={scrollViewRef}
                overScrollMode="never"
                refreshControl={
                    <RefreshControl
                    progressBackgroundColor={theme.refresh_control_background}
                    colors={[accent]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
                >
                    <View
                    style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                    >
                        <View>
                            <Image
                            source={{
                                uri: animeData?.poster
                            }}
                            resizeMode="cover"
                            style={{
                                width: Dimensions.get("window").width,
                                height: normalizeSize(400),
                                opacity: 0.5
                            }}
                            blurRadius={10}
                            />

                            <LinearGradient
                            colors={[
                                "transparent",
                                theme.background_content + "90",
                                theme.background_content
                            ]}
                            style={{
                                height: 200,
                                width: "100%",
                                position: "absolute",
                                bottom: 0,
                                justifyContent: "flex-end"
                            }}
                            />
                        </View>

                        <View
                        style={{
                            marginTop: normalizeSize(-400),
                        }}
                        >
                            <Image
                            source={{
                                uri: animeData?.poster
                            }}
                            resizeMethod="resize"
                            resizeMode="cover"
                            style={{
                                width: normalizeSize(170),
                                height: normalizeSize(240),
                                marginTop: StatusBar.currentHeight + 70,
                                borderRadius: 10,
                                zIndex: 12,
                                backgroundColor: theme.divider_color,
                            }}
                            onError={(e) => ToastAndroid.show(`Возникла ошибка при попытке загрузки постера\n${e.nativeEvent.error}`, ToastAndroid.CENTER)}
                            />
                        </View>
                    </View>

                    <View
                    style={{
                        marginTop: 10,
                        zIndex: 15,
                    }}
                    >
                        <View
                        style={{
                            marginBottom: 10,
                            alignItems: "center"
                        }}
                        >
                            <Text
                            selectable
                            selectionColor={accent}
                            numberOfLines={2}
                            style={{
                                fontSize: normalizeSize(16),
                                fontWeight: "500",
                                marginHorizontal: 15,
                                color: theme.text_color,
                                textAlign: "center"
                            }}
                            >
                                {
                                    animeData?.title
                                }
                            </Text>

                            <Text
                            selectable
                            selectionColor={accent}
                            numberOfLines={2}
                            style={{
                                marginHorizontal: 15,
                                textAlign: "center",
                                color: theme.text_secondary_color,
                                marginTop: 5
                            }}
                            >
                                {
                                    animeData?.origTitle
                                }
                            </Text>
                        </View>

                        <Button
                        title={
                            {
                                "NO_WATCHED": "Начать просмотр",
                                "WATCHED_BEFORE": "Продолжить просмотр"
                            }[animeStatus.status]
                        }
                        upperTitle={false}
                        backgroundColor={accent}
                        textColor={invertColor(accent, true)}
                        before={
                            {
                                "NO_WATCHED": (
                                    <Icon
                                    name="play"
                                    size={12}
                                    color={invertColor(accent, true)}
                                    />
                                ),
                                "WATCHED_BEFORE": (
                                    <Icon
                                    name="pause"
                                    size={12}
                                    color={invertColor(accent, true)}
                                    />
                                )
                            }[animeStatus.status]
                        }
                        size={45}
                        disabled={!animeData?.id || animeData?.status === "anons"}
                        onPress={() => navigate("anime.select_translation", { animeId: animeData?.id, title: animeData?.title })}
                        containerStyle={{
                            marginBottom: 0
                        }}
                        />

                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginBottom: 10
                        }}
                        >
                            <Button
                            title={
                                {
                                    "watching": "Смотрю",
                                    "completed": "Просмотрено",
                                    "planned": "В планах",
                                    "postponed": "Отложено",
                                    "dropped": "Брошено",
                                    "none": "Не в списке"
                                }[animeData?.inList]
                            }
                            onPress={() => {
                                setModalContent(
                                    <AnimeSetList 
                                    animeId={animeData?.id} 
                                    inList={animeData?.inList}
                                    getAnimeData={getAnimeData}
                                    addAnimeToList={addAnimeToList}
                                    onClose={() => modalRef.current?.close()}
                                    />
                                );
                                modalRef.current?.open();
                            }}
                            upperTitle={false}
                            backgroundColor={theme.anime[animeData?.inList || "none"]}
                            textColor="#ffffff"
                            size={35}
                            before={
                                animeData?.inList === "watching" ? (
                                    <Icon
                                    name="eye"
                                    size={17}
                                    color="#ffffff"
                                    />
                                ) :
                                animeData?.inList === "completed" ? (
                                    <Icon
                                    name="done-double"
                                    size={17}
                                    color="#ffffff"
                                    />
                                )  :
                                animeData?.inList === "planned" ? (
                                    <Icon
                                    name="calendar"
                                    size={17}
                                    color="#ffffff"
                                    />
                                )  :
                                animeData?.inList === "postponed" ? (
                                    <Icon
                                    name="pause-rounded"
                                    size={17}
                                    color="#ffffff"
                                    />
                                )  :
                                animeData?.inList === "dropped" ? (
                                    <Icon
                                    name="cancel"
                                    size={17}
                                    color="#ffffff"
                                    />
                                )  : (
                                    <Icon
                                    name="chevron-down"
                                    size={17}
                                    color="#ffffff"
                                    />
                                )
                            }
                            containerStyle={{
                                marginRight: 0
                            }}
                            />

                            <View>
                                <Button
                                title={stats?.favorite || "0"}
                                upperTitle={false}
                                loading={refreshing}
                                type={animeData?.isFavorite ? "primary" : "outline"}
                                backgroundColor={animeData?.isFavorite ? "#c78b16" : theme.icon_color}
                                size={35}
                                textColor={animeData?.isFavorite ? "#ffffff" : theme.icon_color}
                                before={
                                    animeData?.isFavorite ? (
                                        <Icon
                                        name="bookmark"
                                        size={17}
                                        />
                                    ) : (
                                        <Icon
                                        name="bookmark-outline"
                                        size={17}
                                        color={theme.icon_color}
                                        />
                                    )
                                }
                                onPress={() => setIsFavorite()}
                                />
                            </View>
                        </View>

                        {
                            animeStatus?.status === "WATCHED_BEFORE" && (
                                <LinearGradient
                                style={{
                                    marginHorizontal: 10,
                                    marginBottom: 10,
                                    zIndex: 0,
                                    borderRadius: 10,
                                    overflow: "hidden"
                                }}
                                colors={
                                    [
                                        theme.divider_color + "90",
                                        "transparent",
                                    ]
                                }
                                start={{
                                    x: 0,
                                    y: 0
                                }}
                                end={{
                                    x: 1,
                                    y: 0
                                }}
                                >
                                    <Cell
                                    title="Можно вернуться к просмотру"
                                    onPress={() => backToWatch()}
                                    after={
                                        loadingBackToWatch && (
                                            <ActivityIndicator
                                            color={accent}
                                            />
                                        )
                                    }
                                    before={
                                        <Icon
                                        color="orangered"
                                        name="fire"
                                        size={20}
                                        />
                                    }
                                    subtitle={`Вы остановили на ${
                                        animeStatus?.data?.viewed_up_to > 3600 ?
                                        dayjs.duration(animeStatus?.data?.viewed_up_to * 1000).format('HH:mm:ss') :
                                        dayjs.duration(animeStatus?.data?.viewed_up_to * 1000).format('mm:ss')
                                    } в ${animeStatus?.data?.episode} серии в озвучке от ${animeStatus?.data?.translation}`}
                                    />
                                </LinearGradient>
                            )
                        }

                        {/* <View
                        style={{
                            backgroundColor: theme.divider_color,
                            marginHorizontal: 10,
                            marginBottom: 10,
                            zIndex: 0,
                            borderRadius: 10,
                            overflow: "hidden",
                            paddingHorizontal: normalizeSize(15),
                            paddingVertical: normalizeSize(8)
                        }}
                        >
                            <FormattedText
                            style={{
                                color: theme.text_color
                            }}
                            patterns={
                                [
                                    { 
                                        type: "url", 
                                        style: { 
                                            color: theme.accent,
                                        }, 
                                        onPress: (link) => openUrl(link) 
                                    },
                                    { 
                                        type: "bold", 
                                        symbol: "*",
                                        style: { 
                                            fontWeight: "700",
                                        }, 
                                    },
                                    {
                                        type: "crossedOut",
                                        symbol: "-",
                                        style: {
                                            textDecorationLine: "line-through"
                                        }
                                    },
                                    {
                                        type: "underline",
                                        symbol: "_",
                                        style: {
                                            textDecorationLine: "underline"
                                        },
                                        onPress: (link) => console.log(link) 
                                    },
                                ]
                            }
                            >
                                _тест_ *bold* _test2_ не подчеркнутый текст _test3_ https://vk.com __asf__ asdf asdfasfd
                            </FormattedText> 
                        </View> */}

                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            marginVertical: 10
                        }}
                        >
                            {
                                animeData?.other?.mpaa && (
                                    <>
                                        <View
                                        style={{
                                            width: 40,
                                            height: 20,
                                            borderRadius: 6,
                                            backgroundColor: theme.anime.rating_mpaa_background[ratingMPAADecode[animeData?.other?.mpaa]],
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginHorizontal: 7,
                                        }}
                                        >
                                            <Text
                                            style={{
                                                fontSize: normalizeSize(10),
                                                color: invertColor(theme.anime.rating_mpaa_background[ratingMPAADecode[animeData?.other?.mpaa]], true),
                                                fontWeight: "500"
                                            }}
                                            >
                                                {ratingMPAADecode[animeData?.other?.mpaa]}
                                            </Text>
                                        </View>

                                        <View
                                        style={{
                                            backgroundColor: theme.text_color,
                                            width: 0.5,
                                            height: 10,
                                            marginHorizontal: 5,
                                            opacity: 0.7
                                        }}
                                        />
                                    </>
                                )
                            }

                            {
                                animeData?.genres?.map(renderGenres)
                            }
                        </View>

                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 10,
                        }}
                        >
                            <WrapperAnimeInfo
                            title={
                                animeData?.other?.kind === "tv" ? "Сериал" :
                                animeData?.other?.kind === "ona" ? "ONA" :
                                animeData?.other?.kind === "ova" ? "OVA" :
                                animeData?.other?.kind === "special" ? "Спешл" :
                                animeData?.other?.kind === "movie" ? "Фильм" : "Неизвестно"
                            }
                            subtitle="Формат"
                            icon={
                                <Icon
                                name="director"
                                size={17}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            <WrapperAnimeInfo
                            title={
                                animeData?.status === "ongoing" ? "Выходит" :
                                animeData?.status === "released" ? "Вышел" :
                                animeData?.status === "anons" ? "Анонс" : "Неизвестно"
                            }
                            subtitle="Статус"
                            icon={
                                <Icon
                                name="status-ai"
                                size={17}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            <WrapperAnimeInfo
                            title={animeData?.studios?.join(", ") || "Неизвестна"}
                            subtitle="Студия"
                            icon={
                                <Icon
                                name="play-gear"
                                size={17}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            {
                                animeData?.country && (
                                    <WrapperAnimeInfo
                                    title={animeData?.country}
                                    subtitle="Страна"
                                    icon={
                                        <Image
                                        style={{
                                            width: normalizeSize(20),
                                            height: normalizeSize(13),
                                            borderRadius: 3,
                                            borderWidth: 0.5,
                                            borderColor: theme.divider_color
                                        }}
                                        resizeMethod="resize"
                                        source={{
                                            uri: (
                                                String(animeData?.country).toLowerCase() === "япония" ? FLAGS.Japan :
                                                String(animeData?.country).toLowerCase() === "китай" ? FLAGS.China : null
                                            )
                                        }}
                                        />
                                    }
                                    />
                                )
                            }

                            <WrapperAnimeInfo
                            title={dayjs(animeData?.other?.airedAt).format('D MMM YYYY') || "Неизвестна"}
                            subtitle="Дата выхода"
                            icon={
                                <Icon
                                name="calendar"
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            {
                                animeData?.type === "anime-serial" && (
                                    <WrapperAnimeInfo
                                    title={seriesCount(animeData?.episodesTotal, animeData?.episodesAired, animeData.status)}
                                    subtitle="Серий"
                                    icon={
                                        <Icon
                                        name="round-bar"
                                        size={17}
                                        color={theme.cell.subtitle_color}
                                        />
                                    }
                                    />
                                )
                            }

                            {
                                durationFormatter(animeData?.other?.duration) && (
                                    <WrapperAnimeInfo
                                    title={`≈ ` + durationFormatter(animeData?.other?.duration)}
                                    subtitle={animeData?.other?.kind === "movie" ? "Время фильма" : "Время серии"}
                                    icon={
                                        <Icon
                                        name="time-progress"
                                        size={18}
                                        color={theme.cell.subtitle_color}
                                        />
                                    }
                                    />
                                )
                            }

                            {
                                animeData?.other?.kind !== "movie" && totalWatchingTime(animeData?.type, animeData?.episodesTotal, animeData?.episodesAired, animeData?.other?.duration) !== null ? (
                                    <WrapperAnimeInfo
                                    title={`≈ ` + totalWatchingTime(animeData?.type, animeData?.episodesTotal, animeData?.episodesAired, animeData?.other?.duration)}
                                    subtitle={"Время просмотра"}
                                    icon={
                                        <Icon
                                        name="clock"
                                        size={17}
                                        color={theme.cell.subtitle_color}
                                        />
                                    }
                                    />
                                ) : null
                            }
                        </View>

                        <View
                        style={{
                            marginHorizontal: 15,
                            marginTop: 15
                        }}
                        >
                            <ContentHeader
                            text="Описание"
                            textStyle={{ color: accent }}
                            containerStyle={{ marginBottom: 10 }}
                            />

                            {
                                animeData?.description ? (
                                    <View>
                                        <Text
                                        selectable
                                        selectionColor={accent}
                                        numberOfLines={hideDescription ? 5 : 10000}
                                        onTextLayout={(e) => setDescriptionLinesCount(e?.nativeEvent?.lines?.length || 0)}
                                        style={{
                                            fontStyle: "normal",
                                            color: theme.text_color,
                                            fontSize: normalizeSize(12)
                                        }}
                                        >
                                            {animeData?.description ? animeData.description : "Описание не указано"}
                                        </Text>

                                        {
                                            hideDescription && (
                                                <TouchableWithoutFeedback
                                                onPress={() => setHideDescription(!hideDescription)}
                                                >
                                                    <LinearGradient
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    colors={[
                                                        "transparent",
                                                        theme.background_content
                                                    ]}
                                                    start={{
                                                        x: 0,
                                                        y: 0.5
                                                    }}
                                                    end={{
                                                        x: 0,
                                                        y: 1
                                                    }}
                                                    />
                                                </TouchableWithoutFeedback>
                                            )
                                        }
                                    </View>
                                ) : (
                                    <View
                                    style={{
                                        borderColor: theme.divider_color,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        padding: 15,
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    >
                                        <Icon
                                        name="info-outline"
                                        size={20}
                                        color={theme.text_secondary_color}
                                        />
                                        <Text
                                        style={{
                                            marginLeft: 15,
                                            fontSize: normalizeSize(13.5),
                                            color: theme.text_secondary_color
                                        }}
                                        >
                                            Описание не указано
                                        </Text>
                                    </View>
                                )
                            }

                            {
                                animeData?.description && descriptionLinesCount >= 6 ? (
                                    <View
                                    style={{
                                        borderRadius: 8,
                                        overflow: "hidden"
                                    }}
                                    >
                                        <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                        onPress={() => setHideDescription(!hideDescription)}
                                        >
                                            <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingBottom: 10,
                                                justifyContent: "center"
                                            }}
                                            >
                                                <Text
                                                style={{
                                                    marginRight: 5,
                                                    fontWeight: "600",
                                                    fontSize: normalizeSize(13),
                                                    color: accent
                                                }}
                                                >
                                                    {hideDescription ? "Показать весь текст" : "Скрыть лишний текст"}
                                                </Text>

                                                {
                                                    hideDescription ? (
                                                        <Icon
                                                        name="chevron-down"
                                                        color={accent}
                                                        />
                                                    ) : (
                                                        <Icon
                                                        name="chevron-up"
                                                        color={accent}
                                                        />
                                                    )
                                                }
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                ) : null
                            }
                        </View>

                        {
                            animeData?.screenshots?.length >= 1 && (
                                <View
                                style={{
                                    marginTop: 15
                                }}
                                >
                                    <ContentHeader
                                    text="Кадры из аниме"
                                    textStyle={{ color: accent }}
                                    containerStyle={{ marginBottom: 10, marginLeft: 15 }}
                                    />

                                    <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    >
                                        {
                                            animeData?.screenshots?.map(renderFrames)
                                        }
                                    </ScrollView>
                                </View>
                            )
                        }

                        {
                            playlists?.length >= 1 && (
                                <View
                                style={{
                                    marginTop: 15
                                }}
                                >
                                    <ContentHeader
                                    text="Плейлисты"
                                    textStyle={{ color: accent }}
                                    containerStyle={{ marginBottom: 10, marginLeft: 15 }}
                                    />

                                    <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        alignItems: "center"
                                    }}
                                    overScrollMode="never"
                                    >
                                        {
                                            playlists.map(renderPlaylists)
                                        }

                                        <View
                                        style={{
                                            marginHorizontal: 10,
                                            borderRadius: 10,
                                            overflow: "hidden"
                                        }}
                                        >
                                            <TouchableNativeFeedback
                                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                            onPress={() => 
                                                navigate("anime.playlists", { 
                                                    animeId: animeData?.id, 
                                                    animeTitle: animeData?.title,
                                                    animePoster: animeData?.poster
                                                })
                                            }
                                            >
                                                <View
                                                style={{
                                                    paddingHorizontal: 25,
                                                    alignItems: "center",
                                                    paddingVertical: 30
                                                }}
                                                >
                                                    <View
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 15,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: accent + "10"                                 
                                                    }}
                                                    >
                                                        <Icon
                                                        name="plus"
                                                        color={accent}
                                                        size={25}
                                                        />
                                                    </View>

                                                    <Text
                                                    style={{
                                                        marginTop: 5,
                                                        color: theme.text_color,
                                                        fontWeight: "500",
                                                        fontSize: normalizeSize(14)
                                                    }}
                                                    >
                                                        Открыть все видео
                                                    </Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    </ScrollView>
                                </View>
                            )
                        }

                        <View
                        style={{
                            marginTop: 15
                        }}
                        >
                            <ContentHeader
                            text="Статистика"
                            textStyle={{ color: accent }}
                            containerStyle={{ marginBottom: 10, marginLeft: 15  }}
                            />

                            {
                                animeData?.status === "anons" ? (
                                    <LinearGradient
                                    colors={[
                                        theme.anime.planned + "01",
                                        theme.anime.planned + "30",
                                        theme.anime.planned + "01",
                                    ]}
                                    start={{
                                        x: 0.1,
                                        y: 0
                                    }}
                                    end={{
                                        x: 0.9,
                                        y: 0
                                    }}
                                    style={{
                                        margin: 10,
                                        borderRadius: 12,
                                        backgroundColor: theme.anime.planned + "10",
                                        padding: 25
                                    }}
                                    >
                                        <Text
                                        style={{
                                            color: theme.anime.planned,
                                            fontWeight: "900",
                                            fontSize: normalizeSize(42),
                                            textAlign: "center"
                                        }}
                                        >
                                            {
                                                stats?.planned || 0
                                            }
                                        </Text>

                                        <Text
                                        style={{
                                            textAlign: "center",
                                            color: theme.text_color,
                                            fontSize: normalizeSize(14),
                                            fontWeight: "300",
                                        }}
                                        >
                                            Столько пользователей планируют смотреть это аниме
                                        </Text>

                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            marginTop: 15
                                        }}
                                        >
                                            <View
                                            style={{
                                                backgroundColor: animeData?.inList === "planned" ? theme.anime.planned : "transparent",
                                                borderRadius: 100,
                                                overflow: "hidden",
                                                borderWidth: animeData?.inList === "planned" ? 0 : 0.5,
                                                borderColor: theme.text_color
                                            }}
                                            >
                                                <TouchableNativeFeedback
                                                background={TouchableNativeFeedback.Ripple("#fff5", false)}
                                                onPress={() => setPlannedAnime()}
                                                disabled={addToPlanneLoading}
                                                >
                                                    <View
                                                    style={{
                                                        paddingVertical: 5,
                                                        paddingHorizontal: 15,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                    >
                                                        <Icon
                                                        name="calendar"
                                                        size={14}
                                                        color={theme.text_color}
                                                        />

                                                        <Text
                                                        style={{
                                                            color: theme.text_color,
                                                            marginLeft: 8
                                                        }}
                                                        >
                                                            {
                                                                animeData?.inList === "planned" ? "Запланировано" : "Запланировать"
                                                            }
                                                        </Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                ) : (
                                    <View 
                                    style={{ 
                                        marginHorizontal: 15,
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <View>
                                            {
                                                lists.map(renderStatistics)
                                            }
                                        </View>

                                        {
                                            statisticsChartValues.reduce((a, b) => a + b) === 0 ? (
                                                <Icon
                                                name="pie-chart"
                                                color={theme.divider_color}
                                                size={109}
                                                />
                                            ) : (
                                                <View
                                                style={{
                                                    width: 120,
                                                    height: 120
                                                }}
                                                >
                                                    <PieChart 
                                                    data={statisticsChartData}
                                                    innerRadius={32}
                                                    animate={true}
                                                    style={{ height: 119, width: 119 }}
                                                    />

                                                    <View
                                                    style={[
                                                        StyleSheet.absoluteFill,
                                                        {
                                                            backgroundColor: theme.anime[animeData?.inList],
                                                            width: "100%",
                                                            height: "100%",
                                                            borderRadius: 100,
                                                            transform: [{
                                                                scale: 0.2
                                                            }]
                                                        }
                                                    ]}
                                                    />
                                                </View>
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>

                        {
                            marks?.items?.total >= 0 && animeData?.status !== "anons" ? (
                                <View
                                style={{
                                    marginTop: 15,
                                }}
                                >
                                    <ContentHeader
                                    text="Оценка"
                                    textStyle={{ color: accent }}
                                    containerStyle={{ marginBottom: 10, marginLeft: 15  }}
                                    />

                                    {
                                        marks?.items?.total >= 1 ? (
                                            <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginHorizontal: 15,
                                            }}
                                            >
                                                <View style={{ marginRight: 25 }}>
                                                    <DonutChart
                                                    radius={normalizeSize(45)}
                                                    percentage={marks?.items?.avg || 0}
                                                    strokeWidth={8}
                                                    color={theme.anime_mark[Math.round(marks?.items?.avg - 0.1 || 1)]}
                                                    max={5}
                                                    centerContent={
                                                        <View>
                                                            <Text
                                                            style={{
                                                                fontSize: normalizeSize(37),
                                                                fontWeight: "700",
                                                                color: theme.text_color,
                                                                textAlign: "center"
                                                            }}
                                                            >
                                                                {marks?.items?.avg}
                                                            </Text>

                                                            <Text
                                                            style={{
                                                                textAlign: "center",
                                                                color: theme.text_secondary_color,
                                                                fontSize: normalizeSize(10),
                                                                marginTop: -7,
                                                                paddingHorizontal: 15
                                                            }}
                                                            numberOfLines={1}
                                                            >
                                                                {marks?.items?.total} {declOfNum(marks?.items?.total, ["голос", "голоса", "голосов"])}
                                                            </Text>
                                                        </View>
                                                    }
                                                    />
                                                </View>

                                                <View
                                                style={{
                                                    flex: 1
                                                }}
                                                >
                                                    {
                                                        [5, 4, 3, 2, 1].map((mark, index) => {
                                                            if(typeof marks?.items?.[mark] !== "number") return;

                                                            return (
                                                                <View
                                                                key={"mark-" + index}
                                                                style={{
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    marginBottom: 2
                                                                }}
                                                                >
                                                                    <Text
                                                                    style={{
                                                                        marginRight: 10,
                                                                        fontSize: normalizeSize(9)
                                                                    }}
                                                                    >
                                                                        {mark}
                                                                    </Text>

                                                                    <Progress
                                                                    step={marks?.items[mark] || 0}
                                                                    steps={marks?.items?.total || 0}
                                                                    />
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        ) : (
                                            <Cell
                                            disabled
                                            before={
                                                <Icon
                                                name="star"
                                                size={25}
                                                color={theme.icon_color}
                                                />
                                            }
                                            title="Нет оценок"
                                            subtitle="Это аниме ещё никто не оценил, будь первым!"
                                            />
                                        )
                                    }

                                    <View
                                    style={{
                                        marginVertical: 15
                                    }}
                                    >
                                        <Divider/>
                                    </View>

                                    <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: "row",
                                    }}
                                    >
                                        <Rating
                                        length={5}
                                        loading={markLoading}
                                        select={marks?.userMark}
                                        onPress={(v) => markAnime(v)}
                                        cancelPress={() => markAnime(marks?.userMark)}
                                        />
                                    </View>
                                </View>
                            ) : null
                        }

                        {
                            linkedAnimes?.count >= 1 && (
                                <View
                                style={{
                                    marginTop: 15
                                }}
                                >
                                    <ContentHeader
                                    text="Связанные"
                                    textStyle={{ color: accent }}
                                    containerStyle={{ marginBottom: 10, marginLeft: 15  }}
                                    />

                                    {
                                        linkedAnimes?.items?.map(renderLinked)
                                    }

                                    {
                                        linkedAnimes?.count >= 4 && (
                                            <Button
                                            title="Открыть все"
                                            upperTitle={false}
                                            type="overlay"
                                            before={
                                                <Icon
                                                name="plus-square"
                                                color={theme.icon_color}
                                                size={15}
                                                />
                                            }
                                            containerStyle={{
                                                marginTop: 0
                                            }}
                                            onPress={() => 
                                                navigate("linked_anime", { 
                                                    animes: linkedAnimes?.items, 
                                                    animeId: animeData?.id,
                                                    accent: accent
                                                })
                                            }
                                            />
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>

                    <View
                    style={{
                        marginTop: 15
                    }}
                    >
                        <Divider />
                    </View>

                    <Cell
                    title="Комментарии"
                    subtitle="Популярные за всё время"
                    onPress={() => navigate("anime.all_comments", {
                        animeId: animeData?.id,
                    })}
                    before={
                        <Icon
                        name="comments"
                        size={20}
                        color={theme.icon_color}
                        />
                    }
                    after={
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: accent + "10",
                            borderRadius: 100,
                            paddingHorizontal: 8,
                        }}
                        >
                            <Text
                            style={{
                                color: accent
                            }}
                            >
                                {
                                    comments?.count
                                }
                            </Text>

                            <Icon
                            name="chevron-right"
                            color={accent}
                            />
                        </View>
                    }
                    />

                    {
                        comments?.items?.length < 1 ? (
                            <Placeholder
                            title="Здесть пусто"
                            subtitle="Ещё никто не комментировал это аниме, будьте первым!"
                            />
                        ) : comments?.items?.map(renderComments)
                    }

                    <View style={{ marginBottom: 60 }}/>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
};