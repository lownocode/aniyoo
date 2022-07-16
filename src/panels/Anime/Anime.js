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
import changeNavigationBarColor from "react-native-navigation-bar-color";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";
import { 
    declOfNum, 
    storage, 
    getAnimeAccentColor,
    invertColor
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
} from "../../components";
import { AnimeSetList, CommentActions } from "../../modals";
import { FLAGS } from "../../../variables";

const bottomNavigationHeight = Dimensions.get("screen").height - Dimensions.get("window").height - StatusBar.currentHeight;

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

    const [ refreshing, setRefreshing ] = useState(false);
    const [ animeData, setAnimeData ] = useState(route.params?.animeData);
    const [ hideDescription, setHideDescription ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);
    const [ linkedAnimes, setLinkedAnimes ] = useState([]);
    const [ descriptionLinesCount, setDescriptionLinesCount ] = useState(0);
    const [ posterColors, setPosterColors ] = useState({});
    const [ animeStatus, setAnimeStatus ] = useState({ status: "NO_WATCHED" });
    const [ popupVisible, setPopupVisible ] = useState(false);

    const accent = getAnimeAccentColor(posterColors?.dominant || theme.text_color, theme.name);

    const getAnimeData = async (id, refreshing = false) => {
        setRefreshing(refreshing);

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
            setLinkedAnimes(data?.linked?.sort(sortLinkedAnimes)?.slice(0, 3));
            getAnimeStatusInLocalStorage();

            setRefreshing(false);
        })
        .catch(({ response: { data}  }) => {
            console.log("err\n", data);
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
        const newAnimeStatsData = Object.defineProperty(animeData?.stats, list, { value: animeData?.isFavorite ? animeData?.stats?.favorite - 1 : animeData?.stats?.favorite + 1 });
        setAnimeData({
            ...animeData,
            stats: newAnimeStatsData,
            inList: list
        });
    };

    const setIsFavorite = async () => {
        const newAnimeStatsData = Object.defineProperty(animeData?.stats, "favorite", { value: animeData?.isFavorite ? animeData?.stats?.favorite - 1 : animeData?.stats?.favorite + 1 });
        setAnimeData({
            ...animeData,
            stats: newAnimeStatsData,
            isFavorite: !animeData?.isFavorite
        });

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/lists.add", {
            animeId: animeData?.id,
            status: animeData?.isFavorite ? "noFavorite" : "favorite"
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
        })
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAnimeData(route.params?.animeData?.id, true);
    }, []);
    
    useEffect(() => {
        getPosterColors();
    }, [animeData]);

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('focus', () => {
            changeNavigationBarColor("translucent", false, true);
            onRefresh();
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
                borderRadius: 10,
                backgroundColor: theme.divider_color
            }}
            >
                <Image
                style={{
                    width: 180,
                    height: 100,
                    borderRadius: 10
                }}
                resizeMethod="resize"
                source={{
                    uri: image
                }}
                />
            </View>
        )
    };

    const sortLinkedAnimes = (a, b) => {
        if(b.year > a.year) return -1;
        if(b.year < a.year) return 1;

        return 0;
    };

    const renderLinked = (item, index) => {
        return (
            <View
            key={"linked-anime-" + index}
            >
                <Cell
                title={item.name}
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
                            width: 55,
                            height: 80,
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
                                            item.inList === "watching" ? "Смотрю" :
                                            item.inList === "completed" ? "Просмотрено" :
                                            item.inList === "planned" ? "В планах" :
                                            item.inList === "postponed" ? "Отложено" :
                                            item.inList === "dropped" ? "Брошено" : null
                                        }
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                }
                containerStyle={{
                    opacity: item.id ? 1 : .3
                }}
                disabled={!item.id || item.id === animeData?.id}
                after={
                    item.id === animeData?.id && (
                        <Icon
                        name="chevron-left-double"
                        color={accent}
                        size={20}
                        />
                    )
                }
                subtitle={
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
                                {item?.year || "Неизвестный"} год
                            </Text>
                        </View>

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
                                {item?.kind}
                            </Text>
                        </View>
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
                const newCommentsData = animeData.comments.map(comment => {
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
                                        fontSize: 14
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
        animeData?.stats?.watching || 0,
        animeData?.stats?.completed || 0,
        animeData?.stats?.planned || 0,
        animeData?.stats?.postponed || 0,
        animeData?.stats?.dropped || 0,
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
                    height: 20,
                    width: 40
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
                        fontSize: 16
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
            setAnimeData({
                ...animeData,
                userMark: v === animeData.userMark ? null : v,
                marks: data.marks
            });
        })
        .catch(({ reponse: { data } }) => {
            console.log(data);
        });
    };

    const animeCopyLink = () => {
        const copyString = `https://aniyoo.localhostov.ru:1007/anime?id=${animeData?.id}`;
        Clipboard.setString(copyString);
        ToastAndroid.show("Ссылка скопирована в буфер обмена", ToastAndroid.CENTER);
        setPopupVisible(false);
    };

    const styles = StyleSheet.create({
        modalContainer: {
            left: 10,
            width: Dimensions.get("window").width - 20,
            bottom: 10 + bottomNavigationHeight,
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
                width: 45,
                height: 45,
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
                width: 45,
                height: 45,
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
                        position: "relative"
                    }}
                    >
                        <Image
                        source={{
                            uri: animeData?.poster
                        }}
                        resizeMode="cover"
                        style={{
                            width: Dimensions.get("window").width,
                            height: 600,
                            opacity: 0.5,
                            backgroundColor: theme.divider_color
                        }}
                        blurRadius={15}
                        />

                        <Image
                        source={{
                            uri: animeData?.poster
                        }}
                        resizeMethod="resize"
                        style={{
                            width: 230,
                            height: 310,
                            position: "absolute",
                            marginTop: StatusBar.currentHeight + 70,
                            borderRadius: 10,
                            zIndex: 12,
                            backgroundColor: theme.divider_color
                        }}
                        onError={(e) => ToastAndroid.show(`Возникла ошибка при попытке загрузки постера\n${e.nativeEvent.error}`, ToastAndroid.CENTER)}
                        />
                    </View>

                    <LinearGradient
                    colors={[
                        "transparent",
                        "transparent",
                        theme.background_content,
                        theme.background_content,
                    ]}
                    style={{
                        width: "100%",
                        height: 500,
                        marginTop: -400,
                        zIndex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    />

                    <View
                    style={{
                        marginTop: -270,
                        zIndex: 5,
                    }}
                    >
                        <View
                        style={{
                            marginBottom: 10
                        }}
                        >
                            <Text
                            selectable
                            numberOfLines={2}
                            style={{
                                fontSize: 20,
                                fontWeight: "500",
                                marginHorizontal: 15,
                                textAlign: "center",
                                color: theme.text_color
                            }}
                            >
                                {
                                    animeData?.title
                                }
                            </Text>

                            <Text
                            selectable
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

                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                        >
                            <View>
                                <Button
                                title={
                                    animeData?.inList === "watching" ? "Смотрю" :
                                    animeData?.inList === "completed" ? "Просмотрено" :
                                    animeData?.inList === "planned" ? "В планах" :
                                    animeData?.inList === "postponed" ? "Отложено" :
                                    animeData?.inList === "dropped" ? "Брошено" : "Не в списке"
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
                            </View>

                            <View>
                                <Button
                                title={animeData?.stats?.favorite || "0"}
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
                                containerStyle={{
                                    marginRight: 0
                                }}
                                onPress={() => setIsFavorite()}
                                />
                            </View>
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
                                    size={17}
                                    color={invertColor(accent, true)}
                                    />
                                ),
                                "WATCHED_BEFORE": (
                                    <Icon
                                    name="pause"
                                    size={20}
                                    color={invertColor(accent, true)}
                                    />
                                )
                            }[animeStatus.status]
                        }
                        size={45}
                        disabled={!animeData?.id || animeData?.status === "anons"}
                        onPress={() => navigate("anime.select_translation", { animeId: animeData?.id, title: animeData?.title })}
                        />

                        {
                            animeStatus?.status === "WATCHED_BEFORE" && (
                                <View
                                style={{
                                    backgroundColor: theme.divider_color,
                                    marginHorizontal: 10,
                                    marginBottom: 10,
                                    zIndex: 0,
                                    borderRadius: 10,
                                    overflow: "hidden"
                                }}
                                >
                                    <Cell
                                    title="Можно вернуться к просмотру"
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
                                </View>
                            )
                        }

                        <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 10,
                        }}
                        >
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
                                            width: 22,
                                            height: 14,
                                            borderRadius: 2
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
                                    <Text
                                    selectable
                                    selectionColor={accent}
                                    numberOfLines={hideDescription ? 5 : 10000}
                                    onTextLayout={(e) => setDescriptionLinesCount(e?.nativeEvent?.lines?.length || 0)}
                                    style={{
                                        fontStyle: animeData?.description ? "normal" : "italic",
                                        color: theme.text_color,
                                    }}
                                    >
                                        {animeData?.description ? animeData.description : "Описание не указано"}
                                    </Text>
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
                                        name="info"
                                        size={25}
                                        color={theme.text_secondary_color}
                                        />
                                        <Text
                                        style={{
                                            marginLeft: 15,
                                            fontSize: 16,
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
                                    <Button
                                    title={hideDescription ? "Показать весь текст" : "Скрыть лишний текст"}
                                    upperTitle={false}
                                    type="overlay"
                                    containerStyle={{
                                        marginTop: 0
                                    }}
                                    before={
                                        hideDescription ? (
                                            <Icon
                                            name="chevron-down"
                                            color={theme.icon_color}
                                            />
                                        ) : (
                                            <Icon
                                            name="chevron-up"
                                            color={theme.icon_color}
                                            />
                                        )
                                    }
                                    onPress={() => setHideDescription(!hideDescription)}
                                    />
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
                                    <View>
                                        <Text 
                                        style={{ 
                                            color: theme.anime.planned, 
                                            fontSize: 25,
                                            textAlign: "center",
                                            fontWeight: "500"
                                        }}
                                        >
                                            {animeData?.stats?.planned}
                                        </Text>

                                        <Text
                                        style={{
                                            textAlign: "center",
                                            marginTop: 10
                                        }}
                                        >
                                            Столько пользователей планирует смотреть это аниме
                                        </Text>
                                    </View>
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
                            animeData?.marks?.total && animeData?.status !== "anons" ? (
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
                                        animeData?.marks?.total ? (
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
                                                    percentage={animeData?.marks?.avg || 0}
                                                    strokeWidth={8}
                                                    color={theme.anime_mark[Math.round(animeData?.marks?.avg - 0.1 || 1)]}
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
                                                                {animeData?.marks?.avg}
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
                                                                {animeData?.marks?.total} {declOfNum(animeData?.marks?.total, ["голос", "голоса", "голосов"])}
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
                                                            if(typeof animeData?.marks?.[mark] !== "number") return;

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
                                                                        fontSize: 12
                                                                    }}
                                                                    >
                                                                        {mark}
                                                                    </Text>

                                                                    <Progress
                                                                    step={animeData?.marks?.[mark] || 0}
                                                                    steps={animeData?.marks?.total || 0}
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

                                    <Divider
                                    dividerStyle={{
                                        marginTop: 15
                                    }}
                                    />

                                    <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: "row",
                                    }}
                                    >
                                        <Rating
                                        length={5}
                                        select={animeData?.userMark}
                                        onPress={(v) => markAnime(v)}
                                        cancelPress={() => markAnime(animeData?.userMark)}
                                        />
                                    </View>
                                </View>
                            ) : null
                        }

                        {
                            linkedAnimes.length >= 1 && (
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
                                        linkedAnimes.map(renderLinked)
                                    }

                                    {
                                        animeData?.linked?.length >= 4 && (
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
                                            onPress={() => navigate("linked_anime", { animeList: animeData?.linked, selectedAnimeId: animeData?.id })}
                                            />
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>

                    <Divider dividerStyle={{ marginTop: 15 }} />

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
                                    animeData?.commentsCount
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
                        animeData?.comments?.length < 1 ? (
                            <Placeholder
                            title="Здесть пусто"
                            subtitle="Ещё никто не комментировал это аниме, будьте первым!"
                            />
                        ) : animeData?.comments?.map(renderComments)
                    }

                    <View style={{ marginBottom: 60 }}/>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
};