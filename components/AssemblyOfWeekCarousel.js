import React, { useContext } from "react";
import { View, ScrollView, Image, Dimensions, TouchableNativeFeedback, Text } from "react-native";
import { Cell, Icon } from ".";

import ThemeContext from "../config/ThemeContext";

export const AssemblyOfWeekCarousel = (props) => {
    const theme = useContext(ThemeContext);

    const { items = [] } = props;

    return (
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
            {
                items.map((item, index) => {
                    return (
                        <View
                        key={"assembly_" + index}
                        style={{
                            margin: 15,
                            marginLeft: index === 0 ? 15 : 0,
                            borderRadius: 8,
                            overflow: "hidden",
                            width: Dimensions.get("window").width / 1.4,
                            borderColor: theme.divider_color,
                            borderWidth: 1
                        }}
                        >
                            <TouchableNativeFeedback
                            onPress={() => console.log("on press assem")}
                            background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                            >
                                <View>
                                    <Image
                                    resizeMethod="resize"
                                    source={{
                                        uri: item?.cover
                                    }}
                                    style={{
                                        width: Dimensions.get("window").width / 1.4,
                                        height: 130,
                                        borderTopLeftRadius: 8,
                                        borderTopRightRadius: 8,
                                        backgroundColor: theme.divider_color,
                                    }}
                                    />

                                    <View
                                    style={{
                                        marginHorizontal: 10,
                                        marginBottom: 5
                                    }}
                                    >
                                        <Cell
                                        title={item?.title}
                                        containerStyle={{
                                            paddingLeft: 0,
                                        }}
                                        titleStyle={{
                                            marginLeft: 0
                                        }}
                                        disabled
                                        maxTitleLines={1}
                                        maxSubtitleLines={3}
                                        subtitle={item?.description}
                                        />
                                    </View>

                                    <View
                                    style={{
                                        height: 30,
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        borderColor: theme.divider_color,
                                        borderTopWidth: 0.4,
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
                                            name="like2"
                                            type="AntDesign"
                                            color={theme.text_color}
                                            style={{
                                                marginRight: 5
                                            }}
                                            size={15}
                                            />

                                            <Text
                                            style={{
                                                color: theme.text_color,
                                                fontSize: 12,
                                                fontWeight: "600"
                                            }}
                                            >
                                                {item?.likes}
                                            </Text>
                                        </View>

                                        <View style={{ height: 20, width: 0.6, backgroundColor: theme.divider_color }}/>
                                    
                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        >
                                            <Icon
                                            name="bookmark-o"
                                            type="FontAwesome"
                                            color={theme.text_color}
                                            style={{
                                                marginRight: 5
                                            }}
                                            size={15}
                                            />

                                            <Text
                                            style={{
                                                color: theme.text_color,
                                                fontSize: 12,
                                                fontWeight: "600"
                                            }}
                                            >
                                                {item?.bookmarks}
                                            </Text>
                                        </View>

                                        <View style={{ height: 20, width: 0.6, backgroundColor: theme.divider_color }}/>

                                        <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        >
                                            <Icon
                                            name="comment-multiple-outline"
                                            type="MaterialCommunityIcons"
                                            color={theme.text_color}
                                            style={{
                                                marginRight: 5
                                            }}
                                            size={15}
                                            />

                                            <Text
                                            style={{
                                                color: theme.text_color,
                                                fontSize: 12,
                                                fontWeight: "600"
                                            }}
                                            >
                                                {item?.comments}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    )
                })
            }
        </ScrollView>
    )
};