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
        height = 50,
        inputStyle,
        onChange,
        secureTextEntry,
        maxLength,
        multiline,
        textAlignVertical,
        badText,
        textAlign,
        type = "default",
        onSubmitEditing,
        returnKeyType = "done",
    } = props;

    const localStyles = StyleSheet.create({
        container: {
            justifyContent: "center",
            borderRadius: 17,
            ...containerStyle,
        },
        input: {
            backgroundColor: theme.input.background,
            borderRadius: 17,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.input.border,
            paddingLeft: before ? 35 : 10,
            paddingRight: after ? 45 : 10,
            color: theme.text_color,
            zIndex: 0,
            height: height,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
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
        <View style={{ overflow: "hidden", borderRadius: 10}}>
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
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                />
                <View style={localStyles.after}>
                    {after}
                </View>
            </View>
            <Text style={localStyles.bad_text}>{badText}</Text>
        </View>
    )
};