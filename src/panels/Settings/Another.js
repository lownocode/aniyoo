import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import { 
    Panel
} from "../../components";

export const SettingsAnother = (props) => {
    const { 
        navigation: {
            goBack
        }
    } = props;

    return (
        <Panel
        headerProps={{
            title: "Настройки",
            subtitle: "Другое",
            backOnPress: () => goBack()
        }}
        >
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>
            </ScrollView>
        </Panel>
    )
};