import React from "react";
import { Image, StyleSheet, View, Dimensions, Text } from "react-native";
import LinearGradient from 'react-native-linear-gradient'

export const ImagePreview = (props) => {
    const { 
        imageUrl,
        containerStyle, 
        imageStyle,
        footer = true
    } = props;

    const height = 362 * Dimensions.get("window").width / 541

    const localStyles = StyleSheet.create({
        container: {
            height: height,
            padding: 10,
            ...containerStyle
        },
        image: {
            height: "100%",
            borderRadius: 8,
            zIndex: -1,
            ...imageStyle,
        },
        gradient: {
            flex: 1,
            borderRadius: 10
        },
        text: {
            color: "#fff",
            textAlign: "center",
            marginTop: "-10%",
            fontWeight: "600",
            fontSize: 15
        }
    });

    return (
        <View style={localStyles.container}>
            {
                footer ? (
                    <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .7)' ]}
                    style={localStyles.gradient}
                    >
                        <Image
                        style={localStyles.image}
                        source={{
                            uri: imageUrl
                        }}
                        />

                        <Text style={localStyles.text}>
                            Открыть изображение...
                        </Text>
                    </LinearGradient>
                ) : (
                    <Image
                    style={localStyles.image}
                    source={{
                        uri: imageUrl
                    }}
                    />
                )
            }
            
        </View>
    )
};