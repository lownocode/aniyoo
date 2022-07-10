import axios from "axios";
import React, { useContext, useState } from "react";
import { TextInput, View, StatusBar, ActivityIndicator, FlatList } from "react-native";

import { 
    Avatar,
    Cell,
    Icon,
    Placeholder,
    PressIcon
} from "../components";

import ThemeContext from "../config/ThemeContext";
import { storage } from "../functions";

const SearchInput = (props) => {
    const theme = useContext(ThemeContext);

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
            <Icon
            name="account-search-outline"
            type="MaterialCommunityIcons"
            color={theme.text_secondary_color}
            size={20}
            style={{
                marginLeft: 15,
                marginRight: 10
            }}
            />

            <TextInput
            value={value}
            placeholder="Поиск пользователей"
            style={{
                height: 40,
                flex: 1,
            }}
            placeholderTextColor={theme.text_secondary_color}
            onChangeText={onChangeText}
            returnKeyType="search"
            selectionColor={theme.accent}
            />

            {
                value.length > 0 && (
                    <PressIcon
                    icon={
                        <Icon
                        name="backspace-outline"
                        type="Ionicons"
                        color={theme.text_secondary_color}
                        size={20}
                        />
                    }
                    containerStyle={{
                        marginHorizontal: 10
                    }}
                    onPress={() => onChangeText("")}
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
            setFindedUsers(data);
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
            setFindedUsers(findedUsers.concat(data));
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        });
    };

    const renderUsers = ({ item }) => {
        return (
            <Cell
            title={item.nickname}
            subtitle="0 друзей"
            before={
                <Avatar
                url={item.photo}
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
                    type="AntDesign"
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
            </View>

            {
                (findedUsers.length === 0 && text.length === 0) ? (
                    <Placeholder
                    icon={
                        <Icon
                        name="feather"
                        type="Entypo"
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
                        name="ios-sad-outline"
                        type="Ionicons"
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