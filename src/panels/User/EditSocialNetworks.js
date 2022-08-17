import React, { useState, useEffect } from "react";
import { View, Vibration, TextInput, TouchableWithoutFeedback, ToastAndroid, Text } from "react-native";
import axios from "axios";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { useRoute } from "@react-navigation/native";

import { 
    Button,
    Icon,
    Panel,
} from "../../components";

import { storage } from "../../functions";

export const EditSocialNetworks = (props) => {
    const { theme } = useSelector(state => state.theme);
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
            icon:  "vk",
            domain: "https://vk.com/",
            background: "#0062ff"
        },
        {
            name: "Telegram",
            network: "telegram",
            icon: "telegram",
            domain: "https://t.me/",
            background: "#00a6ff"
        },
        {
            name: "Instagram",
            network: "instagram",
            icon: "instagram",
            domain: "https://instagram.com/",
            background: "#ff005d"
        },
        {
            name: "TikTok",
            network: "tiktok",
            icon: "tiktok",
            domain: "https://tiktok.com/@",
            background: "#000"
        },
        {
            name: "Discord",
            network: "discord",
            icon: "discord",
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

        console.log(networks)

        // const mappedNetworks = networks.map((item) => {
        //     return {
        //         network: item.network
        //     }
        // });

        // if(Object.keys(networks).length > 0) {
        //     const mappedNetworks = networks?.map((item) => {
        //         return {
        //             ...values,
        //             [item.network]: item.username
        //         }
        //     });
        //     console.log(mappedNetworks)
    
        //     setValues(mappedNetworks);
        // }
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
                                name={item.icon}
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
                                title="Сохранить"
                                onPress={() => save()}
                                containerStyle={{
                                    marginRight: 0,
                                }}
                                size={32}
                                type="outline"
                                backgroundColor="#fff"
                                textColor="#fff"
                                loading={loading}
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
                            value={values[item.network]}
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

    const save = async (toast = true) => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        const combinedNetworks = networks.map(item => {
            return {
                network: item.network,
                username: values[item.network]
            }
        });

        axios.post("/settings.saveSocialNetworks", combinedNetworks, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            if(toast) {
                ToastAndroid.show(data.message, ToastAndroid.CENTER);
            }
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        });

        setLoading(false);
    };

    return (
        <Panel
        headerProps={{
            title: "Редактировать социальные сети",
            backOnPress: () => goBack()
        }}
        >
            <DraggableFlatList
            data={networks}
            renderItem={renderNetwork}
            keyExtractor={(_, index) => index.toString()}
            onDragEnd={({ data }) => {
                setNetworks(data);
                save(false);
                ToastAndroid.show("Последовательность социальных сетей сохранена", ToastAndroid.CENTER);
            }}
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
                        name="info-outline"
                        size={13}
                        color={theme.text_color}
                        />
                        <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: theme.text_color,
                            marginLeft: 5
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
        </Panel>
    )
};