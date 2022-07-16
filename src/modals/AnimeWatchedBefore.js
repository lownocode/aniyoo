import React, { useContext } from "react";
import { View } from "react-native";

import {
    Icon,
    Cell,
    Divider
} from "../components";
import ThemeContext from "../config/ThemeContext";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const AnimeWatchedBefore = (props) => {
    const theme = useContext(ThemeContext);

    const { 
        data,
        animeContinue,
        startOver
    } = props;
    
    return (
        <View>
            <Cell
            title="Вы смотрели эту серию ранее"
            subtitle="Хотите продолжить с остановленного времени или начать сначала?"
            disabled
            centered={false}
            before={
                <Icon
                color={theme.accent}
                name="clock"
                size={25}
                />
            }
            />

            <Divider />

            <Cell
            title={`Продолжить с ${
                data.viewed_up_to > 3600 ?
                dayjs.duration(data.viewed_up_to * 1000).format('HH:mm:ss') :
                dayjs.duration(data.viewed_up_to * 1000).format('mm:ss')
            }`}
            onPress={() => animeContinue(data.viewed_up_to)}
            before={
                <Icon
                color={theme.icon_color}
                name="play"
                size={13}
                />
            }
            containerStyle={{
                paddingVertical: 15
            }}
            />

            <Divider />

            <Cell
            title={`Начать сначала`}
            onPress={() => startOver()}
            before={
                <Icon
                color={theme.icon_color}
                name="replay"
                size={17}
                />
            }
            containerStyle={{
                paddingVertical: 15
            }}
            />
        </View>
    )
};