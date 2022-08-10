import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

import { 
    Header,
} from "../../components";

export const SettingsAnother = (props) => {
    const { theme: { theme } } = useSelector(state => state);

    const { 
        navigation: {
            goBack
        }
    } = props;

    return (
        <View style={{ backgroundColor: theme.background_content, flex: 1 }}>
            <Header
            title="Настройки"
            subtitle="Другое"
            height={30}
            backButtonOnPress={() => goBack()}
            backButton
            />

            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -15 }}
            >
                <View style={{marginTop: 5, paddingTop: 15}}/>
            </ScrollView>
        </View>
    )
};