import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { PieChart } from "react-native-svg-charts";

import {
    Icon
} from ".";

import ThemeContext from "../config/ThemeContext";

export const StatisticsList = (props) => {
    const theme = useContext(ThemeContext);

    const {
        stats,
        inList
    } = props;

    const lists = [
        {
            name: "Смотрю",
            icon: (
                <Icon
                name="eye"
                color={theme.text_secondary_color}
                size={12}
                />
            ),
        },
        {
            name: "Просмотрено",
            icon: (
                <Icon
                name="done-double"
                color={theme.text_secondary_color}
                size={12}
                />
            )
        },
        {
            name: "В планах",
            icon: (
                <Icon
                name="calendar"
                color={theme.text_secondary_color}
                size={10}
                />
            )
        },
        {
            name: "Отложено",
            icon: (
                <Icon
                name="pause-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        },
        {
            name: "Брошено",
            icon: (
                <Icon
                name="cancel-rounded"
                color={theme.text_secondary_color}
                size={11}
                />
            )
        }
    ];

    const statisticsChartValues = [
        stats?.watching || 0,
        stats?.completed || 0,
        stats?.planned || 0,
        stats?.postponed || 0,
        stats?.dropped || 0,
    ];
    const statisticsChartColors = [
        theme.anime.watching, 
        theme.anime.completed,
        theme.anime.planned, 
        theme.anime.postponed, 
        theme.anime.dropped
    ];
    
    const statisticsChartData = statisticsChartValues.map((value, index) => ({
        value,
        svg: {
            fill: statisticsChartColors[index],
        },
        key: `pie-${index}`,
    }));

    const renderList = (item, index) => {
        return (
            <View
            key={"list-" + item.name}
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: index !== 0 ? 5 : 0
            }}
            >
                <View
                style={{
                    paddingVertical: 3,
                    paddingLeft: 4,
                    paddingRight: 6,
                    borderRadius: 100,
                    borderWidth: 0.5,
                    borderColor: statisticsChartColors[index] + "90",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 17,
                    width: 38
                }}
                >
                    <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: statisticsChartColors[index],
                        marginRight: 5
                    }}
                    />

                    {
                        item.icon
                    }
                </View>

                <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                >
                    <Text
                    style={{
                        marginLeft: 10,
                        fontSize: 15,
                        fontWeight: "500",
                        color: theme.text_secondary_color + "90"
                    }}
                    >
                        {
                            item.name
                        }
                    </Text>

                    <Text
                    style={{
                        marginLeft: 6,
                        fontWeight: "700",
                        color: theme.text_secondary_color,
                        fontSize: 15.5
                    }}
                    > 
                        {
                            statisticsChartValues[index]
                        }
                    </Text>
                </View>
            </View>
        )
    };

    return (
        <View
        style={{
            marginHorizontal: 15,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
        }}
        >
            <View>
                {
                    lists.map(renderList)
                }
            </View>

            {
                statisticsChartValues.reduce((a, b) => a + b) === 0 ? (
                    <Icon
                    name="pie-chart"
                    color={theme.divider_color}
                    size={109}
                    />
                ) : (
                    <View
                    style={{
                        width: 120,
                        height: 120
                    }}
                    >
                        <PieChart 
                        data={statisticsChartData}
                        innerRadius={32}
                        animate={true}
                        style={{ height: 119, width: 119 }}
                        />

                        <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: theme.anime[inList],
                                width: "100%",
                                height: "100%",
                                borderRadius: 100,
                                transform: [{
                                    scale: 0.2
                                }]
                            }
                        ]}
                        />
                    </View>
                )
            }
        </View>
    )
};