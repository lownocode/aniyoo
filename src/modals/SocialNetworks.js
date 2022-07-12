import React, { useContext } from "react";
import { Linking, ToastAndroid, View } from "react-native";

import {
    Button,
    Cell,
    Divider,
    Icon,
    Placeholder,
    SvgIcon
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const SocialNetworks = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onClose, 
        navigate,
        networks = [],
        from = "my"
    } = props;

    const networksRender = (item, index) => {
        const network = {
            "vk": {
                name: "ВКонтакте",
                icon: {
                    name: "vk",
                    type: "Entypo",
                    color: "#0062ff"
                },
                domain: "https://vk.com/"
            },
            "telegram": {
                name: "Telegram",
                icon: {
                    name: "telegram",
                    type: "FontAwesome",
                    color: "#00a6ff"
                },
                domain: "https://t.me/"
            },
            "instagram": {
                name: "Instagram",
                icon: {
                    name: "instagram",
                    type: "AntDesign",
                    color: "#ff005d"
                },
                domain: "https://instagram.com/"
            },
            "tiktok": {
                name: "TikTok",
                icon: {
                    name: "tiktok",
                    type: "FontAwesome5Brands",
                    color: theme.text_color
                },
                domain: "https://tiktok.com/@"
            },
            "discord": {
                name: "Discord",
                icon: {
                    name: "discord-logo",
                    type: "my-icons",
                },
                domain: "discord"
            }
        }[item.network];

        const pressNetwork = (domain, username) => {
            const validUrl = Linking.canOpenURL(domain + username);
            if(!validUrl) {
                return ToastAndroid.show("Невозможно открыть эту социальную сеть", ToastAndroid.CENTER);
            }

            return Linking.openURL(domain + username);
        };
    
        return (
            <View
            key={`network-` + index}
            >
                <Cell
                title={network.name}
                subtitle={network.domain === "discord" ? item.username : (`@` + item.username)}
                before={
                    network.icon.type === "my-icons" ? (
                        <SvgIcon
                        name={network.icon.name}
                        size={20}
                        />
                    ) : (
                        <Icon
                        name={network.icon.name}
                        type={network.icon.type}
                        size={20}
                        color={network.icon.color}
                        />
                    )
                }
                after={
                    <Icon
                    name="arrow-up-right"
                    type="Feather"
                    color={theme.icon_color}
                    />
                }
                containerStyle={{
                    paddingVertical: 15
                }}
                onPress={() => pressNetwork(network.domain, item.username)}
                />

                {
                    index + 1 !== networks.length && (
                        <Divider/>   
                    )
                }
            </View>
        )
    };
    
    return (
        <View>
            {
                networks.length === 0 ? (
                    <Placeholder
                    title="Пусто"
                    subtitle={from === "my" ? "Вы ещё не указали ни одной социальной сети" : "Пользователь не указал ни одной социальной сети"}
                    icon={
                        <Icon
                        name="globe-outline"
                        type="Ionicons"
                        style={{
                            marginTop: 15
                        }}
                        size={25}
                        color={theme.icon_color}
                        />
                    }
                    containerStyle={{
                        marginVertical: 15
                    }}
                    />
                ) : networks.map(networksRender)
            }

            {
                from === "my" && (
                    <Button
                    onPress={() => {
                        navigate("edit_social_networks", { networks: networks });
                        onClose();
                    }}
                    title="Редактировать"
                    />
                )
            }
        </View>
    )
};