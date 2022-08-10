import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { View, ToastAndroid, Text, TouchableNativeFeedback, Animated, Vibration } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

import {
    Header, 
    Icon,
} from "../../components";

const keyboardKeys = [
    {
        key: 1,
        letters: ""
    },
    {
        key: 2,
        letters: "ABC"
    },
    {
        key: 3,
        letters: "DEF"
    },
    {
        key: 4,
        letters: "GHI"
    },
    {
        key: 5,
        letters: "JKL"
    },
    {
        key: 6,
        letters: "MNO"
    },
    {
        key: 7,
        letters: "PQRS"
    },
    {
        key: 8,
        letters: "TUV"
    },
    {
        key: 9,
        letters: "WXYZ"
    },
    {
        key: 0,
        letters: "+"
    },
    {
        key: "backspace",
        letters: ""
    },
];

Array.prototype.chunk = function (n) {
    if(!this.length) {
        return [];
    }

    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

export const AuthorizationRegistrationConfirmation = (props) => {
    const { theme: { theme } } = useSelector(state => state);
    const route = useRoute();

    const {
        navigation: {
            goBack,
            navigate
        }
    } = props;

    const [ loading, setLoading ] = useState(false);
    const [ cellsData, setCellsData ] = useState([
        {
            cell: 1,
            focused: true,
            value: null,
        },
        {
            cell: 2,
            focused: false,
            value: null,
        },
        {
            cell: 3,
            focused: false,
            value: null,
        },
        {
            cell: 4,
            focused: false,
            value: null,
        },
    ]);

    // const cellBorderWidth = useRef(new Animated.Value(1.5)).current;
    const cellTextScale = useRef(new Animated.Value(1)).current;
    const cellTextTranslateY = useRef(new Animated.Value(0)).current;

    const sendCode = async (cellsData) => {
        const code = cellsData.reduce((a, b) => a + String(b.value), "");
        
        axios.post("/users.registration", {
            email: route.params?.email,
            confirmation_code: code
        })
        .then(({ data }) => {
            // storage.setItem("AUTHORIZATION_SIGN", data.user.sign);
            ToastAndroid.show(data.message, ToastAndroid.CENTER);
        })
        .catch(({ response: { data } }) => {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
        });
    };

    const Cells = () => {
        const renderCell = (item) => {
            const changeFocus = (newFocusCellId) => {
                Vibration.vibrate(30);

                const newCellData = cellsData.map(item => {
                    if(item.cell === newFocusCellId) {
                        return {
                            ...item,
                            focused: true
                        }
                    }

                    return {
                        ...item,
                        focused: false
                    }
                });

                setCellsData(newCellData);
            };

            return (
                <View
                key={"cell-" + item.cell}
                style={{
                    width: 40,
                    height: 50,
                    borderRadius: 8,
                    marginHorizontal: 5,
                    borderWidth: 1.5,
                    borderColor: item.focused ? theme.accent : theme.divider_color,
                    overflow: "hidden"
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    onPress={() => changeFocus(item.cell)}
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
                                        scale: cellTextScale,
                                    },
                                    {
                                        translateY: cellTextTranslateY
                                    }
                                ]
                            }}
                            >
                                {
                                    item.value
                                }
                            </Animated.Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
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
                    cellsData.map(renderCell)
                }
            </View>
        )
    };

    const Keyboard = () => {
        const handleKeyPress = (key) => {
            Vibration.vibrate(30);

            const nowFocusedCell = cellsData.find(x => x.focused)?.cell;
            const changeFocusNewCell = cellsData.find(x => !x.focused && x.cell === (key === "backspace" ? nowFocusedCell - 1 : nowFocusedCell + 1))?.cell ?? 0;
            
            const newCellsData = cellsData.map(item => {
                if(item.focused) {
                    return {
                        ...item,
                        focused: key === "backspace" && nowFocusedCell === 1 ? true : false,
                        value: key === "backspace" ? null : key,
                    }
                }

                if(item.cell === changeFocusNewCell) {
                    return {
                        ...item,
                        focused: true
                    }
                }

                return item;
            });

            setCellsData(newCellsData);

            if(changeFocusNewCell === 0) {
                return sendCode(newCellsData);
            }
        };

        const renderKeys = (item) => {
            return (
                <View
                key={"key-"+ item.key}
                style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: theme.divider_color,
                    borderRadius: 9,
                    marginHorizontal: 3,
                    marginVertical: 3,
                    overflow: "hidden"
                }}
                >
                    <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(theme.cell.press_background, false)}
                    onPress={() => handleKeyPress(item.key)}
                    >
                        <View
                        style={{
                            width: "100%",
                            height: "100%",
                            flexDirection: "row",
                            justifyContent: item.key === "backspace" ? "center" : "flex-start",
                            alignItems: "center",
                            paddingHorizontal: 30
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
                                        fontSize: 16,
                                        opacity: .8,
                                        width: 55,
                                        flex: 1,
                                        textAlign: "right"
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
                </View>
            )
        };

        return (
            <View
            style={{
                marginHorizontal: 10,
                marginBottom: 10
            }}
            >
                {
                    keyboardKeys.chunk(3).map((chunk, chunkIndex) => (
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
                    ))
                }
            </View>
        )
    };
    
    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Подтверждение регистрации"
            backButton
            backButtonOnPress={() => goBack()}
            />

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

                <Cells />
            </View>

            <View>
                <Keyboard />
            </View>
        </View>
    )
};