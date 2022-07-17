import React, { useContext, useEffect } from "react";
import { TouchableNativeFeedback, View, Text } from "react-native";

import { 
    Icon,
    Header
} from "../components";

import { normalizeSize } from "../functions";

import ThemeContext from "../config/ThemeContext";

export const Search = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        navigation: {
            navigate
        }
    } = props;

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Поиск"
            height={30}
            />

            <View>
                <View
                style={{
                    backgroundColor: "#565ee320",
                    overflow: "hidden",
                    borderRadius: 14,
                    margin: 15
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple("#565ee3", false)}
                    onPress={() => navigate("search_anime")}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 15,
                            paddingLeft: 10
                        }}
                        >
                            <View
                            style={{
                                marginRight: 25,
                                marginLeft: 10
                            }}
                            >
                                <Text
                                style={{
                                    color: theme.text_color,
                                    fontSize: normalizeSize(13),
                                    fontWeight: "500"
                                }}
                                >
                                    Поиск аниме
                                </Text>

                                <Text
                                style={{
                                    color: theme.text_secondary_color
                                }}
                                >
                                    Ищешь что посмотреть? У нас найдется все!
                                </Text>
                            </View>

                            <View
                            style={{
                                marginRight: 15
                            }}
                            >
                                <Icon
                                name="search"
                                color="#565ee3"
                                size={25}
                                style={{
                                    marginRight: 15
                                }}
                                />
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <View
                style={{
                    backgroundColor: "#c956e320",
                    overflow: "hidden",
                    borderRadius: 14,
                    marginHorizontal: 15
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple("#c956e3", false)}
                    onPress={() => navigate("search_users")}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 15,
                            paddingLeft: 10
                        }}
                        >
                            <View
                            style={{
                                marginRight: 25,
                                marginLeft: 10
                            }}
                            >
                                <Text
                                style={{
                                    color: theme.text_color,
                                    fontSize: normalizeSize(13),
                                    fontWeight: "500"
                                }}
                                >
                                    Поиск пользователей
                                </Text>

                                <Text
                                style={{
                                    color: theme.text_secondary_color
                                }}
                                >
                                    Найди друга, если он зарегистрирован
                                </Text>
                            </View>

                            <View
                            style={{
                                marginRight: 15
                            }}
                            >
                                <Icon
                                name="user-search-outline"
                                type="MaterialCommunityIcons"
                                color="#c956e3"
                                size={25}
                                />
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>
    )
};