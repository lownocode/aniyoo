import React, { useContext, useEffect, useRef, useState } from "react";
import { 
    StatusBar, 
    TouchableNativeFeedback, 
    Text, 
    View, 
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    PanResponder
} from "react-native";
import Video from "react-native-video";
import { useRoute } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import Orientation from "react-native-orientation";
import axios from "axios";
import { hideNavigationBar } from "react-native-navigation-bar-color";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { Icon } from "../../components";
import { 
    AnimeWatchedBefore, 
    ChangeVideoQuality, 
    ChangeVideoRate 
} from "../../modals";

import ThemeContext from "../../config/ThemeContext";
import { declOfNum, sleep, storage } from "../../functions";

export const AnimeVideoPlayer = (props) => {
    const theme = useContext(ThemeContext);

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
    const [ rate, setRate ] = useState(1);
    const [ videoUrls, setVideoUrls ] = useState(route.params?.videos || {});
    const [ animeData, setAnimeData ] = useState(route.params?.data);
    const [ quality, setQuality ] = useState(Object.keys(route.params?.videos || {})[Object.keys(route.params?.videos || {}).length - 1]);
    const [ loading, setLoading ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);
    const [ lastProgressCurrent, setLastProgressCurrent ] = useState(0);
    const [ swipeBefore, setSwipeBefore ] = useState(0);
    const [ swipeStartPoint, setSwipeStartPoint ] = useState(null);
    const [ swipeMode, setSwipeMode ] = useState(false);
    const [ swipeOffset, setSwipeOffset ] = useState(0);

    const modalRef = useRef();
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
                    translation: animeData.translation
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

            setModalContent(
                <AnimeWatchedBefore 
                data={data}
                animeContinue={(time) => {
                    setPaused(false);
                    videoRef.current?.seek(time);
                    modalRef.current?.close();
                }}
                startOver={() => {
                    setPaused(false);
                    modalRef.current?.close();
                }}
                onClose={() => modalRef.current?.close()}
                />
            );

            setPaused(true);
            modalRef.current?.open();
        }
    }; 

    const prevEpisode = async () => {
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
            setPaused(true);
            setVideoUrls(data.links);
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
            setPaused(true);
            setVideoUrls(data.links);
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

    const changeQuality = async (quality) => {
        // setPaused(true);
        setQuality(quality);
    };
    
    const swipeHandler = (x) => {
        if(swipeBefore > x) {//swipe to left
            const swipeLeftDistance = (swipeStartPoint - x) / 10;
            return setSwipeOffset(-swipeLeftDistance);
        }

        const swipeRightDistance = (x - swipeStartPoint) / 10;
        setSwipeOffset(swipeRightDistance);
    };

    const styles = StyleSheet.create({
        modalContainer: {
            left: Dimensions.get("window").width / 4,
            width: Dimensions.get("window").width / 2,
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
        <GestureHandlerRootView style={{ backgroundColor: "#000", flex: 1 }}>
            <Video
            source={{
                uri: videoUrls[quality]
            }}
            style={{
                flex: 1,
            }}
            resizeMode="contain"
            controls={false}
            ref={videoRef}
            onTouchMove={(e) => {
                if(lockedControls) return;
                
                if(!paused) { setPaused(true) };
                if(!swipeMode) { setSwipeMode(true) };

                setSwipeBefore(e.nativeEvent.locationX);
                swipeHandler(e.nativeEvent.locationX);

                if(swipeStartPoint !== null) return;
                setSwipeStartPoint(e.nativeEvent.locationX);
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
            rate={rate}
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            onClosed={() => setPaused(false)}
            >
                {modalContent}
            </Modalize>
            
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
                                marginTop: 25,
                                flexDirection: "row",
                                marginHorizontal: 10, 
                                marginRight: 50,
                            }}
                            >
                                <TouchableNativeFeedback
                                onPress={() => {
                                    saveAnimeViewData();
                                    goBack();
                                }}
                                background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", true)}
                                >
                                    <View>
                                        <Icon
                                        name="arrow-back"
                                        color="#fff"
                                        size={22}
                                        />
                                    </View>
                                </TouchableNativeFeedback>

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

                                    <TouchableNativeFeedback
                                    onPress={() => setLockedControls(!lockedControls)}
                                    background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", true)}
                                    >
                                        <View>
                                            <Icon
                                            type="Ionicons"
                                            name={lockedControls ? "lock-closed" : "lock-open"}
                                            size={25}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
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
                                            disabled={animeData?.playedEpisode === 1}
                                            >
                                                <View style={{ opacity: animeData?.playedEpisode === 1 ? 0.3 : 1 }}>
                                                    <Icon
                                                    type="Ionicons"
                                                    name="play-back"
                                                    size={35}
                                                    color="#fff"
                                                    />
                                                </View>
                                            </TouchableNativeFeedback>

                                            <View
                                            style={{
                                                marginHorizontal: 120
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
                                                    <View>
                                                        <Icon
                                                        type="Ionicons"
                                                        name={paused ? "play" : "ios-pause"}
                                                        size={60}
                                                        color="#fff"
                                                        />
                                                    </View>
                                                </TouchableNativeFeedback>
                                            </View>

                                            <TouchableNativeFeedback
                                            onPress={() => nextEpisode()}
                                            background={TouchableNativeFeedback.Ripple("rgba(1, 1, 1, .1)", true)}
                                            disabled={animeData?.playedEpisode === animeData?.episodesCount}
                                            >
                                                <View style={{ opacity: animeData?.playedEpisode === animeData?.episodesCount ? 0.3 : 1 }}>
                                                    <Icon
                                                    type="Ionicons"
                                                    name="play-forward"
                                                    size={35}
                                                    color="#fff"
                                                    />
                                                </View>
                                            </TouchableNativeFeedback>
                                        </>
                                    )
                                }
                            </View>

                            {
                                animeData?.opening?.start && (progress.currentTime > animeData?.opening?.start && progress.currentTime < animeData?.opening?.end) ? (
                                    <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                        marginBottom: 10,
                                        marginRight: 25,
                                        backgroundColor: theme.accent,
                                        borderRadius: 100,
                                        position: "absolute",
                                        bottom: 70,
                                        right: 15
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
                                                    fontSize: 13
                                                }}
                                                >
                                                    Пропустить опенинг
                                                </Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                ) : null
                            }

                            <View
                            style={{
                                marginBottom: 5,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%"
                            }}
                            >
                                <Text>
                                    {
                                        progress.currentTime > 3600 ?
                                        dayjs.duration(progress.currentTime * 1000).format('HH:mm:ss') :
                                        dayjs.duration(progress.currentTime * 1000).format('mm:ss')
                                    }
                                </Text>

                                <View style={{ width: "85%" }}>
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

                                <Text>
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
                                marginHorizontal: 10, 
                                marginRight: 40
                            }}
                            >
                                <View
                                style={{
                                    borderRadius: 100,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                    marginRight: 10
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
                                            paddingVertical: 9,
                                            paddingHorizontal: 9,
                                        }}
                                        >
                                            <Icon
                                            type="MaterialCommunityIcons"
                                            name="fit-to-screen-outline"
                                            size={15}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    borderRadius: 100,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
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
                                            paddingVertical: 9,
                                            paddingHorizontal: 9,
                                        }}
                                        >
                                            <Icon
                                            type="MaterialCommunityIcons"
                                            name="picture-in-picture-bottom-right"
                                            size={15}
                                            color="#fff"
                                            />
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    width: 0.5,
                                    height: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 100,
                                    marginHorizontal: 15,
                                    opacity: 0.5
                                }}
                                />

                                <View
                                style={{
                                    borderRadius: 100,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                    marginRight: 10
                                }}
                                >
                                    <TouchableNativeFeedback
                                    onPress={() => {
                                        setModalContent(
                                            <ChangeVideoRate 
                                            selectedRate={rate} 
                                            setRate={setRate} 
                                            onClose={() => modalRef.current?.close()}
                                            />
                                        );
                                        modalRef.current?.open();
                                    }}
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
                                            type="MaterialCommunityIcons"
                                            name="motion-play-outline"
                                            size={15}
                                            color="#fff"
                                            />

                                            <Text
                                            style={{
                                                marginLeft: 7,
                                                fontWeight: "700",
                                                fontSize: 13
                                            }}
                                            >
                                                x{rate}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    borderRadius: 100,
                                    borderColor: theme.text_secondary_color,
                                    borderWidth: 1,
                                }}
                                >
                                    <TouchableNativeFeedback
                                    onPress={() => {
                                        setModalContent(
                                            <ChangeVideoQuality 
                                            selectedQuality={quality} 
                                            changeQuality={changeQuality} 
                                            qualityList={videoUrls} 
                                            onClose={() => modalRef.current?.close()}
                                            />
                                        );
                                        modalRef.current?.open();
                                    }}
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
                                            type="MaterialCommunityIcons"
                                            name="quality-high"
                                            size={15}
                                            color="#fff"
                                            />

                                            <Text
                                            style={{
                                                marginLeft: 5,
                                                fontWeight: "700",
                                                fontSize: 13
                                            }}
                                            >
                                                {quality}p
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                <View
                                style={{
                                    width: 0.5,
                                    height: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: 100,
                                    marginHorizontal: 15,
                                    opacity: 0.5
                                }}
                                />

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
                                                fontSize: 13
                                            }}
                                            >
                                                +1:25
                                            </Text>
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
                                type="Ionicons"
                                name={lockedControls ? "lock-closed" : "lock-open"}
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
                                    fontSize: 32,
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

                            <Text
                            style={{
                                backgroundColor: "rgba(0, 0, 0, .3)",
                                fontWeight: "500",
                                fontSize: 18,
                                color: "#fff",
                                paddingHorizontal: 15,
                                paddingVertical: 2,
                                borderRadius: 8,
                                marginTop: 10
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
                )
            }
        </GestureHandlerRootView>
    )
};