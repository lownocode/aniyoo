import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, Text } from "react-native";

import axios from "axios";

import { 
    Header,
    Button,
    Input,
    PressIcon,
    Icon
} from "../components";

import ThemeContext from "../config/ThemeContext";
import { storage } from "../functions";

export const EditSocialNetworks = (props) => {
    const theme = useContext(ThemeContext);

    const {
        navigation: {
            goBack
        }
    } = props;

    const [ telegram, setTelegram ] = useState("");
    const [ instagram, setInstagram ] = useState("");
    const [ vk, setVk ] = useState("");
    const [ loadng, setLoading ] = useState(false);

    const getUserSocialNetworks = async () => {
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/user.signIn", null, {
            headers: {
                "Authorization": sign
            }
        })
        .then(({ data }) => {
            data.social_networks.map((item) => {
                if(item.network === "telegram") {
                    setTelegram(item.link)
                }
                if(item.network === "instagram") {
                    setInstagram(item.link)
                }
                if(item.network === "vk") {
                    setVk(item.link)
                }
            });
        })
        .catch(({ response: { data } }) => {
            console.log(data)
        })
    };

    useEffect(() => {
        getUserSocialNetworks();
    }, []);

    const save = async () => {
        setLoading(true);
        const sign = await storage.getItem("AUTHORIZATION_SIGN");

        axios.post("/settings.saveSocialNetworks", {
            telegram: telegram,
            instagram: instagram,
            vk: vk,
        }, {
            headers: {
                "Authorization": sign
            }
        });

        setLoading(false);
    };

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Редактировать социальные сети"
            height={30}
            backButton
            backButtonOnPress={() => goBack()}
            />

            <ScrollView>
                <View
                style={{
                    margin: 10
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="sc-telegram"
                        type="EvilIcons"
                        color="#00a6ff"
                        size={20}
                        />
                        <Text
                        style={{
                            color: "#00a6ff",
                            marginLeft: 5,
                            fontWeight: "500"
                        }}
                        >
                            Telegram
                        </Text>
                    </View>
                    <Input
                    placeholder="Введите никнейм"
                    height={40}
                    inputStyle={{
                        backgroundColor: "transparent",
                        borderColor: theme.divider_color,
                    }}
                    containerStyle={{
                        marginTop: 7,
                    }}
                    value={telegram}
                    onChangeText={text => setTelegram(text)}
                    after={
                        telegram.length > 0 && (
                            <PressIcon
                            onPress={() => setTelegram("")}
                            icon={
                                <Icon
                                size={17}
                                name="close"
                                type="AntDesign"
                                />
                            }
                            />
                        )
                    }
                    />
                </View>

                <View
                style={{
                    margin: 10
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="instagram"
                        type="AntDesign"
                        color="#ff005d"
                        size={17}
                        />
                        <Text
                        style={{
                            color: "#ff005d",
                            marginLeft: 5,
                            fontWeight: "500"
                        }}
                        >
                            Instagram
                        </Text>
                    </View>
                    <Input
                    placeholder="Введите никнейм"
                    height={40}
                    inputStyle={{
                        backgroundColor: "transparent",
                        borderColor: theme.divider_color
                    }}
                    containerStyle={{
                        marginTop: 7
                    }}
                    value={instagram}
                    onChangeText={text => setInstagram(text)}
                    after={
                        instagram.length > 0 && (
                            <PressIcon
                            onPress={() => setInstagram("")}
                            icon={
                                <Icon
                                color={theme.icon_color}
                                size={17}
                                name="close"
                                type="AntDesign"
                                />
                            }
                            />
                        )
                    }
                    />
                </View>

                <View
                style={{
                    margin: 10
                }}
                >
                    <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                    >
                        <Icon
                        name="vk"
                        type="Entypo"
                        color="#0062ff"
                        size={20}
                        />
                        <Text
                        style={{
                            color: "#0062ff",
                            marginLeft: 5,
                            fontWeight: "500"
                        }}
                        >
                            ВКонтакте
                        </Text>
                    </View>
                    <Input
                    placeholder="Введите никнейм или id"
                    height={40}
                    inputStyle={{
                        backgroundColor: "transparent",
                        borderColor: theme.divider_color
                    }}
                    containerStyle={{
                        marginTop: 7
                    }}
                    value={vk}
                    onChangeText={text => setVk(text)}
                    after={
                        vk.length > 0 && (
                            <PressIcon
                            onPress={() => setVk("")}
                            icon={
                                <Icon
                                color={theme.icon_color}
                                size={17}
                                name="close"
                                type="AntDesign"
                                />
                            }
                            />
                        )
                    }
                    />
                </View>

                <Button
                title="Сохранить"
                upperTitle={false}
                loading={loadng}
                onPress={() => save()}
                />
            </ScrollView>
        </View>
    )
};