import axios from "axios";
import React, { useContext, useState, useRef, useEffect } from "react";
import { 
    TextInput, 
    View, 
    StatusBar, 
    ActivityIndicator, 
    FlatList, 
    TouchableNativeFeedback 
} from "react-native";
import Clipboard from "@react-native-community/clipboard";

import { 
    Avatar,
    Cell,
    Icon,
    Placeholder,
    PressIcon,
    Text
} from "../../components";

import ThemeContext from "../../config/ThemeContext";
import { storage } from "../../functions";

const SearchInput = (props) => {
    const theme = useContext(ThemeContext);
    const inputRef = useRef();

    const {
        value,
        onChangeText
    } = props;

    return (
        <View
        style={{
            backgroundColor: theme.divider_color,
            marginHorizontal: 15,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            flex: 1
        }}
        >
            <View
            style={{
                marginLeft: 15,
                marginRight: 10
            }}
            >
                <Icon
                name="user-search-outline"
                color={theme.text_secondary_color}
                />
            </View>

            <TextInput
            value={value}
            placeholder="Поиск пользователей"
            style={{
                height: 40,
                flex: 1,
                color: theme.text_color
            }}
            placeholderTextColor={theme.text_secondary_color}
            onChangeText={onChangeText}
            returnKeyType="search"
            selectionColor={theme.accent}
            ref={inputRef}
            />

            {
                value.length > 0 && (
                    <PressIcon
                    icon={
                        <Icon
                        name="backspace"
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginHorizontal: 10
                    }}
                    onPress={() => {
                        inputRef.current?.focus();
                        onChangeText("");
                    }}
                    />
                )
            }
        </View>
    )
};

export const SearchUsers = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const [ text, setText ] = useState("");
    const [ findedUsers, setFindedUsers ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ clipboardText, setClipboardText ] = useState("");

    const getClipboardText = async () => {
        const text = await Clipboard.getString();
        setClipboardText(text);
    };

    useEffect(() => {
        getClipboardText();
    }, []);

    const search = async (text) => {
        setText(text);
        setLoading(true);
        
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/users.search", {
            nickname: text,
            limit: 15
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setFindedUsers(data.users);
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        })
        .finally(() => setLoading(false));
    };

    const loadMoreUsers = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/users.search", {
            nickname: text,
            limit: 15,
            offset: findedUsers.length
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            setFindedUsers(findedUsers.concat(data.users));
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const renderUsers = ({ item }) => {
        return (
            <Cell
            title={
                <View
                style={{
                    alignItems: "center",
                    flexDirection: "row"
                }}
                >
                    {
                        item.relation === "friends" && (
                            <Icon
                            name="users-friends"
                            color={theme.text_color}
                            />
                        )
                    }

                    <Text
                    numberOfLines={1}
                    style={{
                        fontWeight: "500",
                        fontSize: 15.5,
                        color: theme.text_color,
                        marginLeft: item.relation === "friends" ? 5 : 0,
                        width: "90%"
                    }}
                    >
                        {item.nickname}
                    </Text>
                </View>
            }
            subtitle={item.status}
            maxSubtitleLines={1}
            before={
                <Avatar
                url={item.photo}
                online={(+new Date() - +new Date(item?.online?.time)) < 1 * 60 * 1000}
                />
            }
            onPress={() => navigate("user_profile", { userId: item.id })}
            />
        )
    }; 

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <View
            style={{
                paddingTop: StatusBar.currentHeight + 20,
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 5
            }}
            >
                <PressIcon
                icon={
                    <Icon
                    name="close"
                    color={theme.text_secondary_color}
                    size={20}
                    />
                }
                containerStyle={{
                    marginLeft: 15
                }}
                onPress={() => goBack()}
                />

                <SearchInput 
                onChangeText={search} 
                value={text} 
                />

                <PressIcon
                icon={
                    <Icon
                    name="mic-outline"
                    color={theme.text_secondary_color}
                    size={22}
                    />
                }
                containerStyle={{
                    marginRight: 5
                }}
                onPress={() => goBack()}
                />

                <PressIcon
                icon={
                    <Icon
                    name="options"
                    color={theme.text_secondary_color}
                    size={22}
                    />
                }
                containerStyle={{
                    marginRight: 15
                }}
                onPress={() => goBack()}
                />
            </View>

            {
                clipboardText.length > 1 && (findedUsers.length === 0 && text.length === 0) ? (
                    <View
                    style={{
                        margin: 10,
                        borderRadius: 10,
                        backgroundColor: theme.divider_color + "50",
                        overflow: "hidden",
                    }}
                    >
                        <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                        onPress={() => search(clipboardText)}
                        >
                            <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 10
                            }}
                            >
                                <Icon
                                name="copy-outline"
                                size={17}
                                color={theme.icon_color}
                                />

                                <View
                                style={{
                                    marginHorizontal: 10,
                                    flex: 1
                                }}
                                >
                                    <Text
                                    numberOfLines={2}
                                    style={{
                                        fontWeight: "500",
                                        color: theme.text_color,
                                        fontSize: 15
                                    }}
                                    >
                                        {clipboardText}
                                    </Text>
                                    <Text
                                    style={{
                                        color: theme.text_secondary_color,
                                        fontSize: 13
                                    }}
                                    >
                                        Возможно, вы скопировали имя пользователя
                                    </Text>
                                </View>

                                <Icon
                                name="chevron-right"
                                color={theme.icon_color}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                ) : null
            }

            {
                (findedUsers.length === 0 && text.length === 0) ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="pencil-write"
                        color={theme.icon_color}
                        size={40}
                        />
                    }
                    title="Начните вводить никнейм"
                    subtitle="Здесь будут показаны подходящие по никнейму пользователи"
                    />
                ) : loading ? (
                    <Placeholder
                    icon={
                        <ActivityIndicator
                        color={theme.activity_indicator_color}
                        size={40}
                        />
                    }
                    title="Выполняется поиск"
                    subtitle="Нужно немного подождать..."
                    />
                ) : (text.length > 0 && findedUsers.length === 0 || text.length === 0 && findedUsers.length > 0) ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="smiley-sad"
                        color={theme.icon_color}
                        size={40}
                        />
                    }
                    title="Пользователи не найдены"
                    subtitle="К сожалению, мы не смогли найти пользователя с таким никнеймом"
                    />
                ) : (
                    <FlatList
                    data={findedUsers}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderUsers}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="always"
                    onEndReached={() => loadMoreUsers()}
                    />
                )
            }
        </View>
    )
};