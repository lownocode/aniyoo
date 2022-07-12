import React, { useContext } from "react";
import { ScrollView, View, Switch } from "react-native";

import { 
    Header,
    Cell,
    Icon
} from "../../components";

import ThemeContext from "../../config/ThemeContext";

export const SettingsAnother = (props) => {
    const theme = useContext(ThemeContext);

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