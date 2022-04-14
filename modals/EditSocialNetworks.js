import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import axios from "axios";

import {
    Cell,
    Icon,
    Input,
    Button,
    PressIcon
} from "../components";
import { storage } from "../functions";

export const EditSocialNetworks = (props) => {
    const { onClose, style, navigation } = props;

    const [ telegram, setTelegram ] = useState("");
    const [ instagram, setInstagram ] = useState("");
    const [ vk, setVk ] = useState("");
    const [ loadng, setLoading ] = useState(false);
    const [ authData, setAuthData ] = useState({});

    useEffect(() => {
        (async () => {
            const authorizationData = await storage.getItem("authorization_data");

            setAuthData(authorizationData);
            
            const { data } = await axios.post("/user.signIn", authorizationData);

            if(data.user_data.social_networks.find(item => item.network === "telegram")) {
                setTelegram(data.user_data.social_networks.find(item => item.network === "telegram").link)
            }
            if(data.user_data.social_networks.find(item => item.network === "instagram")) {
                setInstagram(data.user_data.social_networks.find(item => item.network === "instagram").link)
            }
            if(data.user_data.social_networks.find(item => item.network === "vk")) {
                setVk(data.user_data.social_networks.find(item => item.network === "vk").link)
            }
        })();
    }, []);

    const save = async () => {
        setLoading(true);
        await axios.post("/user.saveSocialNetworks", {
            email: authData.email,
            password: authData.password,
            telegram: telegram,
            instagram: instagram,
            vk: vk,
        });

        onClose();
        navigation.reset({
            index: 0,
            routes: [{name: "profile"}]
        });
        setLoading(false);
    };

    return (
        <ScrollView>
            <Cell
            style={style}
            title="Редактировать социальные сети"
            subtitle="Здесь можно указать свои ссылки на соц. сети"
            centered
            containerStyle={{
                marginTop: 0
            }}
            disabled
            />

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
                    style={style}
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
                style={style}
                placeholder="Введите никнейм"
                height={40}
                inputStyle={{
                    backgroundColor: "transparent",
                    borderColor: style.divider_color,
                }}
                containerStyle={{
                    marginTop: 7,
                }}
                value={telegram}
                onChangeText={text => setTelegram(text)}
                after={
                    telegram.length > 0 && (
                        <PressIcon
                        style={style}
                        onPress={() => setTelegram("")}
                        icon={
                            <Icon
                            color={style.icon_color}
                            size={17}
                            name="close"
                            type="AntDesign"
                            />
                        }
                        />
                    )
                }
                />
                <Text style={{color: style.text_secondary_color, fontSize: 10, marginTop: -10}}>Пример: localhostov</Text>
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
                    style={style}
                    name="instagram"
                    type="AntDesign"
                    color="#ff005d"
                    size={20}
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
                style={style}
                placeholder="Введите никнейм"
                height={40}
                inputStyle={{
                    backgroundColor: "transparent",
                    borderColor: style.divider_color
                }}
                containerStyle={{
                    marginTop: 7
                }}
                value={instagram}
                onChangeText={text => setInstagram(text)}
                after={
                    instagram.length > 0 && (
                        <PressIcon
                        style={style}
                        onPress={() => setInstagram("")}
                        icon={
                            <Icon
                            color={style.icon_color}
                            size={17}
                            name="close"
                            type="AntDesign"
                            />
                        }
                        />
                    )
                }
                />
                <Text style={{color: style.text_secondary_color, fontSize: 10, marginTop: -10}}>Пример: localhostov</Text>
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
                    style={style}
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
                style={style}
                placeholder="Введите никнейм или id"
                height={40}
                inputStyle={{
                    backgroundColor: "transparent",
                    borderColor: style.divider_color
                }}
                containerStyle={{
                    marginTop: 7
                }}
                value={vk}
                onChangeText={text => setVk(text)}
                after={
                    vk.length > 0 && (
                        <PressIcon
                        style={style}
                        onPress={() => setVk("")}
                        icon={
                            <Icon
                            color={style.icon_color}
                            size={17}
                            name="close"
                            type="AntDesign"
                            />
                        }
                        />
                    )
                }
                />
                <Text style={{color: style.text_secondary_color, fontSize: 10, marginTop: -10}}>Пример: localhostov или id590452995</Text>
            </View>

            <View style={{flexDirection: "row"}}>
                <Button
                style={style}
                title="Отмена"
                upperTitle={false}
                loading={loadng}
                type="outline"
                onPress={() => onClose()}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />
                
                <Button
                style={style}
                title="Сохранить"
                upperTitle={false}
                loading={loadng}
                onPress={() => save()}
                containerStyle={{
                    maxWidth: "50%"
                }}
                />
            </View>
        </ScrollView>
    )
};