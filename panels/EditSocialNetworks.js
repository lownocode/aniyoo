import React, { useState, useEffect, useContext } from "react";
import { View, Vibration, Text, TextInput, TouchableWithoutFeedback, ToastAndroid } from "react-native";
import axios from "axios";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

import { 
    Header,
    Button,
    Icon
} from "../components";

import ThemeContext from "../config/ThemeContext";
import { storage } from "../functions";

export const EditSocialNetworks = (props) => {
    const theme = useContext(ThemeContext);
    const route = useRoute();

    const {
        navigation: {
            goBack
        }
    } = props;

    const [ loading, setLoading ] = useState(false);
    const [ networks, setNetworks ] = useState([
        {
            name: "ВКонтакте",
            network: "vk",
            icon: {
                name: "vk",
                type: "Entypo",
            },
            domain: "https://vk.com/",
            background: "#0062ff"
        },
        {
            name: "Telegram",
            network: "telegram",
            icon: {
                name: "telegram",
                type: "FontAwesome",
            },
            domain: "https://t.me/",
            background: "#00a6ff"
        },
        {
            name: "Instagram",
            network: "instagram",
            icon: {
                name: "instagram",
                type: "AntDesign",
            },
            domain: "https://instagram.com/",
            background: "#ff005d"
        },
        {
            name: "TikTok",
            network: "tiktok",
            icon: {
                name: "tiktok",
                type: "FontAwesome5Brands",
            },
            domain: "https://tiktok.com/@",
            background: "#000"
        },
        {
            name: "Discord",
            network: "discord",
            icon: {
                name: "discord",
                type: "FontAwesome5Brands",
            },
            domain: "nickname#tag",
            background: "#5865F2"
        }
    ]);
    const [ saves, setSaves ] = useState({
        vk: false,
        telegram: false,
        tiktok: false,
        instagram: false,
        discord: false,
    });
    const [ values, setValues ] = useState({
        vk: "",
        telegram: "",
        tiktok: "",
        instagram: "",
        discord: "",
    });

    const setNetworkByRoute = () => {
        const networks = route.params?.networks;
        const mappedNetworks = networks?.map((item) => {
            return {
                ...values,
                [item.network]: item.link
            }
        });

        setValues(mappedNetworks[0]);
    };

    useEffect(() => {
        setNetworkByRoute();
    }, []);

    const renderNetwork = ({ item, index, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableWithoutFeedback
                onLongPress={() => {
                    drag();
                    Vibration.vibrate(50);
                }}
                disabled={isActive}
                >
                    <View
                    key={"network-" + index}
                    style={{
                        backgroundColor: theme.divider_color,
                        margin: 15,
                        borderRadius: 10,
                        overflow: "hidden"
                    }}
                    >
                        <View
                        style={{
                            backgroundColor: item.background,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 15,
                            borderRadius: 3
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
                                name={item.icon.name}
                                type={item.icon.type}
                                size={25}
                                color="#fff"
                                />

                                <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 20,
                                    fontWeight: "500",
                                    marginLeft: 8
                                }}
                                >
                                    {item.name}
                                </Text>
                            </View>

                            <View>
                                <Button
                                title={
                                    saves[item.network] && values[item.network].length > 0 ? "Сохранить" : "Удалить"
                                }
                                disabled={!(saves[item.network] && values[item.network].length > 0)}
                                onPress={() => save(!(saves[item.network] && values[item.network].length > 0), item.network)}
                                containerStyle={{
                                    marginRight: 0,
                                    opacity: !(saves[item.network] && values[item.network].length > 0) ? 0.5 : 1
                                }}
                                size={32}
                                type="outline"
                                backgroundColor="#fff"
                                textColor="#fff"
                                />
                            </View>
                        </View>

                        <View
                        style={{
                            padding: 10,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <View
                            style={{
                                backgroundColor: item.background,
                                paddingHorizontal: 13,
                                paddingVertical: 5,
                                borderRadius: 6
                            }}
                            >
                                <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "500"
                                }}
                                >
                                    {
                                        item.domain
                                    }
                                </Text>
                            </View>

                            <TextInput
                            style={{
                                flex: 1,
                                textAlign: "center"
                            }}
                            value={values[item.network].replace(item.domain, "")}
                            onChangeText={text => {
                                setValues({ ...values, [item.network]: text });
                                setSaves({ ...saves, [item.network]: true });
                            }}
                            placeholder={item.name === "Discord" ? "aniyoo#0000" : "aniyoo"}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScaleDecorator>
        )
    };

    const save = async (isDelete, network) => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        if(isDelete) {
            setValues({ ...values, [network]: "" });
        }

        axios.post("/settings.saveSocialNetworks", {
            ...values,
        }, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });

        setLoading(false);
    };

    return (
        <GestureHandlerRootView style={{ backgroundColor: theme.background_content }}>
            <Header
            title="Редактировать социальные сети"
            height={30}
            backButton
            backButtonOnPress={() => goBack()}
            />

            <DraggableFlatList
            data={networks}
            renderItem={renderNetwork}
            keyExtractor={(_, index) => index.toString()}
            onDragEnd={({ data }) => setNetworks(data)}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            ListHeaderComponent={
                <View
                style={{
                    marginHorizontal: 15,
                    marginVertical: 15,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: theme.divider_color,
                    borderWidth: 1
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 3
                    }}
                    >
                        <Icon
                        name="info"
                        type="Feather"
                        style={{
                            marginRight: 5
                        }}
                        size={16}
                        color={theme.text_color}
                        />
                        <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: theme.text_color
                        }}
                        >
                            Подсказка
                        </Text>
                    </View>

                    <Text
                    style={{
                        color: theme.text_secondary_color
                    }}
                    >
                        Если нажать и удерживать карточку сети, то можно указать какой по счёту будет кнопка выбранной сети :)
                    </Text>
                </View>
            }
            ListFooterComponent={<View style={{ marginBottom: 200 }}/>}
            />
        </GestureHandlerRootView>
    )
};