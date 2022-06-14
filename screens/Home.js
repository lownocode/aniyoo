import React, { useContext } from "react";
import { View, ScrollView, Text, Image } from "react-native";

import {
    Divider,
    Header,
    Button,
    Icon,
    DiscussedTodayAnimeList,
    Cell,
    HorizontalAnimeList,
    Avatar,
    Rating,
    AssemblyOfWeekCarousel
} from "../components";
import { dateFormatter } from "../functions";

import ThemeContext from "../config/ThemeContext";

export const Home = props => {
    const theme = useContext(ThemeContext);
    
    const discussed_today_list = [
        {
            poster: "https://anirise.org/uploads/posts/2022-01/1641662251_jeta-farforovaja-kukla-vljubilas.jpg",
            title: "Эта фарфоровая кукла влюбилась",
            episodes: {
                total: 12,
                count: 12
            },
            grade: "4.6",
            comments_per_day: 1079
        },
        {
            poster: "https://media.kg-portal.ru/anime/t/tanteiwamshindeiru/production/tanteiwamshindeiru_5.jpg",
            title: "Детектив уже мертв",
            episodes: {
                total: 12,
                count: 12
            },
            grade: "4",
            comments_per_day: 700
        },
        {
            poster: "https://yummyanime.tv/uploads/posts/2022-02/poster-akaneiro-ni-somaru-saka.jpeg",
            title: "Холм в багряных сумерках",
            episodes: {
                total: 12,
                count: 11
            },
            grade: "3.5",
            comments_per_day: 321
        },
        {
            poster: "https://content1.rozetka.com.ua/goods/images/big/4689978.jpg",
            title: "Наруто",
            episodes: {
                total: 220,
                count: 220
            },
            grade: "5",
            comments_per_day: 100
        },
        {
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/ab5a4ec8-3eb7-4e12-a4dd-4ae8f7d7747b/1920x",
            title: "Сатана на подработке",
            episodes: {
                total: 12,
                count: 12
            },
            grade: "2.3",
            comments_per_day: 4
        },
    ];

    const comments = [
        {
            text: "Очень понравился данный тайтл! Хорошо раскрыты главные герои, очень приятно за ними наблюдать.",
            date: 1648420481180,
            anime: {
                poster: "https://anirise.org/uploads/posts/2022-01/1641662251_jeta-farforovaja-kukla-vljubilas.jpg",
                title: "Эта фарфоровая кукла влюбилась",
                grade: "4.7",
                episodes: {
                    total: 12,
                    count: 12
                },
            },
            user: {
                nickname: "Александр Локалхостов",
                photo: "https://gif-avatars.com/img/200x200/christmas-cat.gif"
            },
            likes: 453
        }
    ];

    const assemblyItems = [
        {
            cover: "https://socialsfrag.com/wp-content/uploads/2022/02/Chainsaw-Man-anime-adaptation.jpg",
            title: "Токийский гуль, полностью",
            description: "Здесь собраны все релизы, упоминающие токийского гуля. Бла бла бла бла бла бла бла бла бла бла бла",
            likes: 320,
            bookmarks: 230,
            comments: 200
        },
        {
            cover: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/146455d0-478c-4a2f-b787-d41edc3183b6/d845yut-6cf5afdf-5371-4bae-9577-de4f6b25f293.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE0NjQ1NWQwLTQ3OGMtNGEyZi1iNzg3LWQ0MWVkYzMxODNiNlwvZDg0NXl1dC02Y2Y1YWZkZi01MzcxLTRiYWUtOTU3Ny1kZTRmNmIyNWYyOTMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.YQf61BrkNF3Lxer1X5nDKb88_LRZKPhfc_bF84-DM3U",
            title: "Токийский гуль, полностью",
            description: "Здесь собраны все релизы, упоминающие токийского гуля. Бла бла бла бла бла бла бла бла бла бла бла",
            likes: 320,
            bookmarks: 20,
            comments: 100
        },
        {
            cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyK5IJCG8SxQiTk1uaEz7AJ1IGQGIga0tFhg&usqp=CAU",
            title: "Токийский гуль, полностью",
            description: "Здесь собраны все релизы, упоминающие токийского гуля. Бла бла бла бла бла бла бла бла бла бла бла",
            likes: 320,
            bookmarks: 2,
            comments: 20
        }
    ];

    const renderSchedule = () => (
        <View>
            <Cell
            title="Ожидается сегодня"
            subtitle="Расписание выхода серий"
            after={
                <Icon
                name="chevron-small-right"
                type="Entypo"
                color={theme.icon_color}
                size={25}
                />
            }
            />

            <HorizontalAnimeList
            animes={discussed_today_list}
            />

            <Divider dividerStyle={{marginVertical: 10}} indents/>
        </View>
    );

    const renderDiscussedToday = () => (
        <View>
            <Cell
            title="Обсуждаемое сегодня"
            subtitle="Нажмите, чтобы открыть все"
            after={
                <Icon
                name="chevron-small-right"
                type="Entypo"
                color={theme.icon_color}
                size={25}
                />
            }
            />

            <DiscussedTodayAnimeList
            animes={discussed_today_list}
            />

            <Divider dividerStyle={{marginVertical: 10}} indents/>
        </View>
    );

    const renderAssemblyOfWeek = () => (
        <View>
            <Cell
            title="Сборки недели"
            subtitle="Самые популярные сборки за неделю"
            after={
                <Icon
                name="chevron-small-right"
                type="Entypo"
                color={theme.icon_color}
                size={25}
                />
            }
            />

            <AssemblyOfWeekCarousel
            items={assemblyItems}
            />

            <Divider dividerStyle={{marginVertical: 10}} indents/>
        </View>
    );

    const renderCommentsOfWeek = () => (
        <View>
            <Cell
            title="Комментарии недели"
            subtitle="Самые популярные комментарии за неделю"
            after={
                <Icon
                name="chevron-small-right"
                type="Entypo"
                color={theme.icon_color}
                size={25}
                />
            }
            />

            <View style={{margin: 15}}>
                {
                    comments.map((item, index) => {
                        return (
                            <View
                            key={"comment_" + index}
                            style={{
                                borderColor: theme.divider_color,
                                borderWidth: 0.5,
                                borderRadius: 10,
                                overflow: "hidden"
                            }}
                            >
                                <Cell
                                centered={false}
                                containerStyle={{
                                    marginTop: 0,
                                }}
                                title={item?.user?.nickname}
                                contentStyle={{
                                    marginVertical: 10
                                }}
                                beforeStyle={{
                                    marginTop: 10,
                                }}
                                maxTitleLines={1}
                                maxSubtitleLines={6}
                                subtitle={item?.text}
                                before={
                                    <Avatar
                                    overlayColor={theme.background_content}
                                    url={item?.user?.photo}
                                    />
                                }
                                additionalContentBottom={
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            justifyContent: "space-between",
                                            marginHorizontal: 15
                                        }}
                                        >
                                            <View
                                            style={{
                                                backgroundColor: "#00853990",
                                                paddingHorizontal: 5,
                                                borderRadius: 5,
                                                borderColor: "#008539",
                                                borderWidth: 0.6,
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                paddingVertical: 1
                                            }}
                                            >
                                                <Icon
                                                name="like2"
                                                type="AntDesign"
                                                color="#fff"
                                                style={{
                                                    marginRight: 3
                                                }}
                                                size={10}
                                                />

                                                <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: "#fff",
                                                    fontSize: 9
                                                }}
                                                >
                                                    {item?.likes}
                                                </Text>
                                            </View>

                                            <Text
                                            style={{
                                                color: theme.text_secondary_color,
                                                fontSize: 10,
                                            }}
                                            >
                                                {dateFormatter(item?.date)}
                                            </Text>
                                        </View>
                                }
                                />

                                <Divider />

                                <Cell
                                beforeStyle={{
                                    marginVertical: 10
                                }}
                                maxTitleLines={1}
                                containerStyle={{
                                    marginTop: 0
                                }}
                                contentStyle={{
                                    marginVertical: 5
                                }}
                                tite
                                title={item?.anime?.title}
                                before={
                                    <Image
                                    resizeMethod="resize"
                                    source={{
                                        uri: item?.anime?.poster
                                    }}
                                    style={{
                                        width: 40,
                                        height: 60,
                                        resizeMode: "cover",
                                        borderRadius: 4
                                    }}
                                    />
                                }
                                subtitle={
                                    <View>
                                        {
                                            Number(item?.anime?.grade) > 0 && (
                                                <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                                >
                                                    <Rating
                                                    length={5}
                                                    select={String(item?.anime?.grade).split(".")[0]}
                                                    iconSelect={<Icon type="AntDesign" name="star" color="gold"/>}
                                                    iconUnselect={<Icon type="AntDesign" name="staro" color="gray"/>}
                                                    />

                                                    <Text
                                                    style={{
                                                        color: theme.text_secondary_color,
                                                        fontSize: 10,
                                                        marginLeft: 3
                                                    }}
                                                    >
                                                        {item?.anime?.grade}
                                                    </Text>
                                                </View>
                                            )
                                        }

                                        <View 
                                        style={{
                                            marginTop: 5,
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}>
                                            <Text
                                            style={{
                                                color: theme.text_color,
                                                fontSize: 10,
                                                borderColor: theme.divider_color,
                                                borderWidth: 1,
                                                paddingHorizontal: 5,
                                                paddingVertical: 1,
                                                borderRadius: 4,
                                            }}
                                            >
                                                {
                                                    item?.anime?.episodes?.total === item?.anime?.episodes.count ? (
                                                        <Text>
                                                            <Text style={{fontWeight: "700"}}>{item?.anime?.episodes?.total || "?"}</Text> серий
                                                        </Text> 
                                                    ) : (
                                                        <Text>
                                                            <Text style={{fontWeight: "700"}}>{item?.anime?.episodes?.count || "?"}</Text> из <Text style={{fontWeight: "700"}}>{item?.episodes?.total || "?"}</Text> серий
                                                        </Text>
                                                    )
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                }
                                />
                            </View>
                        )
                    })
                }
            </View>
        </View>
    );

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Главная"
            height={30}
            />

            <ScrollView 
            showsVerticalScrollIndicator={false}
            >
                {renderSchedule()}
                {renderDiscussedToday()}
                {renderAssemblyOfWeek()}
                {renderCommentsOfWeek()}
            </ScrollView>
        </View>
    )
};