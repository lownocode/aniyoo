import React, { 
    useContext, 
    useEffect, 
    useState, 
    createRef, 
    useRef, 
    forwardRef, 
    useCallback 
} from "react";

import { 
    View, 
    Animated,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import axios from "axios";

import {
    Header,
    MyAnimeList,
    Text
} from "../components";

import ThemeContext from "../config/ThemeContext";

import { storage } from "../functions";

const { width } = Dimensions.get("screen");

export const Lists = props => {    
    const theme = useContext(ThemeContext);

    const { navigation } = props;

    const [ tab, setTab] = useState("watching");
    const [ tabContent, setTabContent ] = useState([
        {
            id: "watching",
            list: [],
        }, 
        {
            id: "completed",
            list: [],
        }, 
        {
            id: "planned",
            list: [],
        }, 
        {
            id: "postponed",
            list: [],
        }, 
        {
            id: "dropped",
            list: [],
        },
    ]);

    const tabs = [
        { tab: "Смотрю", ref: createRef(), id: "watching" },
        { tab: "Просмотрено", ref: createRef(), id: "completed"  },
        { tab: "В планах", ref: createRef(), id: "planned"  },
        { tab: "Отложено", ref: createRef(), id: "postponed"  },
        { tab: "Брошено", ref: createRef(), id: "dropped"  },
    ];

    const scrollX = useRef(new Animated.Value(0)).current;

    const containerRef = useRef();
    const flatListRef = useRef();

    const onPressTab = useCallback(itemIndex => {
        flatListRef.current?.scrollToOffset({
            offset: itemIndex * width
        });
        containerRef.current?.scrollTo({
            x: itemIndex * width
        });

        setTab(tabs[itemIndex].id);
        getUserLists();
    });

    const getUserLists = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/lists.get", {
            status: tab
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            const newTabContentData = tabContent.map((item) => {
                if(item.id === tab) {
                    return {
                        id: tab,
                        tab: tabContent.find(x => x.id === tab).tab,
                        list: data.list,
                    }
                }

                return item;
            });

            setTabContent(newTabContentData);
        })
        .catch(({ response: { data } }) => {
            console.log(data);
        });
    };

    useEffect(() => {
        getUserLists();
    }, []);

    const Tab = forwardRef(({ item, index }, ref) => {
        return (
            <View
            style={{ 
                overflow: "hidden", 
                marginHorizontal: 20,
                paddingBottom: 5,
            }}
            key={"tab-" + item.id}
            ref={ref}
            >
                <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => onPressTab(index)}
                >
                    <View 
                    style={{
                        paddingVertical: 10,
                    }}
                    >
                        <Text
                        style={{
                            color: theme.text_color,
                        }}
                        >
                            {item.tab}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    });

    const Indicator = ({ measures }) => {
        const inputRange = tabs.map((_, i) => i * width);

        const indicatorWidth = scrollX.interpolate({
            inputRange,
            outputRange: measures.map(measure => measure.width),
        });

        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: measures.map(measure => measure.x)
        });

        return (
            <Animated.View 
            style={{
                backgroundColor: "white",
                bottom: 0,
                left: 0,
                position: "absolute",
                height: 4.5,
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                width: indicatorWidth, 
                transform: [{
                    translateX: translateX
                }]
            }} 
            />
        )
    };

    const Tabs = () => {
        const [ measures, setMeasures ] = useState([]);

        useEffect(() => {
            const m = [];

            tabs.forEach(item => {
                item.ref.current.measureLayout(containerRef.current, (x, y, width, height) => {
                    m.push({
                        x,
                        y,
                        width,
                        height
                    });

                    if(m.length === tabs.length) {
                        setMeasures(m);
                    }
                })
            });
        }, []);

        return (
            <View>
                <Animated.ScrollView
                horizontal
                ref={containerRef}
                showsHorizontalScrollIndicator={false}
                style={{
                    paddingBottom: 2,
                    marginTop: 5,
                }}
                >
                    {
                        tabs.map((item, index) => (
                            <Tab 
                            key={"tab-" + index} 
                            item={item} 
                            index={index} 
                            ref={item.ref} 
                            measures={measures} 
                            />
                        ))
                    }
                    { measures.length > 0 && <Indicator measures={measures} /> }
                </Animated.ScrollView>
            </View>
        )
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Списки"
            height={30}
            />

            <Tabs />

            <Animated.FlatList
            ref={flatListRef}
            data={tabContent}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false } 
            )}
            onScrollEndDrag={(e) => {
                containerRef.current?.scrollTo({
                    x: e.nativeEvent.contentOffset.x < width ? 0 : e.nativeEvent.contentOffset.x
                });
            }}
            renderItem={({ item }) => {
                console.log(JSON.stringify(item, null, "\t"))
                return (
                    <View 
                    style={{
                        width: Dimensions.get("window").width,
                    }}>
                        <MyAnimeList
                        animes={item.list}
                        navigation={navigation}
                        />
                    </View>
                )
            }}
            />
        </View>
    )
};