import React, { useEffect } from "react"
import { View, ScrollView, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { Header } from ".";

export const Panel = props => {
    const { theme } = useSelector(state => state.theme);

    const {
        children,
        customHeader,
        headerShown = true,
        refreshControl,
        headerProps
    } = props;
    
    return (
        <View style={{ flex: 1, backgroundColor: theme.background_content }}>
            <StatusBar 
            barStyle={theme.name === "dark" ? "light-content" : "dark-content"} 
            backgroundColor="transparent"
            translucent
            />

            {
                customHeader || headerShown && <Header {...headerProps} />       
            }

            {
                children
            }
        </View>
    )
};