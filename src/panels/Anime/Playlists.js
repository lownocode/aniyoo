import React, { useContext, useEffect, useRef, useState } from "react";
import { 
    Image, 
    ScrollView, 
    View, 
    Text, 
    ToastAndroid, 
    ActivityIndicator,
    StatusBar,
    TouchableNativeFeedback,
    Dimensions,
    Linking
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { Cell, ContentHeader, Header, Icon, Placeholder } from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { normalizeSize, sleep, storage } from "../../functions";
import LinearGradient from "react-native-linear-gradient";

export const AnimePlaylists = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            goBack,
            navigate
        },
        navigation
    } = props;

    const [ loading, setLoading ] = useState(true);
    const [ videos, setVideos ] = useState({});
    const [ images, setImages ] = useState([]);
    const [ scrollY, setScrollY ] = useState(0);
    const [ scrolledSelect, setScrolledSelect ] = useState(null);

    const route = useRoute();
    const scrollViewRef = useRef();

    const getVideos = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getPlaylist", {
            animeId: route.params?.animeId,
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            const outputObject = new Object();

            for(const i in data) {
                const kind = data[i].kind;
                const similarities = data.filter(x => x.kind === kind);
                
                outputObject[kind] = [];
                outputObject[kind].push(...similarities);
            }

            setVideos(outputObject);

            const images = data.map((item) => {
                return item.video.image;
            });

            setImages(images);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        })
        .finally(() => {
            setLoading(false);
        });
    }; 

    useEffect(() => {
        scrollViewRef.current?.scrollTo({
            y: scrollY,
            animated: true
        })
    }, [scrollY]);

    useEffect(() => {
        getVideos();
    }, []);

    const renderVideos = (item, index) => {
        return (
            <Cell
            title={item.title}
            centered={false}
            key={"video-" + index}
            onPress={() => Linking.openURL(item?.video?.player)}
            before={
                <Image
                source={{
                    uri: item.video.image,
                }}
                style={{
                    width: normalizeSize(125),
                    height: normalizeSize(75),
                    borderRadius: 8
                }}
                />
            }
            subtitle={
                <View style={{ marginTop: 5, width: "98%" }}>
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    >
                        <Icon
                        name={
                            {
                                "vk": "vk-video-logo",
                                "youtube": "youtube-logo",
                                "sibnet": "sibnet-logo",
                            }[item.video.hosting]
                        }
                        />

                        <Text
                        style={{
                            marginLeft: 5,
                            fontWeight: "500",
                            color: theme.text_secondary_color
                        }}
                        >
                            {
                                {
                                    "vk": "VK Video",
                                    "youtube": "YouTube",
                                    "sibnet": "Sibnet",
                                }[item.video.hosting]
                            }
                        </Text>
                    </View>

                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="clock-outline"
                        color={theme.text_secondary_color}
                        size={12}
                        />

                        <Text
                        style={{
                            marginLeft: 5,
                            color: theme.text_secondary_color
                        }}
                        >
                            Добавлено {dayjs().to(dayjs(item.createdAt))}
                        </Text>
                    </View>
                </View>
            }
            />
        )
    };

    const HeaderImage = ({ style }) => {
        const randomImage = () => {
            const randomIndex = Math.abs(Math.round(0 - 0.5 + Math.random() * ((images.length - 1) - 0 + 1)));
            return images[randomIndex];
        }

        return (
            <Image
            source={{
                uri: randomImage()
            }}
            style={{
                width: Dimensions.get("window").width / 2.5,
                height: 250,
                marginHorizontal: 2.5,
                borderRadius: 10,
                marginBottom: 5,
                ...style
            }}
            />
        )
    };

    const renderHeader = () => {
        return (
            <View
            style={{ 
                overflow: "hidden",
                height: 630
            }}>
                <View
                style={{
                    transform: [
                        {
                            rotate: "-10deg"
                        }
                    ],
                    marginTop: -50,
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <HeaderImage />
                        <HeaderImage
                        style={{
                            marginTop: -150
                        }}
                        />
                        <HeaderImage/>
                    </View>
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <HeaderImage />
                        <HeaderImage
                        style={{
                            marginTop: -150
                        }}
                        />
                        <HeaderImage/>
                    </View>
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <HeaderImage />
                        <HeaderImage
                        style={{
                            marginTop: -150
                        }}
                        />
                        <HeaderImage/>
                    </View>
                </View>

                <LinearGradient 
                style={{
                    position: "absolute",
                    zIndex: 100,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                colors={[
                    "transparent",
                    theme.background_content + "50",
                    theme.background_content
                ]}>
                    <Image
                    source={{
                        uri: route.params?.animePoster
                    }}
                    style={{
                        width: normalizeSize(150),
                        height: normalizeSize(200),
                        borderRadius: 10
                    }}
                    />

                    <View
                    style={{
                        marginHorizontal: 25,
                        marginTop: 15
                    }}
                    >
                        <Text
                        numberOfLines={2}
                        style={{
                            color: theme.text_color,
                            fontWeight: "500",
                            fontSize: normalizeSize(16),
                            textAlign: "center"
                        }}
                        >
                            {
                                route.params?.animeTitle
                            }
                        </Text>
                    </View>

                    <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        alignItems: "center"
                    }}
                    >
                        <Text
                        style={{
                            color: theme.text_color,
                            fontWeight: "600",
                            fontSize: normalizeSize(17),
                            marginBottom: 15
                        }}
                        >
                            Плейлисты
                        </Text>

                        <Icon
                        name="chevron-down"
                        color={theme.text_color}
                        />
                    </View>
                </LinearGradient>
            </View>
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
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

            {
                loading ? (
                    <Placeholder
                    icon={
                        <ActivityIndicator
                        color={theme.activity_indicator_color}
                        size={40}
                        />
                    }
                    title="Загрузка видео"
                    subtitle="Пожалуйста, подождите..."
                    />
                ) : (
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    ref={scrollViewRef}
                    >
                        {
                            renderHeader()
                        }

                        {
                            videos?.pv?.length >= 1 && (
                                <View
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "pv" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "pv") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("pv");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="трейлеры"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.pv?.map(renderVideos)
                                    }
                                </View>
                            )
                        }

                        {
                            videos?.op?.length >= 1 && (
                                <View
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "op" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "op") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("op");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="Опенинги"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.op?.map(renderVideos)
                                    }
                                </View>
                            )
                        }

                        {
                            videos?.ed?.length >= 1 && (
                                <View 
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "ed" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "ed") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("ed");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="эндинги"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.ed?.map(renderVideos)
                                    }
                                </View>
                            )
                        }

                        {
                            videos?.episode_preview?.length >= 1 && (
                                <View 
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "episode_preview" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "episode_preview") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("episode_preview");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="Превью"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.episode_preview?.map(renderVideos)
                                    }
                                </View>
                            )
                        }

                        {
                            videos?.op_ed_clip?.length >= 1 && (
                                <View
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "op_ed_clip" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "op_ed_clip") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("op_ed_clip");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="Музыкальные клипы"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.op_ed_clip?.map(renderVideos)
                                    }
                                </View>
                            )
                        }
                                
                        {
                            videos?.other?.length >= 1 && (
                                <View 
                                style={{ marginBottom: 30, backgroundColor: scrolledSelect === "other" ? theme.divider_color : "transparent" }}
                                onLayout={(e) => {
                                    if(route.params?.selectKind !== "other") return;

                                    setScrollY(e.nativeEvent.layout.y);
                                    setScrolledSelect("other");
                                    sleep(2).then(() => setScrolledSelect(false));  
                                }}
                                >
                                    <ContentHeader
                                    text="Другие"
                                    indents
                                    textStyle={{ color: theme.text_color }}
                                    />
                                    {
                                        videos?.other?.map(renderVideos)
                                    }
                                </View>
                            )
                        }
                    </ScrollView>
                )
            }
        </View>
    )
};