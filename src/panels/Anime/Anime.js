import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { 
    View, 
    ScrollView, 
    StatusBar, 
    Image, 
    TouchableNativeFeedback,
    Dimensions,
    StyleSheet,
    ToastAndroid,
    RefreshControl,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Text,
    Animated
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
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
    AllCommentsList,
} from "../../components";
import { AnimeSetList, CommentActions } from "../../modals";
import { FLAGS, DOMAIN } from "../../../variables";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

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

    const topButtonsPosition = useRef(new Animated.Value(20)).current;
    const scrollYBefore = useRef(new Animated.Value(0)).current;
    const statusBarBackgroundPosition = useRef(new Animated.Value(-StatusBar.currentHeight)).current;
    const playButtonPosition = useRef(new Animated.Value(-45)).current;
    const scalePlayButton = useRef(new Animated.Value(1)).current;
    const scaleBackButton = useRef(new Animated.Value(1)).current;

    const [ refreshing, setRefreshing ] = useState(true);
    const [ animeData, setAnimeData ] = useState(route.params?.animeData);
    const [ hideDescription, setHideDescription ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);
    const [ linkedAnimes, setLinkedAnimes ] = useState({});
    const [ descriptionLinesCount, setDescriptionLinesCount ] = useState(0);
    const [ posterColors, setPosterColors ] = useState({});
    const [ animeStatus, setAnimeStatus ] = useState({ status: "NO_WATCHED" });
    const [ popup, setPopup ] = useState(null);
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
        "other": ["другое", "других", "других"],
        "clip": ["отрывок", "отрывка", "отрывков"],
        "character_trailer": ["трейлер персонажей", "трейлера персонажей", "трейлеров персонажей"]
    };

    const getAnimeData = async (id) => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        return axios.post("/animes.get", {
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

    const scrollHandler = (y) => {
        if(y > scrollYBefore.__getValue()) {//scroll to bottom
            Animated.timing(topButtonsPosition, {
                toValue: -100,
                duration: 50,
                useNativeDriver: false
            }).start();

            if(y > WINDOW_HEIGHT / 2) {
                Animated.timing(statusBarBackgroundPosition, {
                    toValue: 0,
                    duration: 20,
                    useNativeDriver: false
                }).start();

                Animated.timing(playButtonPosition, {
                    toValue: 20,
                    duration: 50,
                    useNativeDriver: false
                }).start();
            }
        } else {
            Animated.timing(topButtonsPosition, {
                toValue: 20,
                duration: 50,
                useNativeDriver: false
            }).start();

            if(y < WINDOW_HEIGHT / 2) {
                Animated.timing(statusBarBackgroundPosition, {
                    toValue: -StatusBar.currentHeight,
                    duration: 20,
                    useNativeDriver: false
                }).start();

                Animated.timing(playButtonPosition, {
                    toValue: -45,
                    duration: 50,
                    useNativeDriver: false
                }).start();
            }
        }

        scrollYBefore.setValue(y);
    };

    const backToWatch = async (nextEpisode = false) => {
        setPopup(null);
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
            return minutes + " " + "мин.";
        }
        
        const hours = Math.trunc(minutes / 60);
        const mins = minutes % 60;

        if(mins === 0) {
            return `${hours} ч.`;
        }

        return `${hours} ч. ${mins} мин.`;
    };

    const WrapperAnimeInfo = (props) => {
        const {
            title,
            subtitle,
            icon,
            divider = true
        } = props;

        return (
            <View>
                <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 11,
                    paddingHorizontal: 5
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "55%"
                    }}
                    >
                        <View
                        style={{
                            width: 30,
                            alignItems: "center"
                        }}
                        >
                        {
                            icon
                        }
                        </View>

                        <View>
                            {
                                typeof subtitle !== "string" ? subtitle : (
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontWeight: "500",
                                        fontSize: 15,
                                    }}
                                    >
                                        {
                                            subtitle
                                        }
                                    </Text>
                                )
                            }
                        </View>
                    </View>

                    <View
                    style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "50%",
                        flexWrap: "wrap"
                    }}
                    >
                        {
                            typeof subtitle !== "string" ? subtitle : (
                                <Text
                                style={{
                                    color: theme.text_secondary_color
                                }}
                                >
                                    {
                                        title
                                    }
                                </Text>
                            )
                        }
                    </View>
                </View>
                
                {
                    divider && (
                        <View
                        style={{
                            height: 0.5,
                            marginHorizontal: 15,
                            backgroundColor: theme.divider_color
                        }}
                        />
                    )
                }
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
                borderRadius: 10,
                backgroundColor: theme.divider_color
            }}
            >
                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden"
                }}
                >
                    <Image
                    style={{
                        width: 290,
                        height: 160,
                    }}
                    resizeMethod="resize"
                    source={{
                        uri: image
                    }}
                    />
                </View>
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
                borderRadius: 10,
                backgroundColor: accent + "90",
                overflow: "hidden",
            }}
            >
                <View
                style={{
                    borderRadius: 10,
                    overflow: "hidden"
                }}
                >
                    <Image
                    style={{
                        width: 290,
                        height: 160,
                    }}
                    resizeMethod="resize"
                    blurRadius={5}
                    source={{
                        uri: item.image
                    }}
                    />
                </View>

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
                                                    ),
                                                    "rutube": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="rutube-logo"
                                                            size={25}
                                                            />
                                                        </View>
                                                    ),
                                                    "vimeo": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="vimeo-logo"
                                                            size={25}
                                                            />
                                                        </View>
                                                    ),
                                                    "smotret_anime": (
                                                        <View style={{ marginHorizontal: 8 }}>
                                                            <Icon
                                                            name="anime365-logo"
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
                            fontWeight: "900",
                            fontSize: 30,
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
                            fontWeight: "700",
                            fontSize: 18,
                            textTransform: "uppercase",
                            marginHorizontal: 20,
                            textAlign: "center",
                        }}
                        >
                            {
                                declOfNum(item?.count || 0, playlistKindDecode[item?.kind] || [item?.kind, item?.kind, item?.kind])
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
                            width: 90,
                            height: 125,
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
                                        fontSize: 12,
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
                                    fontSize: (10),
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

                            {
                                item.kind && (
                                    <View>
                                        <Text
                                        style={{
                                            color: theme.text_color,
                                            fontSize: (10),
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
                                )
                            }
                        </View>

                        <Text
                        numberOfLines={3}
                        style={{
                            color: theme.text_secondary_color,
                            fontSize: (11)
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
                    height: 17,
                    width: 38
                }}
                >
                    <View
                    style={{
                        width: 10,
                        height: 10,
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
                        fontSize: 15,
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
                        fontSize: 15.5
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
        setPopup(null);
    };

    const scaleAnimation = (scale, variable) => {
        Animated.timing(variable, {
            toValue: scale,
            duration: 100,
            useNativeDriver: false
        }).start();
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
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Animated.View
            style={{
                backgroundColor: theme.background_content,
                height: StatusBar.currentHeight,
                position: "absolute",
                top: statusBarBackgroundPosition,
                left: 0,
                right: 0,
                zIndex: 1000
            }}
            />

            <Animated.View
            style={{
                position: "absolute",
                top: StatusBar.currentHeight + 20,
                left: topButtonsPosition,
                backgroundColor: theme.background_content,
                borderRadius: 100,
                zIndex: 100,
                borderWidth: 0.5,
                borderColor: theme.divider_color,
                transform: [
                    {
                        scale: scaleBackButton
                    }
                ]
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, true)}
                onPress={() => goBack()}
                onPressIn={() => scaleAnimation(0.95, scaleBackButton)}
                onPressOut={() => scaleAnimation(1, scaleBackButton)}
                >
                    <View
                    style={{
                        width: 45,
                        height: 45,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <Icon
                        name="arrow-back"
                        color={theme.text_color}
                        />
                    </View>
                </TouchableNativeFeedback>
            </Animated.View>

            <Animated.View
            style={{
                position: "absolute",
                top: StatusBar.currentHeight + 20,
                right: topButtonsPosition,
                backgroundColor: theme.background_content,
                borderRadius: 100,
                zIndex: 1000,
                borderWidth: 0.5,
                borderColor: theme.divider_color,
            }}
            >
                <Popup
                visible={popup === "animeInfo"}
                onRequestClose={() => setPopup(null)}
                animationDuration={100}
                style={{
                    backgroundColor: theme.popup_background,
                    borderRadius: 10,
                    overflow: "hidden",
                }}
                anchor={
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, true)}
                    onPressIn={() => setPopup("animeInfo")}
                    >
                        <View
                        style={{
                            width: 45,
                            height: 45,
                            justifyContent: "center",
                            alignItems: "center",
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
            </Animated.View>

            <Animated.View
            style={{
                borderRadius: 100,
                overflow: "hidden",
                position: "absolute",
                bottom: playButtonPosition,
                right: 20,
                zIndex: 1000,
                backgroundColor: accent,
                transform: [
                    {
                        scale: scalePlayButton
                    }
                ]
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(invertColor(accent, true) + "50", false)}
                onPress={() => navigate("anime.select_translation", { animeId: animeData?.id, title: animeData?.title })}
                onPressIn={() => scaleAnimation(0.95, scalePlayButton)}
                onPressOut={() => scaleAnimation(1, scalePlayButton)}
                >
                    <View
                    style={{
                        paddingHorizontal: 25,
                        height: 45,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    >
                        <Icon
                        name={
                            {
                                "NO_WATCHED": "play",
                                "WATCHED_BEFORE": "pause"
                            }[animeStatus.status]
                        }
                        style={{
                            marginRight: 10
                        }}
                        color={invertColor(accent, true)}
                        />

                        <Text
                        style={{
                            color: invertColor(accent, true),
                            fontWeight: "700",
                            fontSize: 17
                        }}
                        >
                            {
                                {
                                    "NO_WATCHED": "Начать",
                                    "WATCHED_BEFORE": "Продолжить"
                                }[animeStatus.status]
                            }
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </Animated.View>

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
                onScroll={({ nativeEvent: { contentOffset: { y } } }) => scrollHandler(y)}
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
                                height: 600,
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
                            marginTop: -600,
                        }}
                        >
                            <View
                            style={{
                                borderRadius: 10,
                                overflow: "hidden",
                                marginTop: StatusBar.currentHeight + 70,
                            }}
                            >
                                <Image
                                source={{
                                    uri: animeData?.poster
                                }}
                                resizeMethod="resize"
                                resizeMode="cover"
                                style={{
                                    width: 230,
                                    height: 330,
                                    zIndex: 12,
                                    backgroundColor: theme.divider_color,
                                }}
                                onError={(e) => ToastAndroid.show(`Возникла ошибка при попытке загрузки постера\n${e.nativeEvent.error}`, ToastAndroid.CENTER)}
                                />
                            </View>
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
                            marginBottom: 30,
                            alignItems: "center"
                        }}
                        >
                            <Text
                            selectable
                            selectionColor={accent}
                            numberOfLines={2}
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
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
                        size={47}
                        backgroundColor={accent}
                        textColor={invertColor(accent, true)}
                        onPress={() => navigate("anime.select_translation", { animeId: animeData?.id, title: animeData?.title })}
                        before={
                            <Icon
                            name={
                                {
                                    "NO_WATCHED": "play",
                                    "WATCHED_BEFORE": "pause"
                                }[animeStatus.status]
                            }
                            size={12}
                            color={invertColor(accent, true)}
                            />
                        }
                        containerStyle={{ marginBottom: 0 }}
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
                                <Popup
                                visible={popup === "watchedBeforeActions"}
                                onRequestClose={() => setPopup(null)}
                                animationDuration={100}
                                style={{
                                    backgroundColor: theme.popup_background,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                }}
                                anchor={
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
                                        onPress={() => setPopup("watchedBeforeActions")}
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
                                }
                                >
                                    <Cell
                                    title="Продолжить просмотр"
                                    before={
                                        <Icon
                                        name="clock-outline"
                                        color={theme.icon_color}
                                        />
                                    }
                                    containerStyle={{
                                        paddingVertical: 15
                                    }}
                                    contentStyle={{
                                        flex: 0
                                    }}
                                    onPress={() => backToWatch()}
                                    />

                                    <Cell
                                    title="Следующая серия"
                                    before={
                                        <Icon
                                        name="chevron-right-double"
                                        color={theme.icon_color}
                                        size={20}
                                        />
                                    }
                                    containerStyle={{
                                        paddingVertical: 15
                                    }}
                                    contentStyle={{
                                        flex: 0
                                    }}
                                    onPress={() => backToWatch(true)}
                                    />
                                </Popup>
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
                            paddingHorizontal: (15),
                            paddingVertical: (8)
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
                                                fontSize: (10),
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
                        >

                        </View>

                        <View>
                            <WrapperAnimeInfo
                            title={
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                >
                                    <Text
                                    style={{
                                        color: theme.text_secondary_color
                                    }}
                                    >
                                        {
                                            {
                                                "none": "Неизвестно",
                                                "tv": "Сериал",
                                                "ona": "ONA",
                                                "ova": "OVA",
                                                "special": "Спешл",
                                                "movie": "Фильм", 
                                            }[animeData?.other?.kind || "none"]
                                        }
                                    </Text>

                                    <View
                                    style={{
                                        backgroundColor: {
                                            "none": theme.divider_color,
                                            "ongoing": theme.anime.watching,
                                            "released": theme.accent,
                                            "anons": theme.anime.planned
                                        }[animeData?.status || "none"],
                                        paddingVertical: 1,
                                        paddingHorizontal: 7,
                                        borderRadius: 5,
                                        marginHorizontal: 10
                                    }}
                                    >
                                        <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 12
                                        }}
                                        >
                                            {
                                                {
                                                    "none": "Неизвестно",
                                                    "ongoing": "Выходит",
                                                    "released": "Вышел",
                                                    "anons": "Анонс"
                                                }[animeData?.status || "none"]
                                            }
                                        </Text>
                                    </View>
                                </View>
                            }
                            subtitle="Тип"
                            icon={
                                <Icon
                                name="director"
                                size={16}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            <WrapperAnimeInfo
                            title={animeData?.studios?.join(", ") || "Неизвестна"}
                            subtitle={animeData?.studios?.length > 1 ? "Студии" : "Студия"}
                            icon={
                                <Icon
                                name="play-gear"
                                size={16}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />

                            {
                                animeData?.country && (
                                    <WrapperAnimeInfo
                                    subtitle="Страна"
                                    icon={
                                        <Icon
                                        name="globe"
                                        color={theme.cell.subtitle_color}
                                        size={17}
                                        />
                                    }
                                    title={
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                        >
                                            <Image
                                            style={{
                                                width: (20),
                                                height: (13),
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
                                            
                                            <Text
                                            style={{
                                                color: theme.text_secondary_color,
                                                marginLeft: 10
                                            }}
                                            >
                                                {
                                                    animeData?.country
                                                }
                                            </Text>
                                        </View>
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
                                    title={
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                        >
                                            <Text
                                            style={{
                                                color: theme.text_secondary_color,
                                                marginRight: 5,
                                                backgroundColor: theme.text_secondary_color + "15",
                                                paddingHorizontal: 5,
                                                borderRadius: 4,
                                                fontSize: 13
                                            }}
                                            >
                                                {
                                                    seriesCount(animeData?.episodesTotal, animeData?.episodesAired, animeData.status)
                                                } 
                                            </Text>
                                        </View>
                                    }
                                    subtitle="Серий"
                                    icon={
                                        <Icon
                                        name="round-bar"
                                        size={16}
                                        color={theme.cell.subtitle_color}
                                        />
                                    }
                                    />
                                )
                            }

                            <WrapperAnimeInfo
                            divider={false}
                            title={
                                <View>
                                    <Text
                                    style={{
                                        color: theme.text_secondary_color,
                                    }}
                                    >
                                        Серия ≈ {
                                            durationFormatter(animeData?.other?.duration)
                                        }
                                    </Text>

                                    <Text
                                    style={{
                                        color: theme.text_secondary_color,
                                    }}
                                    > 
                                        Общее ≈ {
                                            totalWatchingTime(animeData?.type, animeData?.episodesTotal, animeData?.episodesAired, animeData?.other?.duration)
                                        }
                                    </Text>
                                </View>
                            }
                            subtitle="Время просмотра"
                            icon={
                                <Icon
                                name="clock-outline"
                                size={16}
                                color={theme.cell.subtitle_color}
                                />
                            }
                            />
                        </View>

                        <View
                        style={{
                            marginTop: 15
                        }}
                        >
                            <ContentHeader
                            text="Описание"
                            textColor={accent}
                            background={accent + "10"}
                            icon={
                                <Icon
                                color={accent}
                                name="description"
                                />
                            }
                            />

                            <View style={{ marginTop: 10 }} />

                            {
                                animeData?.description ? (
                                    <View
                                    style={{
                                        marginHorizontal: 15
                                    }}
                                    >
                                        <Text
                                        selectable
                                        selectionColor={accent}
                                        numberOfLines={hideDescription ? 5 : 10000}
                                        onTextLayout={(e) => setDescriptionLinesCount(e?.nativeEvent?.lines?.length || 0)}
                                        style={{
                                            color: theme.text_color,
                                            fontSize: 15,
                                        }}
                                        >
                                            {animeData?.description}
                                        </Text>

                                        {
                                            (hideDescription && descriptionLinesCount >= 6) && (
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
                                        alignItems: "center",
                                        marginHorizontal: 10
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
                                            fontSize: (13.5),
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
                                    <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                    onPress={() => setHideDescription(!hideDescription)}
                                    >
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 10,
                                            justifyContent: "center"
                                        }}
                                        >
                                            <Text
                                            style={{
                                                marginRight: 5,
                                                fontWeight: "600",
                                                fontSize: 13,
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
                                ) : null
                            }
                        </View>

                        {
                            animeData?.screenshots?.length >= 1 && (
                                <View
                                style={{
                                    marginTop: 25
                                }}
                                >
                                    <ContentHeader
                                    text="Кадры из аниме"
                                    textColor={accent}
                                    background={accent + "10"}
                                    icon={
                                        <Icon
                                        color={accent}
                                        name="gallery"
                                        size={12}
                                        />
                                    }
                                    />

                                    <View style={{ marginTop: 10 }} />

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
                                    marginTop: 25
                                }}
                                >
                                    <ContentHeader
                                    text="Плейлисты"
                                    textColor={accent}
                                    background={accent + "10"}
                                    icon={
                                        <Icon
                                        color={accent}
                                        name="playlist-play"
                                        size={12}
                                        />
                                    }
                                    />

                                    <View style={{ marginTop: 10 }} />

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
                                                        fontSize: (14)
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
                            marginTop: 25
                        }}
                        >
                            <ContentHeader
                            text="Статистика"
                            textColor={accent}
                            background={accent + "10"}
                            icon={
                                <Icon
                                color={accent}
                                name="bar-chart"
                                size={12}
                                />
                            }
                            />

                            <View style={{ marginTop: 10 }} />

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
                                            fontSize: (42),
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
                                            fontSize: (14),
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
                                    marginTop: 25,
                                }}
                                >
                                    <ContentHeader
                                    text="Оценка"
                                    textColor={accent}
                                    background={accent + "10"}
                                    icon={
                                        <Icon
                                        color={accent}
                                        name="star"
                                        size={12}
                                        />
                                    }
                                    />

                                    <View style={{ marginTop: 10 }} />

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
                                                    radius={55}
                                                    percentage={marks?.items?.avg || 0}
                                                    strokeWidth={8}
                                                    color={theme.anime_mark[Math.round(marks?.items?.avg - 0.1 || 1)]}
                                                    max={5}
                                                    centerContent={
                                                        <View>
                                                            <Text
                                                            style={{
                                                                fontSize: 45,
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
                                                                fontSize: 12,
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
                                                                        fontSize: 11
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
                                    marginTop: 35
                                }}
                                >
                                    <ContentHeader
                                    text="Связанные"
                                    textColor={accent}
                                    background={accent + "10"}
                                    icon={
                                        <Icon
                                        color={accent}
                                        name="link"
                                        size={17}
                                        />
                                    }
                                    />

                                    <View style={{ marginTop: 10 }} />

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
                            title="Здесь ничего нет"
                            subtitle="Ещё никто не комментировал это аниме, будьте первым!"
                            />
                        ) : (
                            <View>
                                <AllCommentsList
                                comments={{ list: comments?.items }}
                                setModalContent={setModalContent}
                                modalRef={modalRef}
                                navigate={navigate}
                                />
                            </View>
                        )
                    }

                    <View style={{ marginBottom: 100 }}/>
                </ScrollView>
            </View>
        </View>
    )
};