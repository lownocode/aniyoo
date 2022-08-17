import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
    View, 
    Text, 
    TouchableNativeFeedback, 
    Animated, 
    Vibration, 
    ToastAndroid,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { EventRegister } from "react-native-event-listeners";

import {
    Panel, 
    Icon,
} from "../../components";
import { setUser } from "../../redux/reducers";
import { storage } from "../../functions";

const keyboardKeys = [
    {
        key: 1,
        letters: "%",
    },
    {
        key: 2,
        letters: "ABC",

    },
    {
        key: 3,
        letters: "DEF",
    },
    {
        key: 4,
        letters: "GHI",
    },
    {
        key: 5,
        letters: "JKL",
    },
    {
        key: 6,
        letters: "MNO",
    },
    {
        key: 7,
        letters: "PQRS",
    },
    {
        key: 8,
        letters: "TUV",
    },
    {
        key: 9,
        letters: "WXYZ",
    },
    {
        key: 0,
        letters: "+",
    },
    {
        key: "backspace",
        letters: "",
    },
];

Array.prototype.chunk = function (n) {
    if(!this.length) {
        return [];
    }

    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

const REMAINING_TIME_TO_RESENT_CODE = 5;

export const AuthorizationRegistrationConfirmation = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    const route = useRoute();

    const [ loading, setLoading ] = useState(false);
    const [ remainingTime, setRemainingTime ] = useState(REMAINING_TIME_TO_RESENT_CODE);
    const [ cellValues, setCellValues ] = useState({ 1: null, 2:  null, 3: null, 4: null });

    const resendCodeTextScale = useRef(new Animated.Value(0.7)).current;
    const focusedCell = useRef(new Animated.Value(1)).current;
    const loadingOpacity = useRef(new Animated.Value(1)).current;
    const cellsContainerTranslationX = useRef(new Animated.Value(0)).current;

    const cells = [
        {
            id: 1,
            textScale: useRef(new Animated.Value(1)).current,
            textTranslateX: useRef(new Animated.Value(0)).current,
        },
        {
            id: 2,
            textScale: useRef(new Animated.Value(1)).current,
            textTranslateX: useRef(new Animated.Value(0)).current,
        },
        {
            id: 3,
            textScale: useRef(new Animated.Value(1)).current,
            textTranslateX: useRef(new Animated.Value(0)).current,
        },
        {
            id: 4,
            textScale: useRef(new Animated.Value(1)).current,
            textTranslateX: useRef(new Animated.Value(0)).current,
        },
    ];

    const scaleAnimation = (element, scale) => {
        Animated.timing(element, {
            toValue: scale,
            duration: 100,
            useNativeDriver: false
        }).start();
    };

    const keyboardHandler = (key) => {
        const cell = cells.find(x => x.id === focusedCell.__getValue());

        if(key === "backspace") {
            focusedCell.setValue(cell.id - 1 === 0 ? 1 : cell.id - 1);

            return Animated.sequence([
                Animated.timing(cell.textTranslateX, {
                    toValue: -100,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(cell.textTranslateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                })
            ]).start(() => {
                setCellValues({
                    ...cellValues,
                    [cell.id]: null
                });
            });
        }

        focusedCell.setValue(cell.id + 1 === 5 ? 4 : cell.id + 1);

        setCellValues({
            ...cellValues,
            [cell.id]: key
        });

        Animated.sequence([
            Animated.timing(cell.textScale, {
                toValue: 0,
                duration: 1,
                useNativeDriver: false,
            }),
            Animated.timing(cell.textScale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();

        if(cell.id === 4) {
            sendCode({
                ...cellValues,
                4: key
            });
        }
    };

    const changeCellFocus = (cellId) => {
        Vibration.vibrate(30);

        setCellValues({
            ...cellValues,
            [cellId]: null,
        });

        focusedCell.setValue(cellId);
    };

    const sendCode = async (cellValues) => {
        const codeValid = Object.values(cellValues).findIndex(x => x === null) < 0;

        if(!codeValid) return;

        setLoading(true);
        const code = Object.values(cellValues).join("");
        
        axios.post("/users.registration", {
            email: route.params?.email,
            confirmation_code: code
        })
        .then(({ data }) => {
            dispatch(setUser(data.user));
            storage.setItem("AUTHORIZATION_SIGN", data.user.sign);
            EventRegister.emit("app", {
                type: "changeAuthorized",
                value: true,
            });
        })
        .catch(({ response: { data } }) => {
            Vibration.vibrate(60);
            ToastAndroid.show(data.message, ToastAndroid.LONG);
            Animated.sequence([
                Animated.timing(cellsContainerTranslationX, {
                    toValue: -15,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(cellsContainerTranslationX, {
                    toValue: 15,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(cellsContainerTranslationX, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        })
        .finally(() => setLoading(false));
    };

    const resendCode = async () => {
        setRemainingTime(REMAINING_TIME_TO_RESENT_CODE);

        axios.post("/settings.resendMail", {
            email: route.params?.email
        })
        .then(({ data }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        });

        let counter = 0;
        const intervalId = setInterval(() => {
            counter += 1;
            setRemainingTime(prev => prev - 1);

            if (counter >= REMAINING_TIME_TO_RESENT_CODE) {
                clearInterval(intervalId);
                Animated.timing(resendCodeTextScale, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }).start();

                Vibration.vibrate(35);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    };

    useEffect(() => {
        if(loading) {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(loadingOpacity, {
                        toValue: 0.5,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(loadingOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        }

        Animated.timing(loadingOpacity).stop();
    }, [loading]);

    const Cells = () => {
        const renderCell = (item) => {
            const borderColor = focusedCell.interpolate({
                inputRange: [
                    Number(item.id) - 1,
                    Number(item.id),
                    Number(item.id) + 1
                ],
                outputRange: [
                    theme.divider_color,
                    theme.accent,
                    theme.divider_color
                ],
                extrapolate: "clamp",
            });
            
            return (
                <Animated.View
                key={"cellId-" + item.id}
                style={[{
                    width: 40,
                    height: 50,
                    borderRadius: 8,
                    marginHorizontal: 5,
                    borderWidth: 1.5,
                    borderColor: loading ? theme.accent : borderColor,
                    overflow: "hidden",
                    opacity: loadingOpacity
                }]}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    onPress={() => changeCellFocus(item.id)}
                    disabled={loading}
                    >
                        <View
                        style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                            <Animated.Text
                            style={{
                                color: theme.text_color,
                                fontSize: 19,
                                transform: [
                                    {
                                        scale: item.textScale,
                                    },
                                    {
                                        translateX: item.textTranslateX
                                    }
                                ]
                            }}
                            >
                                {
                                    cellValues[item.id]
                                }
                            </Animated.Text>
                        </View>
                    </TouchableNativeFeedback>
                </Animated.View>
            )
        };

        return (
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 45
            }}
            >
                {
                    cells.map(renderCell)
                }
            </View>
        )
    };

    const Keyboard = () => {
        const renderKeys = (item) => {
            return (
                <Animated.View
                key={"key-"+ item.key}
                style={{
                    flex: 1,
                    backgroundColor: theme.divider_color,
                    borderRadius: 9,
                    marginHorizontal: 3,
                    marginVertical: 3,
                    overflow: "hidden",
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    onPress={() => keyboardHandler(item.key)}
                    disabled={loading}
                    >
                        <View
                        style={{
                            width: "100%",
                            minHeight: 50,
                            flexDirection: "column",
                            justifyContent: item.key === "backspace" ? "center" : "flex-start",
                            alignItems: "center",
                        }}
                        >
                            {
                                item.key === "backspace" ? (
                                    <Icon
                                    name="backspace-outline"
                                    size={25}
                                    color={theme.text_color}
                                    />
                                ) : (
                                    <Text
                                    style={{
                                        color: theme.text_color,
                                        fontWeight: "600",
                                        fontSize: 25,
                                    }}
                                    >
                                        {
                                            item.key
                                        }
                                    </Text>
                                )
                            }

                            {
                                item.letters ? (
                                    <Text
                                    numberOfLines={1}
                                    style={{
                                        color: theme.text_secondary_color,
                                        fontSize: 10,
                                        opacity: .8,
                                        textAlign: "center"
                                    }}
                                    >
                                        {
                                            item.letters
                                        }
                                    </Text>
                                ) : null
                            }
                        </View>
                    </TouchableNativeFeedback>
                </Animated.View>
            )
        };

        const keyboardKeysRender = useMemo(() => keyboardKeys.chunk(3).map((chunk, chunkIndex) => (
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
            }}
            key={chunkIndex}
            >
                {chunk.map(renderKeys)}
            </View>
        )));

        return (
            <View
            style={{
                marginHorizontal: 10,
                marginBottom: 10
            }}
            >
                {
                    keyboardKeysRender
                }
            </View>
        )
    };

    useEffect(() => {
        let counter = 0;
        const intervalId = setInterval(() => {
            counter += 1;
            setRemainingTime(prev => prev - 1);

            if (counter >= REMAINING_TIME_TO_RESENT_CODE) {
                clearInterval(intervalId);
                Animated.timing(resendCodeTextScale, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }).start();

                Vibration.vibrate(35);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <Panel
        headerProps={{
            title: "Подтверждение регистрации",
            backOnPress: () => goBack()
        }}
        >
            <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
            }}
            >
                <Icon
                name="authentication-lock"
                size={105}
                />

                <Text
                style={{
                    color: theme.text_color,
                    fontSize: 25,
                    fontWeight: "500",
                    marginHorizontal: 15,
                    textAlign: "center"
                }}
                >
                    Введите код
                </Text>
                <Text
                style={{
                    textAlign: "center",
                    color: theme.text_secondary_color,
                    marginHorizontal: 15
                }}
                >
                    На указанный электронный адрес <Text style={{ color: theme.accent, fontWeight: "500" }}>{route.params?.email}</Text> был отправлен код подтверждения, пожалуйста, введите его ниже для завершения регистрации. Если в основной почте нет письма, проверьте папку «Спам»
                </Text>

                <Animated.View
                style={{
                    transform: [
                        {
                            translateX: cellsContainerTranslationX
                        }
                    ]
                }}
                >
                    <Cells />
                </Animated.View>
            </View>

            <View>
                <Animated.Text
                onPressIn={() => remainingTime <= 0 && scaleAnimation(resendCodeTextScale, .9)}
                onPressOut={() => remainingTime <= 0 && scaleAnimation(resendCodeTextScale, 1)}
                onPress={() => remainingTime <= 0 && resendCode()}
                style={{
                    textAlign: "center",
                    color: remainingTime >=  1 ? theme.text_secondary_color : theme.accent,
                    marginBottom: 15,
                    fontSize: 15,
                    textTransform: "uppercase",
                    transform: [
                        {
                            scale: resendCodeTextScale
                        }
                    ]
                }}
                >
                    {
                        remainingTime >=  1 ? `отправить код снова через ${remainingTime} сек.` : "Отправить код снова"
                    }
                </Animated.Text>

                <Keyboard />
            </View>
        </Panel>
    )
};