import React from "react";
import { TouchableNativeFeedback, View, Text } from "react-native";
import { useSelector } from "react-redux";

import { 
    Icon,
    Header,
    Panel,
} from "../components";

export const Search = (props) => {
    const { theme } = useSelector(state => state.theme);

    const { 
        navigation: {
            navigate
        }
    } = props;

    return (
        <Panel
        headerProps={{
            title: "Поиск"
        }}
        >
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
                                    fontSize: 16,
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
                                    fontSize: 16,
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
        </Panel>
    )
};