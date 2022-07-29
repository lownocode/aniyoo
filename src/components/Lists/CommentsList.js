import React, { useContext } from "react";
import { 
    FlatList, 
    View,
    TouchableNativeFeedback,
    Text
} from "react-native";
import {
    Icon,
    Cell,
    Avatar
} from "../";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
dayjs.extend(relativeTime).locale("ru");

import ThemeContext from "../../config/ThemeContext";

export const CommentsList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        list
    } = props;

    const renderComments = ({ item }) => {
        return (
            <View>
                <Cell
                centered={false}
                title={
                    <View>
                        <Text
                        numberOfLines={1}
                        style={{
                            color: theme.text_color,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                        >
                            {item?.user?.nickname}
                        </Text>

                        <View
                        style={{
                            overflow: "hidden",
                            marginVertical: 5,
                            borderRadius: 100
                        }}
                        >
                            <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                            >
                                <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingRight: 10,
                                }}
                                >
                                    <Avatar
                                    url={item.anime.poster}
                                    size={15}
                                    />

                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        color: theme.text_secondary_color,
                                        marginLeft: 5
                                    }}
                                    >
                                        {item.anime.title}
                                    </Text>

                                    <Icon
                                    name="chevron-right"
                                    size={10}
                                    color={theme.text_secondary_color}
                                    /> 
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                before={
                    <Avatar
                    url={item?.user?.photo}
                    size={35}
                    />
                }
                subtitle={
                    <Text
                    selectable
                    selectionColor={theme.accent}
                    style={{
                        color: theme.text_color,
                        fontSize: 14
                    }}
                    >
                        {item.text}
                    </Text>
                }
                additionalContentBottom={
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 15,
                        marginBottom: 10
                    }}
                    >
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Icon
                            name="clock-outline"
                            size={10}
                            color={theme.text_secondary_color}
                            />

                            <Text
                            style={{
                                color: theme.text_secondary_color,
                                marginLeft: 5
                            }}
                            >
                                {
                                    dayjs().to(item.editedAt || item.createdAt)
                                }
                            </Text>
                        </View>

                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <View
                            style={{
                                borderRadius: 100,
                                overflow: "hidden",
                                borderColor: theme.divider_color,
                                borderWidth: item.mark === "down" ? 0 : 1,
                                backgroundColor: item.mark === "down" ? "#f54242" : "transparent"
                            }}
                            >
                                <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                // onPress={() => markComment(item.id, "down")}
                                >
                                    <View
                                    style={{
                                        paddingVertical: 2,
                                        paddingHorizontal: 15,
                                    }}
                                    >
                                        <Icon
                                        name="chevron-down"
                                        color={item.mark === "down" ? "#fff" : theme.icon_color}
                                        size={15}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
    
                            <Text
                            style={{
                                marginHorizontal: 10,
                                fontWeight: "500",
                                color: item.mark === "up" ? theme.accent : item.mark === "down" ? "#f54242" : theme.text_secondary_color
                            }}
                            >
                                {item.rating}
                            </Text>
    
                            <View
                            style={{
                                borderRadius: 100,
                                overflow: "hidden",
                                borderColor: theme.divider_color,
                                borderWidth: item.mark === "up" ? 0 : 1,
                                backgroundColor: item.mark === "up" ? theme.accent : "transparent"
                            }}
                            >
                                <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                                // onPress={() => markComment(item.id, "up")}
                                >
                                    <View
                                    style={{
                                        paddingVertical: 2,
                                        paddingHorizontal: 15,
                                    }}
                                    >
                                        <Icon
                                        name="chevron-up"
                                        color={item.mark === "up" ? "#fff" : theme.icon_color}
                                        size={15}
                                        />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                }
                />
            </View>
        )
    };

    return (
        <FlatList
        data={list.comments}
        keyExtractor={(item) => "comment-" + item.id}
        renderItem={renderComments}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        />
    )
};