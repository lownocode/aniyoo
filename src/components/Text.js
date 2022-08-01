import React from "react";
import { Text as NativeText } from "react-native";

export const Text = (props) => {
    const {
        children,
        style
    } = props;
    
    return (
        <NativeText
        {...props}
        style={{
            ...style,
            fontFamily: "NotoSansDisplay",
        }}
        >
            {
                children
            }
        </NativeText>
    )
};