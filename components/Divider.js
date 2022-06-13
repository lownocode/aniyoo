import React, { useContext } from "react";
import { Dimensions, View, StyleSheet } from "react-native";

import themeContext from "../config/themeContext";

export const Divider = (props) => {
    const theme = useContext(themeContext);

    const { 
        dividerStyle, 
        indents = false,
        centerComponent,
    } = props;

    const { width } = Dimensions.get("window");

    const localStyles = StyleSheet.create({
        container: {
            flexDirection: "row", 
            justifyContent: "center", 
            alignItems: "center", 
            marginLeft: 20, 
            marginRight: 20, 
            overflow: indents ? "visible" : "hidden" 
        },
        dividerCenterComponent: {
            backgroundColor: theme.divider_color, 
            height: 0.5,
            width: width,
            ...dividerStyle
        },
        divider: {
            backgroundColor: theme.divider_color, 
            height: 0.5,
            marginLeft: indents ? 0 : 20,
            marginRight: indents ? 0 : 20,
            ...dividerStyle
        }
    });

    return (
        <>
            {
                centerComponent ? (
                    <View style={localStyles.container}>
                        <View style={localStyles.dividerCenterComponent}/>
                        
                        <View style={{ marginRight: 5, marginLeft: 5 }}>
                            {centerComponent}
                        </View>

                        <View style={localStyles.dividerCenterComponent}/>
                    </View>
                ) : (
                    <View style={localStyles.divider}/>
                )
            }
        </>
    )
};