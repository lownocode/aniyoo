import React, { useContext } from "react";
import { Linking, ToastAndroid, View } from "react-native";

import {
    Button,
    Cell,
    Divider,
    Icon,
    Placeholder
} from "../components";

import ThemeContext from "../config/ThemeContext";

// const socialNetworksButtonsRender = (item) => {
//     let icon;
//     let textColor;
//     let title;
//     let pressLink;

//     if(item.network === "telegram") {
//         icon = {type: "EvilIcons", name: "sc-telegram", size: 25};
//         title = "Telegram";
//         textColor = "#00a6ff";
//         pressLink = "https://t.me/" + item.link;
//     }
//     if(item.network === "instagram") {
//         icon = {type: "AntDesign", name: "instagram", size: 20};
//         title = "Instagram";
//         textColor = "#ff005d";
//         pressLink = "https://instagram.com/" + item.link;
//     }
//     if(item.network === "vk") {
//         icon = {type: "Entypo", name: "vk", size: 20};
//         title = "ВКонтакте";
//         textColor = "#0062ff";
//         pressLink = "https://vk.com/" + item.link;
//     }

//     return (
//         <Button
//         key={item.network}
//         title={title}
//         onPress={() => Linking.openURL(pressLink)}
//         before={
//             <Icon
//             {...icon}
//             color={textColor}
//             />
//         }
//         upperTitle={false}
//         textColor={textColor}
//         backgroundColor={textColor + "10"}
//         containerStyle={{
//             marginHorizontal: 5,
//             marginBottom: 0
//         }}
//         />
//     )
// };

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
            }
        }[item.network];

        const pressNetwork = async (link) => {
            const validUrl = await Linking.canOpenURL(link);
            
            if(!validUrl) {
                return ToastAndroid.show("Невозможно открыть эту социальную сеть", ToastAndroid.CENTER);
            }
        };
    
        return (
            <View
            key={`network-` + index}
            >
                <Cell
                title={network.name}
                subtitle={`@` + item.link.replace(network.domain, "")}
                before={
                    <Icon
                    name={network.icon.name}
                    type={network.icon.type}
                    size={20}
                    color={network.icon.color}
                    />
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
                onPress={() => pressNetwork(item.link)}
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