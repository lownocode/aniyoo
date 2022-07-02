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

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../config/ThemeContext";
import { declOfNum, storage } from "../functions";

import { 
    Icon,
    Button,
    Divider,
    Cell,
    ContentHeader,
    Avatar,
    PressIcon,
    Placeholder
} from "../components";
import { AnimeSetList, CommentActions } from "../modals";
import { FLAGS } from "../variables";

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

    const getAnimeData = async (id, refreshing = false) => {
        // console.log(JSON.stringify(animeData, null, "\t"))
        setRefreshing(refreshing);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");
        const params = await storage.getItem("DEEPLINK_INITIAL_PARAMS");

        axios.post("/anime.get", {
            animeId: id || route.params?.animeData?.id || params.id
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setAnimeData(data);
            setLinkedAnimes(data?.linked?.sort(sortLinkedAnimes)?.slice(0, 3));
            // console.log(JSON.stringify(data, null, "\t"))

            setRefreshing(false);
        })
        .catch(({ response: { data}  }) => {
            console.log("err\n", data);
        });
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

        axios.post("/anime.setStatus", {
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
        const willFocusSubscription = navigation.addListener('focus', () => {
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
                borderColor: theme.accent,
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
                    color: theme.accent
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
                            uri: item.poster
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
                        name="chevrons-left"
                        type="Feather"
                        color={theme.accent}
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

    const renderComments = (comment, index) => {
        const markComment = async (commentId, mark) => {
            const sign = await storage.getItem("AUTHORIZATION_SIGN");
    
            axios.post("/comment.mark", {
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
                            color: theme.cell.subtitle_color
                        }}
                        >
                            {dayjs().to(comment.createdAt)}
                        </Text>

                        {
                            comment.editedAt && (
                                <Icon
                                name="pencil"
                                type="EvilIcons"
                                size={16}
                                style={{
                                    marginLeft: 5
                                }}
                                />
                            )
                        }
                    </View>

                    <Text
                    selectable
                    style={{
                        marginTop: 3,
                        color: theme.text_color
                    }}
                    >
                        {comment.text}
                    </Text>
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
                                        name="reply-all"
                                        type="Entypo"
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
                        <PressIcon
                        icon={
                            <Icon
                            name="chevron-down-outline"
                            type="Ionicons"
                            color={comment.mark === "down" ? "#f54242" : theme.icon_color}
                            size={18}
                            />
                        }
                        onPress={() => markComment(comment.id, "down")}
                        />

                        <Text
                        style={{
                            marginHorizontal: 7,
                            color: comment.mark === "up" ? "#42f554" : comment.mark === "down" ? "#f54242" : theme.text_secondary_color
                        }}
                        >
                            {comment.rating}
                        </Text>

                        <PressIcon
                        icon={
                            <Icon
                            name="chevron-up-outline"
                            type="Ionicons"
                            size={18}
                            color={comment.mark === "up" ? "#42f554" : theme.icon_color}
                            />
                        }
                        onPress={() => markComment(comment.id, "up")}
                        />
                    </View>
                </View>
            }
            before={<Avatar url={comment.user.photo}/>}
            />
        )
    }; 

    const lists = [
        {
            name: "Смотрю",
            icon: (
                <Icon
                name="eye"
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            ),
        },
        {
            name: "Просмотрено",
            icon: (
                <Icon
                name="check"
                type="FontAwesome"
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
                type="MaterialCommunityIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            )
        },
        {
            name: "Отложено",
            icon: (
                <Icon
                name="pause-circle-outline"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={13}
                />
            )
        },
        {
            name: "Брошено",
            icon: (
                <Icon
                name="cancel"
                type="MaterialIcons"
                color={theme.text_secondary_color}
                size={13}
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
                    paddingVertical: 2,
                    paddingLeft: 4,
                    paddingRight: 5,
                    borderRadius: 100,
                    borderWidth: 0.5,
                    borderColor: statisticsChartColors[index] + "90",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
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
                backgroundColor: theme.anime.back_button_background,
                borderRadius: 20,
                width: 45,
                height: 45,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.divider_color,
                zIndex: 100,
            }}
            >
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, true)}
                onPress={() => goBack()}
                >
                    <View
                    style={{
                        padding: 6
                    }}
                    >
                        <Icon
                        type="AntDesign"
                        name="arrowleft"
                        color={theme.icon_color}
                        size={22}
                        />
                    </View>
                </TouchableNativeFeedback>
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
                    colors={[theme.accent]}
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
                    >
                        <View>
                            <Text
                            selectable
                            numberOfLines={2}
                            style={{
                                fontSize: 20,
                                fontWeight: "500",
                                marginHorizontal: 25,
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
                                fontWeight: "500",
                                marginHorizontal: 25,
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
                    </LinearGradient>

                    <View
                    style={{
                        marginTop: -200,
                        zIndex: 5,
                    }}
                    >
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
                                        type="MaterialCommunityIcons"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    ) :
                                    animeData?.inList === "completed" ? (
                                        <Icon
                                        name="check"
                                        type="FontAwesome"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    )  :
                                    animeData?.inList === "planned" ? (
                                        <Icon
                                        name="calendar"
                                        type="MaterialCommunityIcons"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    )  :
                                    animeData?.inList === "postponed" ? (
                                        <Icon
                                        name="pause-circle-outline"
                                        type="MaterialIcons"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    )  :
                                    animeData?.inList === "dropped" ? (
                                        <Icon
                                        name="cancel"
                                        type="MaterialIcons"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    )  : (
                                        <Icon
                                        name="chevron-down"
                                        type="Feather"
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
                                type={animeData?.isFavorite ? "primary" : "outline"}
                                backgroundColor={animeData?.isFavorite ? "#e2b22799" : theme.icon_color}
                                size={35}
                                textColor={animeData?.isFavorite ? "#ffffff" : theme.icon_color}
                                before={
                                    animeData?.isFavorite ? (
                                        <Icon
                                        name="ios-bookmarks"
                                        type="Ionicons"
                                        size={17}
                                        color="#ffffff"
                                        />
                                    ) : (
                                        <Icon
                                        name="ios-bookmarks-outline"
                                        type="Ionicons"
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

                            <View>
                                <Button
                                title=""
                                type="outline"
                                backgroundColor={theme.icon_color}
                                size={35}
                                before={
                                    <Icon
                                    name="dots-horizontal"
                                    type="MaterialCommunityIcons"
                                    size={17}
                                    color={theme.icon_color}
                                    />
                                }
                                />
                            </View>
                        </View>

                        <Button
                        title="Начать просмотр"
                        upperTitle={false}
                        backgroundColor={theme.anime.button_start_watch_background}
                        textColor={theme.anime.button_start_watch_text_color}
                        before={
                            <Icon
                            name="play-outline"
                            type="Ionicons"
                            size={17}
                            color={theme.anime.button_start_watch_text_color}
                            />
                        }
                        size={45}
                        disabled={!animeData?.id}
                        onPress={() => navigate("anime.select_translation", { animeId: animeData?.id, title: animeData?.title })}
                        />

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
                            subtitle="Тип"
                            icon={
                                <Icon
                                name="ev-plug-type1"
                                type="MaterialCommunityIcons"
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
                                name="calendar"
                                type="MaterialCommunityIcons"
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
                                name="video-settings"
                                type="MaterialIcons"
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
                            title={
                                animeData?.status === "anons" ? new Date(animeData?.other?.airedAt) < Date.now() ? "Неизвестна" : 
                                dayjs(animeData?.other?.airedAt).format('D MMM YYYY') : 
                                dayjs(animeData?.other?.releasedAt).format('D MMM YYYY')
                            }
                            subtitle="Дата выхода"
                            icon={
                                <Icon
                                name="calendar-check-o"
                                type="FontAwesome"
                                size={17}
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
                                        name="filter-list"
                                        type="MaterialIcons"
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
                                        name="progress-clock"
                                        type="MaterialCommunityIcons"
                                        size={17}
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
                                        type="MaterialCommunityIcons"
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
                            containerStyle={{ marginBottom: 10 }}
                            />

                            <Text
                            selectable
                            numberOfLines={hideDescription ? 5 : 10000}
                            onTextLayout={(e) => setDescriptionLinesCount(e?.nativeEvent?.lines?.length || 0)}
                            style={{
                                fontStyle: animeData?.description ? "normal" : "italic",
                                color: theme.text_color,
                            }}
                            >
                                {animeData?.description ? animeData.description : "Описание не указано"}
                            </Text>

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
                                            type="Feather"
                                            color={theme.icon_color}
                                            />
                                        ) : (
                                            <Icon
                                            name="chevron-up"
                                            type="Feather"
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
                                                type="FontAwesome"
                                                name="pie-chart"
                                                color={theme.divider_color}
                                                size={109}
                                                />
                                            ) : (
                                                <PieChart 
                                                data={statisticsChartData}
                                                innerRadius={22}
                                                style={{ height: 120, width: 109 }}
                                                />
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>

                        {
                            linkedAnimes.length >= 1 && (
                                <View
                                style={{
                                    marginTop: 15
                                }}
                                >
                                    <ContentHeader
                                    text="Связанные"
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
                                                name="plus-square-o"
                                                type="FontAwesome"
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
                        name="comment-discussion"
                        type="Octicons"
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
                            backgroundColor: theme.accent + "10",
                            borderRadius: 100,
                            paddingHorizontal: 8
                        }}
                        >
                            <Text
                            style={{
                                color: theme.accent
                            }}
                            >
                                {
                                    animeData?.commentsCount
                                }
                            </Text>

                            <Icon
                            name="chevron-right"
                            type="Feather"
                            color={theme.accent}
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