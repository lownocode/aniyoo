import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, Modal, TouchableWithoutFeedback, Text } from "react-native";
import { Icon } from ".";

export const Popper = (props) => {
    const { 
        style, 
        children,
        content,
        width = 220,
        position = "right-top",
        right,
        visible = false,
        onClose = () => console.log("no attached on close event")
    } = props;

    const cords = {
        top: position === "right-top" || position === "left-top" ? 0 : null,
        right: position === "right-top" ? right ? right : 0 : null,
        left: position === "left-top" ? 0 : null
    };

    const localStyles = StyleSheet.create({
        container: {
            backgroundColor: "#1f1f1f",
            borderRadius: 10,
            position: "absolute",
            width: width,
            maxHeight: Dimensions.get("window").height / 1.5,
            zIndex: 1000,
            right: cords.right,
            top: cords.top,
            left: cords.left,
            borderColor: "#363636",
            borderWidth: 0.5,
            overflow: "hidden",
            paddingBottom: 35,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: position === "right-top" ? 3 : 10,
            borderTopLeftRadius: position === "left-top" ? 3 : 10
        },
        closeButtonContainer: {
            backgroundColor: "#1f1f1f",
            borderColor: "#363636",
            borderTopWidth: 0.5,
            position: "absolute",
            width: width ? width : 220,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            bottom: -35,
            borderBottomLeftRadius: 100,
            borderBottomRightRadius: 100,
        },
        closeButton: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    return (
        <View>
            {children}

            {
                visible && content && (
                    <View style={{zIndex: 1000}}>
                        <View
                        style={localStyles.container}
                        >
                            <View>
                                <ScrollView
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                >
                                    {content}
                                </ScrollView>

                                <TouchableWithoutFeedback onPress={() => onClose()}>
                            <View style={localStyles.closeButtonContainer}>
                                <View
                                style={localStyles.closeButton}
                                >
                                    <Icon type="AntDesign" name="closecircleo" color={style.text_secondary_color}/>
                                    <Text style={{color: style.text_secondary_color, marginLeft: 5}}>
                                        Закрыть
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                            </View>
                        </View>

                        {/* <TouchableWithoutFeedback onPress={() => onClose()}>
                            <View style={localStyles.closeButtonContainer}>
                                <View
                                style={localStyles.closeButton}
                                >
                                    <Icon type="AntDesign" name="closecircleo" color={style.text_secondary_color}/>
                                    <Text style={{color: style.text_secondary_color, marginLeft: 5}}>
                                        Закрыть
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback> */}
                    </View>
                )
            }
        </View>
    )
};