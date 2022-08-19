import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { 
    StatusBar, 
    TouchableNativeFeedback, 
    View, 
    ActivityIndicator,
    PanResponder,
    ToastAndroid,
    TouchableWithoutFeedback,
    Text
} from "react-native";
import Video from "react-native-video";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import Orientation from "react-native-orientation";
import axios from "axios";
import { hideNavigationBar } from "react-native-navigation-bar-color";
import { Menu as Popup } from "react-native-material-menu";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { Cell, Icon, Progress } from "../../components";
import { openModal } from "../../redux/reducers";

import { declOfNum, storage } from "../../functions";

export const AnimeVideoPlayer = (props) => {
    const { theme } = useSelector(state => state.theme);

    const {
        navigation: {
            goBack
        },
    } = props;

    const route = useRoute();

    const [ controlsOpen, setControlsOpen ] = useState(false);
    const [ paused, setPaused ] = useState(false);
    const [ progress, setProgress ] = useState({ currentTime: 0, seekableDuration: 0 });
    const [ lockedControls, setLockedControls ] = useState(false);
    const [ videoUrls, setVideoUrls ] = useState(route.params?.videos || {});
    const [ animeData, setAnimeData ] = useState(route.params?.data);
    const [ loading, setLoading ] = useState(true);
    const [ lastProgressCurrent, setLastProgressCurrent ] = useState(0);
    const [ swipeBefore, setSwipeBefore ] = useState(0);
    const [ swipeStartPoint, setSwipeStartPoint ] = useState(null);
    const [ swipeMode, setSwipeMode ] = useState(false);
    const [ swipeOffset, setSwipeOffset ] = useState(0);
    const [ popupOpen, setPopupOpen ] = useState(null);
    const [ videoPlayerSettings, setVideoPlayerSettings ] = useState({});
    const [ stretched, setStretched ] = useState(false);
    const [ skipToMoment, setSkipToMoment ] = useState(false);
    const [ videoPlayableUrl, setVideoPlayableUrl ] = useState("");

    const videoRef = useRef();

    const panResponder = PanResponder.create({
        onPanResponderTerminate: () => {
            console.log("ad12")
        },
        // onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        // onPanResponderTerminationRequest: (evt, gestureState) => true,
        // onShouldBlockNativeResponder: (evt, gestureState) => true,

        onPanResponderRelease: (evt, gestureState) => {
            console.log("ad12")
        },
        onPanResponderMove: (e) => {
            if(!paused) setPaused(true);
            if(!swipeMode) setSwipeMode(true);
            if(controlsOpen) setControlsOpen(false);

            setSwipeBefore(e.nativeEvent.locationX);
            swipeHandler(e.nativeEvent.locationX);
            
            if(swipeStartPoint !== null) return;
            setSwipeStartPoint(e.nativeEvent.locationX);
        },
    })

    const saveAnimeViewData = async () => {
        if(progress.currentTime % 3 !== 2) return;

        const animeAllViewed = await storage.getItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`);

        if(animeAllViewed === null) {
            return storage.setItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`, [
                {
                    id: route.params?.animeId,
                    viewed_up_to: progress.currentTime || 0,
                    duration: progress.seekableDuration || 0,
                    translationId: route.params?.translationId,
                    episode: animeData.playedEpisode,
                    translation: animeData.translation,
                    source: route.params?.source
                }
            ]);
        }

        const newAnimeViewData = animeAllViewed.map((item) => {
            if(item.episode === animeData.playedEpisode && item.translationId === route.params?.translationId) {
                return {
                    id: route.params?.animeId,
                    viewed_up_to: progress.currentTime || 0,
                    duration: progress.seekableDuration || 0,
                    translationId: route.params?.translationId,
                    episode: animeData.playedEpisode,
                    translation: animeData.translation
                }
            } 

            return item;
        });

        if(!newAnimeViewData.find(x => x.episode === animeData.playedEpisode && x.translationId === route.params?.translationId)) {
            newAnimeViewData.push({
                id: route.params?.animeId,
                viewed_up_to: progress.currentTime || 0,
                duration: progress.seekableDuration || 0,
                translationId: route.params?.translationId,
                episode: animeData.playedEpisode
            });
        }

        storage.setItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`, newAnimeViewData);
    };

    const getVideoPlayerSetting = async () => {
        const settings = await storage.getItem("VIDEOPLAYER_SETTINGS");

        const defaultSettingsScheme = {
            rate: 1,
            quality: "720"
        };

        console.log(settings)

        if(!settings) {
            setVideoPlayerSettings(defaultSettingsScheme);
            getVideoPlayableUrl("720");
            return storage.setItem("VIDEOPLAYER_SETTINGS", defaultSettingsScheme);
        }

        videoRef.current?.setNativeProps({
            rate: settings?.rate,
        });

        setVideoPlayerSettings(settings);

        getVideoPlayableUrl(settings?.quality);
    };

    useEffect(() => {
        saveAnimeViewData();
    }, [progress]);

    const settingVideoSpace = () => {
        hideNavigationBar();
        StatusBar.setHidden(true, "fade");
        Orientation.lockToLandscape();

        const orientation = new Promise((resolve) => {
            setTimeout(() => {
                Orientation.getOrientation((_, orientation) => resolve(orientation));
            }, 500);
        });

        orientation.then((orientation) => {
            if(orientation === "LANDSCAPE") {
                return getWatchedBefore();
            }
        });
    };

    useEffect(() => {
        getVideoPlayerSetting();
        settingVideoSpace();
    }, []);

    const onTouch = () => {
        if(swipeMode) {
            setSwipeStartPoint(null);
            setSwipeBefore(0);
            setSwipeMode(false);
            videoRef.current?.seek(progress.currentTime + swipeOffset);
            return setPaused(false);
        }

        setControlsOpen(!controlsOpen);
    };

    const getWatchedBefore = async () => {
        const animeAllViewed = await storage.getItem(`ANIME_VIEW__ID=${route.params?.animeId || 0}`);

        if(animeAllViewed?.find(x => x.episode === animeData.playedEpisode && x.translationId === route.params?.translationId)) {
            const data = animeAllViewed?.find(x => x.episode === animeData.playedEpisode && x.translationId === route.params?.translationId);

            dispatch(openModal({ 
                visible: true, 
                id: "ANIME_WATCHED_BEFORE",
                props: {
                    data,
                    animeContinue: (time) => {
                        setPaused(false);
                        videoRef.current?.seek(time);
                    },
                    startOver: () => {
                        setPaused(false)
                    }
                } 
            }));

            setPaused(true);
        }
    }; 

    const prevEpisode = async () => {
        setPaused(true);
        setLoading(true);

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: Number(animeData.playedEpisode) - 1,
            source: route.params?.source
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setVideoUrls(data.links);
            getVideoPlayableUrl(videoPlayerSettings?.quality, data.links);
            
            videoRef.current?.seek(0);
            setProgress({ currentTime: 0, seekableDuration: 0, playableDuration: 0 });

            setAnimeData({
                ...animeData,
                playedEpisode: Number(animeData.playedEpisode) - 1,
                opening: data.opening,
                ending: data.ending
            });
            setPaused(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const nextEpisode = async () => {
        setPaused(true);
        setLoading(true);

        if(animeData.playedEpisode === animeData.episodesCount) return goBack();

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/animes.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: Number(animeData.playedEpisode) + 1,
            source: route.params?.source
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setVideoUrls(data.links);
            getVideoPlayableUrl(videoPlayerSettings?.quality, data.links);

            videoRef.current?.seek(0);
            setProgress({ currentTime: 0, seekableDuration: 0, playableDuration: 0 });

            setAnimeData({
                ...animeData,
                playedEpisode: Number(animeData.playedEpisode) + 1,
                opening: data.opening,
                ending: data.ending
            });
            setPaused(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };
    
    const swipeHandler = (x) => {
        const uncertainty = 2;

        if(lockedControls) return;
        if(swipeStartPoint === null) {
            return setSwipeStartPoint(x);
        } 

        if(swipeBefore > x) {//swipe to left
            const swipeLeftDistance = (swipeStartPoint - x) / 5;
            
            if(swipeLeftDistance < uncertainty && swipeLeftDistance > 0) return;

            setLoading(false);
            setPaused(true);
            setSwipeMode(true);
            setSwipeOffset(-(swipeLeftDistance - uncertainty));
        }

        if(swipeBefore < x) {
            const swipeRightDistance = (x - swipeStartPoint) / 5;

            if(swipeRightDistance < uncertainty && swipeRightDistance > 0) return;
            
            setLoading(false);
            setPaused(true);
            setSwipeMode(true);
            setSwipeOffset(swipeRightDistance - uncertainty);
        } 
    };

    const getVideoPlayableUrl = async (quality, urls) => {
        const qualityList = Object.keys(urls || videoUrls);

        if(qualityList.length === 0) {
            ToastAndroid.show("Запрашиваемое видео не найдено", ToastAndroid.LONG);
            return goBack();
        }

        if(!qualityList.find(q => q === quality)) {
            ToastAndroid.show("Выбранное качество не найдено, будет воспроизведено максимально возможное", ToastAndroid.LONG);

            const settings = await storage.getItem("VIDEOPLAYER_SETTINGS");
            storage.setItem("VIDEOPLAYER_SETTINGNS", {
                ...settings,
                quality: qualityList[qualityList.length - 1]
            });

            setVideoPlayerSettings({
                ...videoPlayerSettings,
                quality: qualityList[qualityList.length - 1]
            });

            return setVideoPlayableUrl(
                urls 
                ? urls[qualityList[qualityList.length - 1]] 
                : videoUrls[qualityList[qualityList.length - 1]]
            );
        }

        console.log(urls ? urls[quality] : videoUrls[quality])
        return setVideoPlayableUrl(urls ? urls[quality] : videoUrls[quality]);
    };

    return (
        <View style={{ backgroundColor: "#000", flex: 1, }}>
            <Video
            source={{
                uri: videoPlayableUrl
            }}
            style={{
                flex: 1,
                height: "100%"
            }}
            resizeMode={stretched ? "cover" : "contain"}
            controls={false}
            ref={videoRef}
            onTouchMove={(e) => {
                setSwipeBefore(e.nativeEvent.locationX);
                swipeHandler(e.nativeEvent.locationX);
            }}
            onTouchEnd={onTouch}
            onEnd={() => nextEpisode()}
            paused={paused}
            onProgress={e => {
                if(e.currentTime === lastProgressCurrent) {
                    return setLoading(true);
                } 

                setLoading(false);
                setProgress({
                    ...e,
                    currentTime: Number(e.currentTime.toFixed(0)),
                });
                setLastProgressCurrent(e.currentTime);
            }}
            progressUpdateInterval={1000}
            onError={(e) => {
                ToastAndroid.show(`Произошла ошибка при загрузке видео, попробуйте позже.\n${e.error.errorString || ""}`, ToastAndroid.LONG);
                goBack();
            }}
            onLoad={() => {
                if(skipToMoment && lastProgressCurrent > 0) {
                    videoRef.current?.seek(lastProgressCurrent);
                    setSkipToMoment(false);
                }
            }}
            />
            
            {
                controlsOpen && !lockedControls ? (
                    <TouchableNativeFeedback
                    onPress={() => setControlsOpen(false)}
                    background={TouchableNativeFeedback.Ripple("transparent")}
                    >
                        <View
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, .5)",
                            zIndex: 10,
                        }}
                        >
                            <View
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                marginRight: 50,
                            }}
                            >
                                <TouchableWithoutFeedback
                                onPress={() => {
                                    saveAnimeViewData();
                                    goBack();
                                }}
                                >
                                    <View
                                    style={{
                                        paddingLeft: 30,
                                        paddingHorizontal: 20,
                                        paddingVertical: 30,
                                    }}
                                    >
                                        <Icon
                                        name="arrow-back"
                                        color="#fff"
                                        size={22}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>

                                <View
                                style={{
                                    width: "85%"
                                }}
                                >
                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        fontWeight: "600",
                                        fontSize: 17,
                                        color: "#fff",
                                        textAlign: "center",
                                    }}
                                    >
                                        {animeData?.title}
                                    </Text>
                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        color: theme.text_secondary_color,
                                        textAlign: "center"
                                    }}
                                    >
                                        {animeData?.playedEpisode} из {animeData?.episodesCount} {declOfNum(animeData.episodesCount, ["серии", "серий", "серий"])} • {animeData?.translation}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ marginRight: 20 }} />

                                    <TouchableWithoutFeedback
                                    onPress={() => {
                                        setLockedControls(!lockedControls);
                                        setControlsOpen(false);
                                    }}
                                    >
                                        <View
                                        style={{
                                            paddingRight: 30,
                                            paddingHorizontal: 20,
                                            paddingVertical: 30,
                                        }}
                                        >
                                            <Icon
                                            name={lockedControls ? "lock" : "lock-open"}
                                            size={25}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>

                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                flex: 1,
                            }}
                            >
                                {
                                    loading ? (
                                        <ActivityIndicator
                                        color="#fff"
                                        size={55}
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                            borderRadius: 100
                                        }}
                                        />
                                    ) : (
                                        <>
                                            <TouchableNativeFeedback
                                            onPress={() => prevEpisode()}
                                            background={TouchableNativeFeedback.Ripple("rgba(1, 1, 1, .1)", true)}
                                            disabled={Number(animeData?.playedEpisode) === 1}
                                            >
                                                <View 
                                                style={{ 
                                                    opacity: Number(animeData?.playedEpisode) === 1 ? 0.3 : 1,
                                                    padding: 10
                                                }}
                                                >
                                                    <Icon
                                                    name="skip-previous"
                                                    size={30}
                                                    color="#fff"
                                                    />
                                                </View>
                                            </TouchableNativeFeedback>

                                            <View
                                            style={{
                                                marginHorizontal: 100
                                            }}
                                            >
                                                <TouchableNativeFeedback
                                                onPress={() => { 
                                                    if(!paused) return setPaused(true);

                                                    setLoading(true); 
                                                    setPaused(false); 
                                                }}
                                                background={TouchableNativeFeedback.Ripple("rgba(1, 1, 1, .1)", true)}
                                                >
                                                    <View
                                                    style={{
                                                        padding: 10
                                                    }}
                                                    >
                                                        <Icon
                                                        name={paused ? "play" : "pause"}
                                                        size={45}
                                                        color="#fff"
                                                        />
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>

                                            <TouchableNativeFeedback
                                            onPress={() => nextEpisode()}
                                            background={TouchableNativeFeedback.Ripple("rgba(1, 1, 1, .1)", true)}
                                            disabled={Number(animeData?.playedEpisode) === Number(animeData?.episodesCount)}
                                            >
                                                <View 
                                                style={{ 
                                                    opacity: Number(animeData?.playedEpisode) === animeData?.episodesCount ? 0.3 : 1,
                                                    padding: 10
                                                }}
                                                >
                                                    <Icon
                                                    type="Ionicons"
                                                    name="skip-next"
                                                    size={30}
                                                    color="#fff"
                                                    />
                                                </View>
                                            </TouchableNativeFeedback>
                                        </>
                                    )
                                }
                            </View>

                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: 10,
                                marginHorizontal: 15,
                            }}
                            >
                                {
                                    animeData?.opening?.start && (progress.currentTime > animeData?.opening?.start && progress.currentTime < animeData?.opening?.end) ? (
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                            backgroundColor: theme.accent,
                                            borderRadius: 100,
                                        }}
                                        >
                                            <TouchableNativeFeedback
                                            onPress={() => videoRef.current?.seek(animeData?.opening?.end)}
                                            background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                            >
                                                <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    paddingVertical: 7,
                                                    paddingHorizontal: 9,
                                                }}
                                                >
                                                    <Icon
                                                    type="Feather"
                                                    name="chevrons-right"
                                                    size={15}
                                                    color="#fff"
                                                    />

                                                    <Text
                                                    style={{
                                                        marginLeft: 5,
                                                        fontWeight: "700",
                                                    }}
                                                    >
                                                        Пропустить опенинг
                                                    </Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    ) : (
                                        <View
                                        style={{
                                            borderRadius: 100,
                                            borderColor: theme.text_secondary_color,
                                            borderWidth: 1,
                                        }}
                                        >
                                            <TouchableNativeFeedback
                                            onPress={() => videoRef.current?.seek(progress.currentTime + 85)}
                                            background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                            >
                                                <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: 80,
                                                    height: 30
                                                }}
                                                >
                                                    <Icon
                                                    name="chevron-right-double"
                                                    size={20}
                                                    color="#fff"
                                                    />

                                                    <Text
                                                    style={{
                                                        marginLeft: 5,
                                                        fontWeight: "700",
                                                        fontSize: 12,
                                                        color: "#fff"
                                                    }}
                                                    >
                                                        +1:25
                                                    </Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    )
                                }
                            </View>

                            <View
                            style={{
                                marginBottom: 10,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: 15,
                            }}
                            >
                                <Text
                                style={{
                                    color: "#fff",
                                }}
                                >
                                    {
                                        progress.currentTime > 3600 ?
                                        dayjs.duration(progress.currentTime * 1000).format('HH:mm:ss') :
                                        dayjs.duration(progress.currentTime * 1000).format('mm:ss')
                                    }
                                </Text>

                                <View style={{ flex: 1 }}>
                                    <Slider
                                    value={lastProgressCurrent}
                                    minimumValue={0}
                                    maximumValue={progress.seekableDuration}
                                    thumbTintColor={theme.accent}
                                    step={1}
                                    maximumTrackTintColor="#fff"
                                    onSlidingComplete={(value) => {
                                        setLastProgressCurrent(value);
                                        setProgress({ ...progress, currentTime: value });
                                        videoRef.current?.seek(value);
                                    }}
                                    onValueChange={(value) => {
                                        setProgress({ ...progress, currentTime: value });
                                    }}
                                    minimumTrackTintColor={theme.accent + "99"}
                                    />
                                </View>

                                <Text
                                style={{
                                    color: "#fff"
                                }}
                                >
                                    {
                                        progress.seekableDuration > 3600 ?
                                        dayjs.duration(progress.seekableDuration * 1000).format('HH:mm:ss') :
                                        dayjs.duration(progress.seekableDuration * 1000).format('mm:ss')
                                    }
                                </Text>
                            </View>

                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginBottom: 12,
                                alignItems: "center",
                                marginHorizontal: 15,
                            }}
                            >
                                <View
                                style={{
                                    borderRadius: 10,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                    marginRight: 10,
                                    width: 35,
                                    height: 35,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                >
                                    <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                    >
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 35,
                                            height: 35
                                        }}
                                        >
                                            <Icon
                                            type="MaterialCommunityIcons"
                                            name="screenshot"
                                            size={17}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    borderRadius: 10,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                    width: 35,
                                    height: 35,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                >
                                    <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                    >
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 35,
                                            height: 35
                                        }}
                                        >
                                            <Icon
                                            name="picture-in-picture"
                                            size={17}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    width: 1,
                                    height: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 100,
                                    marginHorizontal: 15,
                                    opacity: 0.5
                                }}
                                />

                                <Popup
                                visible={popupOpen === "changeRate"}
                                onRequestClose={() => setPopupOpen(null)}
                                animationDuration={0}
                                style={{
                                    backgroundColor: theme.popup_background,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                }}
                                anchor={
                                    <View
                                    style={{
                                        borderRadius: 100,
                                        borderColor: theme.text_secondary_color,
                                        borderWidth: 1,
                                        marginRight: 10
                                    }}
                                    >
                                        <TouchableNativeFeedback
                                        onPress={() => setPopupOpen("changeRate")}
                                        background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                        >
                                            <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: 80,
                                                height: 30
                                            }}
                                            >
                                                <Icon
                                                name="speedometer"
                                                size={15}
                                                color="#fff"
                                                />

                                                <Text
                                                style={{
                                                    marginLeft: 7,
                                                    fontWeight: "700",
                                                    fontSize: 13,
                                                    color: "#fff"
                                                }}
                                                >
                                                    {videoPlayerSettings?.rate}x
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                }
                                >
                                    {
                                        [
                                            { rate: 0.25, name: "Очень медленно" },
                                            { rate: 0.75, name: "Умеренно" },
                                            { rate: 1, name: "По умолчанию" },
                                            { rate: 1.25, name: "Быстрее обычного" },
                                            { rate: 1.75, name: "Быстро" },
                                            { rate: 2, name: "Очень быстро" },
                                        ].map((item) => {
                                            return (
                                                <Cell
                                                key={"rate-x" + item.rate}
                                                title={item.name}
                                                onPress={async () => {
                                                    setPopupOpen(null);
                                                    videoRef.current?.setNativeProps({
                                                        rate: item.rate
                                                    });
                                                    setVideoPlayerSettings({
                                                        ...videoPlayerSettings,
                                                        rate: item.rate
                                                    });

                                                    const playerSettings = await storage.getItem("VIDEOPLAYER_SETTINGS");
                                                    storage.setItem("VIDEOPLAYER_SETTINGS", {
                                                        ...playerSettings,
                                                        rate: item.rate
                                                    });
                                                }}
                                                before={
                                                    <View
                                                    style={{
                                                        width: 45,
                                                        height: 20,
                                                        backgroundColor: videoPlayerSettings?.rate === item.rate ? theme.accent : theme.text_secondary_color + "20",
                                                        borderRadius: 8
                                                    }}
                                                    >
                                                        <Text
                                                        style={{
                                                            fontWeight: "700",
                                                            textAlign: "center",
                                                            color: videoPlayerSettings?.rate === item.rate ? "#fff" : theme.text_secondary_color
                                                        }}
                                                        >
                                                            {item.rate}x
                                                        </Text>
                                                    </View>
                                                }
                                                containerStyle={{
                                                    paddingVertical: 15,
                                                    backgroundColor: videoPlayerSettings?.rate === item.rate && theme.accent + "10"
                                                }}
                                                contentStyle={{
                                                    flex: 0
                                                }}
                                                disabled={videoPlayerSettings?.rate === item.rate}
                                                />
                                            )
                                        })
                                    }
                                </Popup>

                                <Popup
                                visible={popupOpen === "changeQuality"}
                                onRequestClose={() => setPopupOpen(null)}
                                animationDuration={0}
                                style={{
                                    backgroundColor: theme.popup_background,
                                    borderRadius: 10,
                                    overflow: "hidden",
                                }}
                                anchor={
                                    <View
                                    style={{
                                        borderRadius: 100,
                                        borderColor: theme.text_secondary_color,
                                        borderWidth: 1,
                                    }}
                                    >
                                        <TouchableNativeFeedback
                                        onPress={() => setPopupOpen("changeQuality")}
                                        background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                        >
                                            <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: 80,
                                                height: 30
                                            }}
                                            >
                                                <Icon
                                                name="hd"
                                                size={15}
                                                color="#fff"
                                                />

                                                <Text
                                                style={{
                                                    marginLeft: 5,
                                                    fontWeight: "700",
                                                    fontSize: 12,
                                                    color: "#fff"
                                                }}
                                                >
                                                    {videoPlayerSettings?.quality}p
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                }
                                >
                                    {
                                        Object.keys(videoUrls || {}).map((key) => {
                                            if(!videoUrls[key]) return;

                                            const qualityDecode = {
                                                "240": "Ужасное",
                                                "360": "Плохое",
                                                "480": "Среднее",
                                                "720": "Хорошее",
                                                "1080": "Отличное",
                                            };

                                            return (
                                                <Cell
                                                key={"quality-p" + key}
                                                title={qualityDecode[key]}
                                                onPress={async () => {
                                                    setPopupOpen(null);
                                                    setPaused(true);
                                                    setLoading(true);

                                                    getVideoPlayableUrl(String(key));

                                                    setVideoPlayerSettings({
                                                        ...videoPlayerSettings,
                                                        quality: String(key)
                                                    });

                                                    setSkipToMoment(true);

                                                    const playerSettings = await storage.getItem("VIDEOPLAYER_SETTINGS");
                                                    storage.setItem("VIDEOPLAYER_SETTINGS", {
                                                        ...playerSettings,
                                                        quality: String(key)
                                                    });

                                                    setPaused(false);
                                                }}
                                                before={
                                                    <View
                                                    style={{
                                                        width: 50,
                                                        height: 20,
                                                        backgroundColor: videoPlayerSettings?.quality === key ? theme.accent : theme.text_secondary_color + "20",
                                                        borderRadius: 8
                                                    }}
                                                    >
                                                        <Text
                                                        style={{
                                                            fontWeight: "700",
                                                            textAlign: "center",
                                                            color: videoPlayerSettings?.quality === key ? "#fff" : theme.text_secondary_color
                                                        }}
                                                        >
                                                            {key}P
                                                        </Text>
                                                    </View>
                                                }
                                                containerStyle={{
                                                    paddingVertical: 15,
                                                    backgroundColor: videoPlayerSettings?.quality === key && theme.accent + "10"
                                                }}
                                                contentStyle={{
                                                    flex: 0
                                                }}
                                                disabled={videoPlayerSettings?.quality === key}
                                                />
                                            )
                                        })
                                    }
                                </Popup>

                                <View
                                style={{
                                    width: 1,
                                    height: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 100,
                                    marginHorizontal: 15,
                                    opacity: 0.5
                                }}
                                />

                                <View
                                style={{
                                    borderRadius: 10,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                    // marginRight: 10,
                                    width: 35,
                                    height: 35,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                >
                                    <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple("rgba(255, 255, 255, .1)", true)}
                                    onPress={() => setStretched(!stretched)}
                                    >
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 35,
                                            height: 35
                                        }}
                                        >
                                            <Icon
                                            name={stretched ? "arrows-inward" : "arrows-from-inside"}
                                            size={17}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                ) : controlsOpen ? (
                    <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        marginTop: 20,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                    >
                        <View 
                        style={{ 
                            marginRight: 40, 
                            backgroundColor: theme.divider_color + "90",
                            width: 50,
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                        }}
                        >
                        <TouchableNativeFeedback
                        onPress={() => setLockedControls(!lockedControls)}
                        background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", true)}
                        >
                            <View style={{ padding: 5 }}>
                                <Icon
                                name={lockedControls ? "lock" : "lock-open"}
                                size={25}
                                color="#fff"
                                />
                            </View>
                        </TouchableNativeFeedback>
                        </View>
                    </View>
                ) : !controlsOpen && loading ? (
                        <View
                        style={{
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0,
                        }}
                        >
                            <ActivityIndicator
                            color="#fff"
                            size={55}
                            style={{
                                backgroundColor: "rgba(0, 0, 0, .2)",
                                borderRadius: 100
                            }}
                            />
                        </View>
                ) : swipeMode && (
                    <View
                    style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        alignItems: "center",
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                    }}
                    >
                        <View>
                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center"
                            }}
                            >
                                <Text
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, .3)",
                                    fontWeight: "500",
                                    fontSize: 35,
                                    color: "#fff",
                                    paddingHorizontal: 15,
                                    paddingVertical: 2,
                                    borderRadius: 10
                                }}
                                >
                                    {swipeOffset > 0 ? "+ " : "- "} 
                                    {dayjs.duration(Math.abs(swipeOffset) * 1000).format('mm:ss')}
                                </Text>
                            </View>

                            <View>
                                <View
                                style={{
                                    width: 200,
                                    height: 30,
                                    marginTop: 10,
                                    textAlign: "center",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                >
                                    <Progress
                                    step={progress.currentTime + swipeOffset}
                                    steps={progress.seekableDuration}
                                    duration={0}
                                    background={theme.accent}
                                    height={30}
                                    borderRadius={10}
                                    selectColor="rgba(0, 0, 0, .3)"
                                    />

                                        <Text
                                        style={{
                                            fontWeight: "500",
                                            fontSize: 17,
                                            color: "#fff",
                                            position: "absolute",
                                        }}
                                        >
                                            {
                                                progress.currentTime + swipeOffset > 3600 ?
                                                dayjs.duration((progress.currentTime + swipeOffset) * 1000).format('HH:mm:ss') :
                                                dayjs.duration((progress.currentTime + swipeOffset) * 1000).format('mm:ss')
                                            } из {
                                                progress.seekableDuration > 3600 ?
                                                dayjs.duration(progress.seekableDuration * 1000).format('HH:mm:ss') :
                                                dayjs.duration(progress.seekableDuration * 1000).format('mm:ss')
                                            }
                                        </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    )
};