import React, { useContext } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

import ThemeContext from "../config/ThemeContext";

export const Input = props => {
    const theme = useContext(ThemeContext);
    
    const {
        placeholder,
        containerStyle,
        before,
        after,
        onChangeText,
        value,
        height = 45,
        inputStyle,
        onChange,
        secureTextEntry,
        maxLength,
        multiline,
        textAlignVertical,
        badText,
        textAlign,
        type = "default"
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            justifyContent: "center",
            ...containerStyle,
        },
        input: {
            backgroundColor: theme.input.background,
            borderRadius: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: theme.input.border,
            paddingLeft: before ? 35 : 10,
            paddingRight: after ? 35 : 10,
            color: theme.text_color,
            zIndex: 0,
            height: height,
            justifyContent: "center",
            alignItems: "center",
            ...inputStyle,
        },
        before: {
            position: "absolute",
            marginLeft: 10,
            zIndex: 1
        },
        after: {
            position: "absolute",
            marginRight: 10,
            right: 0
        },
        bad_text: {
            color: "#ff4b3b",
            marginLeft: 2,
            fontSize: 12
        }
    });

    return (
        <View style={{marginBottom: badText ? 10 : -10}}>
            <View style={localStyles.container}>
                <View style={localStyles.before}>
                    {before}
                </View>
                <TextInput
                keyboardType={type}
                style={localStyles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.input.placeholder}
                onChangeText={onChangeText}
                value={value}
                onChange={onChange}
                secureTextEntry={secureTextEntry}
                maxLength={maxLength}
                multiline={multiline}
                textAlignVertical={textAlignVertical}
                textAlign={textAlign}
                />
                <View style={localStyles.after}>
                    {after}
                </View>
            </View>
            <Text style={localStyles.bad_text}>{badText}</Text>
        </View>
    )
};