import React, { useContext } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import ThemeContext from "../config/ThemeContext";

export const WriteBar = (props) => {
    const theme = useContext(ThemeContext);

    const {
        placeholder,
        containerStyle,
        before,
        after,
        onChangeText,
        value,
        onChange,
        secureTextEntry,
        maxLength,
        textAlignVertical,
        textAlign,
        onSubmitEditing,
    } = props;

    const styles = StyleSheet.create({
        container: {
            ...containerStyle,
        },
        input: {
            backgroundColor: theme.input.background,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: theme.input.border,
            paddingLeft: before ? 35 : 10,
            paddingRight: after ? 45 : 10,
            color: theme.text_color,
            zIndex: 0,
            fontSize: 16,
            maxHeight: 300,
            zIndex: -1
        },
        before: {
            position: "absolute",
            marginLeft: 10,
            zIndex: 1
        },
        after: {
            position: "absolute",
            marginRight: 10,
            right: 0,
            bottom: 10
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.before}>
                {before}
            </View>

            <TextInput
            keyboardType="web-search"
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.input.placeholder}
            onChangeText={onChangeText}
            value={value}
            onChange={onChange}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            multiline
            textAlignVertical={textAlignVertical}
            textAlign={textAlign}
            onSubmitEditing={onSubmitEditing}
            />

            <View style={styles.after}>
                {after}
            </View>
        </View>
    )
};