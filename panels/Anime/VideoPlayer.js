import React, { useContext, useEffect, useRef, useState } from "react";
import { 
    StatusBar, 
    TouchableNativeFeedback, 
    Text, 
    View, 
    ActivityIndicator,
    Dimensions,
    StyleSheet
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
import "dayjs/locale/ru";
dayjs.extend(duration);

import { Icon } from "../../components";
import { ChangeVideoQuality, ChangeVideoRate } from "../../modals";

import ThemeContext from "../../config/ThemeContext";
import { declOfNum, storage } from "../../functions";

export const Anime_VideoPlayer = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack
        }
    } = props;

    const route = useRoute();

    const [ controlsOpen, setControlsOpen ] = useState(false);
    const [ paused, setPaused ] = useState(false);
    const [ progress, setProgress ] = useState({});
    const [ seek, setSeek ] = useState(0);
    const [ lockedControls, setLockedControls ] = useState(false);
    const [ rate, setRate ] = useState(1);
    const [ videoUrls, setVideoUrls ] = useState(route.params?.videos || {});
    const [ animeData, setAnimeData ] = useState(route.params?.data);
    const [ quality, setQuality ] = useState(Object.keys(route.params?.videos || {})[Object.keys(route.params?.videos || {}).length - 1]);
    const [ loading, setLoading ] = useState(true);
    const [ modalContent, setModalContent ] = useState(null);

    const modalRef = useRef();

    useEffect(() => {
        hideNavigationBar();
        Orientation.lockToLandscape();
        StatusBar.setHidden(true, "fade");
    }, []);

    const onTouch = () => {
        // setTimeout(() => { setControlsOpen(false) }, 5 * 1000);
        
        setControlsOpen(!controlsOpen);
    };

    const prevEpisode = async () => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        setProgress({ currentTime: 0, seekableDuration: 0, playableDuration: 0 });

        axios.post("/anime.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: animeData.playedEpisode - 1
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setVideoUrls(data);
            setPaused(false);

            setAnimeData({
                ...animeData,
                playedEpisode: animeData.playedEpisode - 1,
            });
            setLoading(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const nextEpisode = async () => {
        if(animeData.playedEpisode === animeData.episodesCount) return goBack();

        setProgress({ currentTime: 0, seekableDuration: 0, playableDuration: 0 });
        setLoading(true);

        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/anime.getVideoLink", {
            animeId: route.params?.animeId,
            translationId: route.params?.translationId,
            episode: animeData.playedEpisode + 1
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setVideoUrls(data);
            setPaused(false);

            setAnimeData({
                ...animeData,
                playedEpisode: animeData.playedEpisode + 1,
            });
            setLoading(false);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };
    const video = useRef();

    const changeQuality = async (quality) => {
        setPaused(true);
        setQuality(quality);
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
            ref={video}
            onTouchMove={(e) => console.log(e.nativeEvent.locationX)}
            onTouchEnd={onTouch}
            onEnd={() => nextEpisode()}
            onBuffer={(isBuffer) =>{
                console.log(isBuffer.isBuffering)
            }}
            paused={paused}
            onLoad={(e) => {
                setLoading(true);
                
                setSeek(progress.currentTime); 

                setPaused(false);
                setLoading(false);
            }}
            onProgress={e => {
                if(e.currentTime >= e.playableDuration) {
                    return setLoading(true);
                }

                setLoading(false);
                setProgress({
                    ...e,
                    currentTime: Number(e.currentTime.toFixed(0))
                });
            }}
            progressUpdateInterval={100}
            seek={seek}
            rate={rate}
            />

            <Modalize
            ref={modalRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles.modalContainer}
            adjustToContentHeight
            >
                {modalContent}
            </Modalize>
            
            {
                controlsOpen && !lockedControls ? (
                    <TouchableNativeFeedback
                    onPress={() => setControlsOpen(false)}
                    background={TouchableNativeFeedback.Ripple("rgba(1, 1, 1, .1)", false)}
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
                                marginTop: 10,
                                flexDirection: "row",
                                marginHorizontal: 10, 
                                marginRight: 50
                            }}
                            >
                                <TouchableNativeFeedback
                                onPress={() => goBack()}
                                background={TouchableNativeFeedback.Ripple("rgba(0, 0, 0, .1)", true)}
                                >
                                    <View>
                                        <Icon
                                        type="AntDesign"
                                        name="arrowleft"
                                        size={30}
                                        color="#fff"
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
                                    value={progress.currentTime}
                                    maximumValue={progress.seekableDuration}
                                    thumbTintColor={theme.accent}
                                    step={1}
                                    maximumTrackTintColor="#fff"
                                    onSlidingComplete={(value) => {
                                        if(!paused) {
                                            setLoading(true);
                                        }
                                        setSeek(value);
                                        setLoading(false);
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
                                    onPress={() => setSeek(progress.currentTime + 85)}
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
                ) : controlsOpen && (
                    <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        marginTop: 15,
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
                )
            }
        </GestureHandlerRootView>
    )
};