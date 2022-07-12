import React, { useContext } from "react";
import { TouchableNativeFeedback, View, Text } from "react-native";

import {
    Button,
    Cell,
    Icon
} from "../components";

import ThemeContext from "../config/ThemeContext";

export const ChangeVideoQuality = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        onClose, 
        selectedQuality,
        qualityList = {},
        changeQuality
    } = props;

    const validateQuality = () => {
        const resultKeys = Object.keys(qualityList).map(key => {
            if(!qualityList[key]) {
                return;
            }

            return key;
        });

        return resultKeys;
    };

    const CustomCard = (props) => {
        const {
            title, 
            subtitle,
            quality,
        } = props;

        return (
            <View
            style={{
                borderWidth: quality === Number(selectedQuality) ? 0 : 2,
                borderColor: quality === Number(selectedQuality) ? theme.anime.watching : theme.divider_color,
                flex: 1,
                margin: 8,
                borderRadius: 10,
                overflow: "hidden",
                borderStyle: quality === Number(selectedQuality) ? "solid" : "dashed",
                backgroundColor: quality === Number(selectedQuality) ? theme.anime.watching : "transparent",
                opacity: validateQuality().findIndex(x => Number(x) === quality) === -1 ? 0.3 : 1
            }}
            >
                <TouchableNativeFeedback
                onPress={() => {
                    changeQuality(String(quality));
                    onClose();
                }}
                background={TouchableNativeFeedback.Ripple(theme.divider_color, false)}
                disabled={validateQuality().findIndex(x => Number(x) === quality) === -1}
                >
                    <View
                    style={{
                        padding: 5
                    }}
                    >
                        <Text
                        style={{
                            textAlign: "center",
                            color: theme.text_color,
                            fontWeight: "500",
                            fontSize: 16
                        }}
                        >
                            {title}
                        </Text>

                        <Text
                        style={{
                            textAlign: "center",
                            color: theme.text_color,
                            fontWeight: "300",
                        }}
                        >
                            {subtitle}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    };
    
    return (
        <View>
            <Cell
            title="Качество видео"
            subtitle="Выберите желаемое качество"
            disabled
            before={
                <Icon
                type="MaterialCommunityIcons"
                name="quality-high"
                size={20}
                color="#fff"
                />
            }
            />

            <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <CustomCard 
                title="360P"
                subtitle="Плохое"
                quality={360}
                />

                <CustomCard 
                title="480P"
                subtitle="Среднее"
                quality={480}
                />
            </View>

            <View style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10 }}>
                <CustomCard 
                title="720P"
                subtitle="Хорошее"
                quality={720}
                />

                <CustomCard 
                title="1080P"
                quality={1080}
                subtitle="Отличное"
                />
            </View>
        </View>
    )
};