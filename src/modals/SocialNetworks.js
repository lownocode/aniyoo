import React from "react";
import { Linking, ToastAndroid, View } from "react-native";
import { useSelector } from "react-redux";

import {
    Button,
    Cell,
    Divider,
    Placeholder,
    Icon
} from "../components";

export const SocialNetworks = (props) => {
    const { theme } = useSelector(state => state.theme);

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
                    color: "#0062ff"
                },
                domain: "https://vk.com/"
            },
            "telegram": {
                name: "Telegram",
                icon: {
                    name: "telegram",
                    color: "#00a6ff"
                },
                domain: "https://t.me/"
            },
            "instagram": {
                name: "Instagram",
                icon: {
                    name: "instagram",
                    color: "#ff005d"
                },
                domain: "https://instagram.com/"
            },
            "tiktok": {
                name: "TikTok",
                icon: {
                    name: "tiktok",
                    color: theme.text_color
                },
                domain: "https://tiktok.com/@"
            },
            "discord": {
                name: "Discord",
                icon: {
                    name: "discord",
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
                    <Icon
                    name={network.icon.name}
                    size={20}
                    color={network.icon.color}
                    />
                }
                after={
                    <Icon
                    name="external-link"
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
                        name="globe-online"
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